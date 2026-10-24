import React, { useState } from "react";
import {
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const bills = [
  {
    billNo: "BILL-1025",
    bookingId: "BM1025",
    customer: "Ameen",
    amount: 5000,
    date: "30 Sep 2026",
    status: "Paid",
  },
  {
    billNo: "BILL-1018",
    bookingId: "BM1018",
    customer: "Fathima",
    amount: 4500,
    date: "25 Sep 2026",
    status: "Paid",
  },
  {
    billNo: "BILL-1015",
    bookingId: "BM1015",
    customer: "Shameer",
    amount: 6200,
    date: "22 Sep 2026",
    status: "Paid",
  },
  {
    billNo: "BILL-1012",
    bookingId: "BM1012",
    customer: "Amina",
    amount: 4500,
    date: "20 Sep 2026",
    status: "Pending",
  },
  {
    billNo: "BILL-1008",
    bookingId: "BM1008",
    customer: "Rahman",
    amount: 7000,
    date: "18 Sep 2026",
    status: "Paid",
  },
];

export default function CreateBill() {
  const [search, setSearch] = useState("");

  const filteredBills = bills.filter((bill) => {
    const text = search.toLowerCase();

    return (
      bill.billNo.toLowerCase().includes(text) ||
      bill.bookingId.toLowerCase().includes(text) ||
      bill.customer.toLowerCase().includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          My Bills
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View bills created for your completed jobs.
        </p>

      </div>


      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <Summary
          title="Total Bills"
          value="24"
        />

        <Summary
          title="Paid Amount"
          value="₹1,18,500"
        />

        <Summary
          title="Pending Amount"
          value="₹4,500"
        />

      </div>


      {/* Search */}
      <div className="mb-5">

        <div className="relative max-w-xl">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by bill number, booking ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
          />

        </div>

      </div>


      {/* Bills Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b bg-gray-50">

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Bill No
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Booking ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-bold text-gray-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredBills.map((bill) => (
                <tr
                  key={bill.billNo}
                  className="border-b last:border-0 hover:bg-yellow-50/40"
                >

                  <td className="px-5 py-4 text-sm font-bold text-gray-900">
                    {bill.billNo}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {bill.bookingId}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {bill.customer}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-gray-900">
                    ₹{bill.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {bill.date}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        bill.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {bill.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-2">

                      <Link
                        to={`/operator/bills/${bill.billNo}`}
                        className="rounded-lg p-2 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                        title="View Bill"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() =>
                          alert(
                            "PDF download will be connected later."
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {filteredBills.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No bills found.
          </div>
        )}

      </div>


      {/* Pagination */}
      <div className="mt-5 flex justify-end gap-2">

        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ChevronLeft size={18} />
        </button>

        <button className="h-9 w-9 rounded-lg bg-yellow-500 text-sm font-bold text-black">
          1
        </button>

        <button className="h-9 w-9 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
          2
        </button>

        <button className="h-9 w-9 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
          3
        </button>

        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ChevronRight size={18} />
        </button>

      </div>

    </div>
  );
}

function Summary({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}