import "@/app/globals.css";
import { Inter } from "next/font/google";

import { DashboardSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Noema",
  description: "A simple dashboard with a request form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex h-screen w-screen flex-col md:flex-row">
            <DashboardSidebar />
            <SidebarInset className="flex-1 overflow-auto">
              <Header />
              <main className="p-4 md:p-6">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
