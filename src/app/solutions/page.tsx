import type { Metadata } from "next";
import { SolutionsContent } from "./SolutionsContent";

export const metadata: Metadata = {
  title: "Solutions — ClientGateway",
  description: "ClientGateway helps businesses solve real financial operations problems. See how we help startups, enterprises, and accounting firms.",
};

export default function SolutionsPage() {
  return <SolutionsContent />;
}
