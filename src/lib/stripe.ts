import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil" as Stripe.LatestApiVersion,
      typescript: true,
    })
  : null;

export const PLANS = {
  free: {
    name: "Free",
    description: "For individuals getting started",
    price: 0,
    stripePriceId: null,
    features: [
      "Up to 5 clients",
      "Up to 10 invoices/month",
      "Basic payment tracking",
    ],
    limits: { clients: 5, invoices: 10 },
  },
  pro: {
    name: "Pro",
    description: "For growing businesses",
    price: 29,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: [
      "Unlimited clients",
      "Unlimited invoices",
      "Advanced analytics",
      "Priority support",
    ],
    limits: { clients: Infinity, invoices: Infinity },
  },
} as const;

export type PlanType = keyof typeof PLANS;
