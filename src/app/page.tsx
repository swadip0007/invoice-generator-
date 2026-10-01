import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      {/* Navigation Bar */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-90 transition">
            Invoice<span className="text-gray-900">Gen</span>
          </Link>
  
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition px-3 py-2 rounded-lg"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            Simple & Fast Invoicing
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Create Professional Invoices in Seconds
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Manage your clients, itemize products, calculate taxes, and generate downloadable PDF invoices with ease.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white border border-gray-300 px-6 py-3.5 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Instant PDF Invoices</h3>
            <p className="mt-2 text-sm text-gray-600">
              Generate clean, client-ready PDF invoices with custom taxes, item details, and discounts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Secure Cloud Storage</h3>
            <p className="mt-2 text-sm text-gray-600">
              All your invoices and user profiles are safely stored in your Supabase database.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Dedicated Dashboard</h3>
            <p className="mt-2 text-sm text-gray-600">
              Track your invoice history and manage previous records easily in one dashboard.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Invoice Generator. All rights reserved.
      </footer>
    </div>
  );
}
