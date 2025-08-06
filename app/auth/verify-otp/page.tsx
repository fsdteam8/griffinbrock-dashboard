import { OTPVerificationForm } from "@/components/auth/otp-verification-form";
import { Suspense } from "react";

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense>
        <OTPVerificationForm />
      </Suspense>
    </div>
  );
}
