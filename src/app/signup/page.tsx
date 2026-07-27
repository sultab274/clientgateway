import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up — ClientGateway",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <SignupForm />
    </main>
  );
}
