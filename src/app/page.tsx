
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Invoice Generator
        </h1>

        <p className="mt-4 text-gray-600">
          Create professional invoices easily.
        </p>

        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
          Create Invoice
        </button>
      </div>
    </main>
  );
}
