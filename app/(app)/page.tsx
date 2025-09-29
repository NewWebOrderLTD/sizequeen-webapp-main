import { Hero, OurPlan } from '@/components/sections';
import PostMessageToPlugin from '@/components/sections/PostMessageToPlugin';
import { getUser, getSubscription } from '@/lib/utils/supabase/queries';
import { createClient, getSession } from '@/lib/utils/supabase/server';
import { Tables } from '@/types_db';

type Price = Tables<'prices'>;
type Product = Tables<'products'>;

interface ProductWithPrices extends Product {
  prices: Price[];
}

export default async function HomePage() {
  // Initialize default values
  let user = null;
  let subscription = null;
  let products: ProductWithPrices[] = [];
  const session = await getSession();

  try {
    // Only try to connect to Supabase if environment variables are set
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = await createClient();
      
      // Get user and subscription data
      [user, subscription] = await Promise.all([
        getUser(supabase),
        getSubscription(supabase),
      ]);
      
      // Fetch products with their prices
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, prices(*)')
        .eq('active', true);
      
      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else if (productsData) {
        // Transform the data to match the expected format
        products = productsData.map(product => ({
          ...product,
          prices: product.prices as Price[]
        }));
      }
    } else {
      console.warn('Supabase not configured. Using fallback data for development.');
    }
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    // Continue with empty values - the component will handle it gracefully
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <PostMessageToPlugin session={session!} />
      <Hero />
      <OurPlan
        user={user}
        subscription={subscription}
        products={products}
      />
    </div>
  );
}
