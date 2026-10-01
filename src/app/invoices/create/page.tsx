"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface InvoiceItem {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  tax: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      itemName: "",
      quantity: 1,
      price: 0,
      tax: 0,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        itemName: "",
        quantity: 1,
        price: 0,
        tax: 0,
      },
    ]);
  };

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const deleteItem = (id: number) => {
    if (items.length === 1) {
      return;
    }

    setItems(items.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const calculateTax = () => {
    return items.reduce((total, item) => {
      const itemSubtotal = item.quantity * item.price;

      return total + (itemSubtotal * item.tax) / 100;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = calculateTax();
  const total = subtotal + taxAmount;

  const handleSaveInvoice = async () => {
    setError("");

    // Basic validation
    if (!invoiceNumber.trim()) {
      setError("Please enter an invoice number.");
      return;
    }

    if (!invoiceDate) {
      setError("Please select an invoice date.");
      return;
    }

    if (!clientName.trim()) {
      setError("Please enter the client name.");
      return;
    }

    if (!billingAddress.trim()) {
      setError("Please enter the billing address.");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one invoice item.");
      return;
    }

    const invalidItem = items.find(
      (item) =>
        !item.itemName.trim() ||
        item.quantity <= 0 ||
        item.price < 0 ||
        item.tax < 0
    );

    if (invalidItem) {
      setError("Please enter valid details for all invoice items.");
      return;
    }

    setSaving(true);

    try {
      // 1. Validate logged-in user
      if (!user) {
        setError("You must be logged in to create an invoice.");
        return;
      }

      // 2. Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          invoice_number: invoiceNumber.trim(),
          invoice_date: invoiceDate,
          client_name: clientName.trim(),
          billing_address: billingAddress.trim(),
          subtotal: subtotal,
          tax: taxAmount,
          total: total,
        })
        .select("id")
        .single();

      if (invoiceError) {
        console.error("Invoice error:", invoiceError);
        setError(invoiceError.message);
        return;
      }

      if (!invoice) {
        setError("Invoice could not be created.");
        return;
      }

      // 3. Prepare invoice items
      const invoiceItems = items.map((item) => {
        const itemSubtotal = item.quantity * item.price;
        const itemTax = (itemSubtotal * item.tax) / 100;
        const itemAmount = itemSubtotal + itemTax;

        return {
          invoice_id: invoice.id,
          item_name: item.itemName.trim(),
          quantity: item.quantity,
          price: item.price,
          tax: item.tax,
          amount: itemAmount,
        };
      });

      // 4. Save invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) {
        console.error("Invoice items error:", itemsError);

        // Remove the invoice if items failed to save
        await supabase
          .from("invoices")
          .delete()
          .eq("id", invoice.id);

        setError(
          `Invoice items could not be saved: ${itemsError.message}`
        );

        return;
      }

      // 5. Success
      alert("Invoice created successfully!");

      // 6. Go to invoice history
      router.push("/invoices");
    } catch (error) {
      console.error("Save invoice error:", error);

      setError("Something went wrong while saving the invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Invoice
            </h1>

            <p className="mt-2 text-gray-600">
              Create a professional invoice for your client.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Invoice Details */}
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Invoice Details
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Invoice Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Invoice Number
              </label>

              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-001"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:border-blue-500"
              />
            </div>

            {/* Invoice Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Invoice Date
              </label>

              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500"
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Client Name
              </label>

              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:border-blue-500"
              />
            </div>

            {/* Billing Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Billing Address
              </label>

              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter billing address"
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Invoice Items
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add products or services to this invoice.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Add Item
            </button>
          </div>

          {/* Items */}
          <div className="mt-6 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Item {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    disabled={items.length === 1}
                    className="text-sm font-medium text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  {/* Item Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Item Name
                    </label>

                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) =>
                        updateItem(item.id, "itemName", e.target.value)
                      }
                      placeholder="Product name"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-black placeholder:text-gray-400 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-black outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-black outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Tax */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Tax (%)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.tax}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "tax",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-black outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Item Amount */}
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Item Total
                    </p>

                    <p className="text-lg font-bold text-gray-900">
                      ₹
                      {(
                        item.quantity *
                        item.price *
                        (1 + item.tax / 100)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm rounded-lg bg-gray-50 p-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>

                <span className="font-medium text-gray-900">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>

                <span className="font-medium text-gray-900">
                  ₹{taxAmount.toFixed(2)}
                </span>
              </div>

              <div className="my-4 border-t border-gray-200" />

              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-blue-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSaveInvoice}
            disabled={saving}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving Invoice..." : "Save Invoice"}
          </button>
        </div>
      </div>
    </main>
  );
}