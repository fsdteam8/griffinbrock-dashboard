import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Log Out",
  description = "Are you sure you want to log out? You will be redirected to the login page.",
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{description}</p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            className="border-gray-600 hover:bg-slate-700 text-black hover:text-white"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}