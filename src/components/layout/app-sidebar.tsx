
"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  Compass,
  Lightbulb,
  Settings,
  LogOut,
  GraduationCap,
  PlusCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const mainNav = [
  { name: "Knowledge Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Explore Courses", icon: Compass, href: "/dashboard/explore" },
  { name: "My Certificates", icon: GraduationCap, href: "/dashboard/certificates" },
];

const instructorNav = [
  { name: "Course Creator Portal", icon: PlusCircle, href: "/dashboard/creator" },
  { name: "Student Management", icon: Users, href: "/dashboard/students" },
  { name: "AI Assistant", icon: Lightbulb, href: "/dashboard/ai-assistant" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="h-16 flex items-center px-6">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">Lumina Academy</span>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learner</SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Instructor</SidebarGroupLabel>
          <SidebarMenu>
            {instructorNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-4 group-data-[collapsible=icon]:hidden">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
