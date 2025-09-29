import { toDateTime } from '@/lib/utils/helpers';
import { stripe } from '@/lib/utils/stripe/config';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database, Tables, TablesInsert } from 'types_db';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file.',
      );
    }

    supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey);
  }
  return supabaseAdmin;
};

const upsertProductRecord = async (product: Stripe.Product) => {
  const admin = getSupabaseAdmin();
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error: upsertError } = await admin
    .from('products')
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  // eslint-disable-next-line no-console
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const admin = getSupabaseAdmin();
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    description: price.nickname ?? null,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    metadata: price.metadata ?? null,
  };

  const { error: upsertError } = await admin.from('prices').upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      // eslint-disable-next-line no-console
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`,
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  const admin = getSupabaseAdmin();
  const { error: deletionError } = await admin
    .from('products')
    .delete()
    .eq('id', product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  // eslint-disable-next-line no-console
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  const admin = getSupabaseAdmin();
  const { error: deletionError } = await admin
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`);
  // eslint-disable-next-line no-console
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const admin = getSupabaseAdmin();
  const { error: upsertError } = await admin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`,
    );

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const admin = getSupabaseAdmin();
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } = await admin
    .from('customers')
    .select('*')
    .eq('id', uuid)
    .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id,
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await admin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`,
        );
      // eslint-disable-next-line no-console
      console.warn(
        'Supabase customer record mismatched Stripe ID. Supabase record updated.',
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      'Supabase customer record was missing. A new record was created.',
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert,
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod,
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await getSupabaseAdmin()
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq('id', uuid);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
};

/**
 * Adds pro_credits to a user. Ensures credits are only added once.
 * Uses the credits_added_for_subscription metadata field to track which subscriptions
 * have already resulted in credits being added.
 * Sets credits to exactly 100 instead of adding to existing credits.
 * Gets the user_id from the subscriptions table based on the subscription ID.
 */
// const addProCreditsForSubscription = async (
//   subscriptionId: string,
//   customerId: string,
//   creditsToAdd: number = 100
// ) => {
//   try {
//     // First, get the user ID from the subscriptions table
//       const { data: customerData, error: noCustomerError } =
//     await getSupabaseAdmin()
//       .from('customers')
//       .select('id')
//       .eq('stripe_customer_id', customerId)
//       .single();

//   if (noCustomerError)
//     throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

//   const { id: uuid } = customerData!;
//   const userId = uuid;
    
//     // Now get the user data to check if credits have already been added
//     const { data: userData, error: getUserError } = await getSupabaseAdmin()
//       .from('users')
//       .select('pro_credits, metadata')
//       .eq('id', userId)
//       .single();
    
//     if (getUserError) {
//       console.error(`Failed to get user data: ${getUserError.message}`);
//       return false;
//     }
    
//     // Initialize metadata if it doesn't exist
//     const metadata = userData?.metadata || {};
//     const creditsAddedForSubscriptions = metadata.credits_added_for_subscription || [];
    
//     // Check if we've already added credits for this subscription
//     if (creditsAddedForSubscriptions.includes(subscriptionId)) {
//       console.log(`Credits already added for subscription [${subscriptionId}] to user [${userId}], skipping`);
//       return false;
//     }
    
//     // Set credits to exactly 100 (renew) instead of adding to existing credits
//     const newCredits = creditsToAdd;
//     creditsAddedForSubscriptions.push(subscriptionId);
    
//     const { error: updateError } = await getSupabaseAdmin()
//       .from('users')
//       .update({
//         pro_credits: newCredits,
//         metadata: {
//           ...metadata,
//           credits_added_for_subscription: creditsAddedForSubscriptions
//         }
//       })
//       .eq('id', userId);
    
//     if (updateError) {
//       console.error(`Failed to update pro_credits: ${updateError.message}`);
//       return false;
//     }
    
//     console.log(`Set pro_credits to ${creditsToAdd} for user [${userId}] for subscription [${subscriptionId}]`);
//     return true;
//   } catch (error) {
//     console.error('Error in addProCreditsForSubscription:', error);
//     return false;
//   }
// };

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } =
    await getSupabaseAdmin()
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start,
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end,
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const { error: upsertError } = await getSupabaseAdmin()
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`,
    );
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
  );


  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    );
};

const addProCreditsForSubscription = async (subscriptionId: string) => {
  try {
    // Get subscription details to find the user
    const { data: subscription, error: subscriptionError } = await getSupabaseAdmin()
      .from('subscriptions')
      .select('id, user_id')
      .eq('id', subscriptionId)
      .single();
    
    if (subscriptionError || !subscription) {
      throw new Error(`Subscription [${subscriptionId}] not found: ${subscriptionError?.message || 'No data returned'}`);
    }
    
    // Get user details
    const { data: user, error: userError } = await getSupabaseAdmin()
      .from('users')
      .select('id, pro_credits')
      .eq('id', subscription.user_id)
      .single();
    
    if (userError || !user) {
      throw new Error(`User [${subscription.user_id}] not found: ${userError?.message || 'No data returned'}`);
    }
    
    // Renew pro_credits by setting to 100 when subscription is active
    const { error: updateError } = await getSupabaseAdmin()
      .from('users')
      .update({
        pro_credits: 100
      })
      .eq('id', subscription.user_id);
    
    if (updateError) {
      throw new Error(`Failed to update pro_credits: ${updateError.message}`);
    }
    
    console.log(`Renewed pro_credits to 100 for user [${subscription.user_id}] for active subscription [${subscriptionId}]`);
    return true;
  } catch (error) {
    console.error('Error renewing pro_credits for active subscription:', error);
    return false;
  }
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  addProCreditsForSubscription,
  getSupabaseAdmin,
};
