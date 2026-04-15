"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center w-full p-2 text-red-400 hover:bg-red-950 rounded-lg transition-colors"
    >
      <LogOut className="w-5 h-5 mr-3" /> Logout
    </button>
  );
}
