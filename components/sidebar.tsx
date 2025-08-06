"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Languages,
  BookOpen,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Language", href: "/dashboard/language", icon: Languages },
  { name: "Lessons", href: "/dashboard/lessons", icon: BookOpen },
  { name: "User Profile", href: "/dashboard/profile", icon: User },
  { name: "Setting", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800 text-white hover:bg-slate-700"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-80 bg-[#1F2937] bg-[#ffffff]/10 transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center p-6">
            <Link href="/dashboard">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={80}
              height={100}
              className="h-[100px] w-[80px] rounded-full object-cover"
            />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded px-4 py-3 text-[18px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#22A7D333]/20 text-white"
                        : "text-gray-300 hover:bg-[#22A7D333]/60 hover:text-white"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-[#22A7D333]/60 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Log Out"
        description="Are you sure you want to log out? You will be redirected to the login page."
      />
    </>
  );
}