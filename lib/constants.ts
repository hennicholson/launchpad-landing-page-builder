// Whop IDs - single source of truth for both client and server
// Product ID = used for checking access (users.checkAccess)
export const LAUNCHPAD_PRO_PRODUCT_ID = "prod_89B43fctKY2Uf";

// Plan ID = used for checkout URLs (whop.com/checkout/plan_xxx)
export const LAUNCHPAD_PRO_PLAN_ID = "plan_8Q63YdrFziMUy";

// Top-up Plans Configuration
// After creating top-up products in Whop dashboard, add the plan IDs here
// Then update the topup_plans table with these IDs
export const TOPUP_PLANS = {
  FIVE: {
    name: "Starter",
    amountCents: 500,
    credits: 500,
    whopPlanId: null as string | null, // TODO: Add Whop plan ID after creating product
  },
  TEN: {
    name: "Basic",
    amountCents: 1000,
    credits: 1000,
    whopPlanId: null as string | null, // TODO: Add Whop plan ID after creating product
  },
  TWENTY: {
    name: "Standard",
    amountCents: 2000,
    credits: 2000,
    whopPlanId: null as string | null, // TODO: Add Whop plan ID after creating product
  },
  TWENTY_NINE: {
    name: "Popular",
    amountCents: 2900,
    credits: 2900,
    whopPlanId: null as string | null, // TODO: Add Whop plan ID after creating product
    isFeatured: true,
  },
};

// Pro subscription cost in credits (same as $29)
export const PRO_SUBSCRIPTION_CREDITS = 2900;
