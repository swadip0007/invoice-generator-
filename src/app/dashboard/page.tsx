"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const loadInvoiceCount = async () => {
      try {
        const { count } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setInvoiceCount(count || 0);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoadingInvoices(false);
      }
    };

    loadInvoiceCount();
  }, [user, authLoading, router]);

  if (authLoading || loadingInvoices) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Invoice Generator</h1>
          <button
            onClick={signOut}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Body */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}! 👋
          </h2>
          <p className="mt-2 text-gray-600">Manage your invoices from one place.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Invoices</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{invoiceCount}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Account</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{profile?.email || user?.email}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Create a new invoice</h3>
          <p className="mt-2 text-gray-600">
            Add your client details, products, taxes and generate a professional invoice.
          </p>
          <button
            onClick={() => router.push("/invoices/create")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Create Invoice
          </button>
        </div>
      </div>
    </main>
  );
}