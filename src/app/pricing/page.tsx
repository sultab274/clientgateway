import type { Metadata } from "next";
import { PricingContent } from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing — ClientGateway",
  description: "Simple, transparent pricing for every business. Start free, upgrade when you're ready.",
};

export default function PricingPage() {
  return <PricingContent />;
}
