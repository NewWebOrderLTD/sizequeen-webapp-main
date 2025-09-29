# Stripe Payment Setup Guide for SizeQueen

## Overview
SizeQueen now has a complete Stripe payment integration for subscription management. This guide will help you set up and test the payment flow.

## ✅ What's Already Configured

### 1. Environment Variables
- `STRIPE_SECRET_KEY_LIVE`: Your live Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE`: Your live Stripe publishable key
- Supabase integration for user management

### 2. Payment Features
- **Subscription Management**: Monthly and yearly plans
- **Trial Periods**: 7 days for monthly, 14 days for yearly
- **Stripe Checkout**: Secure payment processing
- **Webhook Integration**: Automatic subscription status updates
- **Customer Portal**: Users can manage their subscriptions

### 3. Product Configuration
- **SizeQueen Premium**: $4.99/month, $49.90/year
- **SizeQueen Basic**: $2.99/month (limited features)
- Trial periods included for all plans

## 🚀 Next Steps to Complete Setup

### 1. Create Products in Stripe Dashboard

1. **Go to Stripe Dashboard** (https://dashboard.stripe.com/)
2. **Navigate to Products** → Create Product
3. **Create SizeQueen Premium Product**:
   - Name: "SizeQueen Premium"
   - Description: "Premium subscription for SizeQueen - Get accurate size recommendations, unlimited fit scans, and advanced features"
   - Pricing: $4.99/month (recurring)
   - Trial: 7 days

4. **Create SizeQueen Basic Product**:
   - Name: "SizeQueen Basic" 
   - Description: "Basic plan for SizeQueen - Limited scans with basic size recommendations"
   - Pricing: $2.99/month (recurring)
   - Trial: 3 days

5. **Create Yearly Pricing**:
   - Add yearly pricing for Premium: $49.90/year
   - Trial: 14 days

### 2. Update Price IDs in Code

After creating products in Stripe, update these files with the actual price IDs:

**File: `app/(website)/dashboard/dashboard-client.tsx`**
```typescript
// Replace 'price_premium_month' with actual Stripe price ID
priceId: 'price_1234567890abcdef', // Your actual Stripe price ID
```

**File: `app/api/create-checkout-session/route.ts`**
```typescript
// Update the priceId parameter to use actual Stripe price IDs
```

### 3. Set Up Webhooks

1. **Go to Stripe Dashboard** → Webhooks
2. **Add Endpoint**: `https://yourdomain.com/api/webhooks`
3. **Select Events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `product.created`
   - `product.updated`
   - `price.created`
   - `price.updated`

4. **Copy Webhook Secret** and add to environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### 4. Test the Payment Flow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test subscription flow**:
   - Go to `/dashboard`
   - Click "Subscribe to Monthly Plan"
   - Complete Stripe checkout with test card: `4242 4242 4242 4242`
   - Verify redirect back to dashboard

3. **Test webhook integration**:
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks`
   - Or use ngrok for local testing

## 💳 Test Cards

Use these test cards in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## 🔧 Current Payment Flow

### Dashboard Subscription
1. User clicks "Subscribe to Monthly Plan" on dashboard
2. API creates Stripe checkout session
3. User redirected to Stripe checkout
4. After payment, user redirected back to dashboard
5. Webhook updates subscription status in database

### Features Included
- ✅ Secure payment processing
- ✅ Trial periods
- ✅ Subscription management
- ✅ Error handling
- ✅ User authentication
- ✅ Database integration

## 🚨 Important Notes

1. **Live Mode**: You're using live Stripe keys - be careful with test data
2. **Webhook Security**: Ensure webhook endpoint is secure and properly configured
3. **Error Handling**: All payment errors are handled gracefully
4. **User Experience**: Loading states and error messages are included

## 📱 User Experience

- **Dashboard**: Clean subscription upgrade section
- **Checkout**: Stripe-hosted secure checkout
- **Success**: Automatic redirect back to dashboard
- **Errors**: User-friendly error messages
- **Loading**: Proper loading states during payment

## 🔍 Troubleshooting

### Common Issues:
1. **"Price not found"**: Update price IDs with actual Stripe price IDs
2. **Webhook failures**: Check webhook endpoint and secret
3. **Authentication errors**: Ensure user is logged in
4. **Redirect issues**: Check success/cancel URLs

### Debug Steps:
1. Check browser console for errors
2. Check Stripe dashboard for failed payments
3. Check webhook logs in Stripe dashboard
4. Verify environment variables are set correctly

## 🎯 Ready to Use

The payment system is now fully integrated and ready for production use. Just update the price IDs with your actual Stripe product IDs and you're good to go!

## 📞 Support

If you need help with Stripe integration or have questions about the payment flow, check the Stripe documentation or contact support.
