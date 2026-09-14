
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Profile {
  full_name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // No user → login
        if (!user) {
          router.push("/login");
          return;
        }

        // Get profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Get invoice count
        const { count } = await supabase
          .from("invoices")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id);

        setInvoiceCount(count || 0);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  if (loading) {
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

          <h1 className="text-xl font-bold text-gray-900">
            Invoice Generator
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Dashboard */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
            {profile?.full_name ? `, ${profile.full_name}` : ""}! 👋
          </h2>

          <p className="mt-2 text-gray-600">
            Manage your invoices from one place.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Invoices
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {invoiceCount}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Account
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {profile?.email}
            </p>
          </div>

        </div>

        {/* Create Invoice */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">

          <h3 className="text-xl font-bold text-gray-900">
            Create a new invoice
          </h3>

          <p className="mt-2 text-gray-600">
            Add your client details, products, taxes and generate a
            professional invoice.
          </p>

          <button
            onClick={() => router.push("/invoices/create")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Create Invoice
          </button>

        </div>

        {/* Invoice History */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Invoice History
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your previous invoices.
              </p>
            </div>

            <button
              onClick={() => router.push("/invoices")}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View All
            </button>

          </div>

          {invoiceCount === 0 && (
            <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center">
              <p className="text-gray-500">
                You haven't created any invoices yet.
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Create your first invoice to get started.
              </p>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}

