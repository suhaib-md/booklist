"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookCopy,
  BarChart3,
  Wrench,
  Sparkles,
  Leaf,
  LogOut,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "My Books", icon: BookCopy },
  { href: "/stats", label: "Statistics", icon: BarChart3 },
  { href: "/suggestions", label: "Suggestions", icon: Sparkles },
];

const adminNavItem = { href: "/admin", label: "Admin Panel", icon: Wrench };

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const allNavItems = isAuthenticated ? [...navItems, adminNavItem] : navItems;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader className="p-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-semibold font-headline text-primary"
            >
              <Leaf className="w-6 h-6" />
              <span>Earthy Reads</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            {allNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="font-headline"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {isAuthenticated ? (
                <Button variant="ghost" className="justify-start" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
                </Button>
            ) : (
                <Button variant="ghost" className="justify-start" onClick={() => router.push('/login')}>
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
                </Button>
            )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background/80 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <Link
            href="/"
            className="flex items-center gap-2 ml-4 text-lg font-semibold font-headline text-primary"
          >
            <Leaf className="w-5 h-5" />
            <span>Earthy Reads</span>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
