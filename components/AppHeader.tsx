"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Music2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { ThemeSelector } from "@/components/ThemeSelector";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    icon: LayoutDashboard,
  },
  {
    href: "/add",
    label: "Add Concert",
    shortLabel: "Add",
    icon: PlusCircle,
  },
  {
    href: "/concerts",
    label: "My Concerts",
    shortLabel: "List",
    icon: Music2,
  },
];

export function AppHeader({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Couldn't log out. Please try again.");
      setLoggingOut(false);
      return;
    }
    toast.success("Logged out. See you next show!");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-base-300 bg-base-200/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Concert Cost Tracker
            </p>
            <p className="mt-1 max-w-xl text-sm text-base-content/70">
              Track what you spend, how far you go, and how much fun each show
              actually was.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ThemeSelector />
            <div className="flex items-center gap-2 rounded-box border border-base-300 bg-base-100 px-3 py-2">
              <span className="max-w-48 truncate text-sm sm:max-w-64">
                {email}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <LogOut className="size-4" />
                )}
                Log out
              </button>
            </div>
          </div>
        </div>

        <nav className="tabs tabs-box w-full bg-base-100 p-1" aria-label="Main">
          {NAV.map(({ href, label, shortLabel, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`tab grow gap-2 ${active ? "tab-active" : ""}`}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
