"use client";

import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

interface AuthButtonProps {
  session: Session | null;
}

export function AuthButton({ session }: AuthButtonProps) {
  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 transition hover:bg-white/20"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("discord")}
      className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 transition hover:bg-white/20"
    >
      Connect Discord
    </button>
  );
}
