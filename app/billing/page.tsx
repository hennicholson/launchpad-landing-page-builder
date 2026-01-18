import { getBillingInfo } from "@/lib/actions/billing";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

// This is a Server Component - data is fetched during SSR when Whop auth headers are available
export default async function BillingPage() {
  const result = await getBillingInfo();

  if (!result.success || !result.data) {
    // User not authenticated or error fetching data
    redirect("/dashboard");
  }

  return <BillingClient billingData={result.data} />;
}
