import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
