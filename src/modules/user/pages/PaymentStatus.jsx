
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  const verifyPayment = async () => {
    try {
      if (!orderId) {
        setStatus("failed");
        setMessage("Payment order ID is missing.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setStatus("failed");
        setMessage("Please login to verify your payment.");
        return;
      }

      setStatus("checking");
      setMessage("Verifying your payment with Cashfree...");

      const response = await fetch(
        `${API}/payments/verify/${encodeURIComponent(orderId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Payment verification failed."
        );
      }

      if (data.paymentStatus === "PAID") {
        setStatus("success");
        setMessage("Your payment has been completed successfully.");
      } else if (data.paymentStatus === "PENDING") {
        setStatus("pending");
        setMessage(
          "Payment is not confirmed yet. Please check again after some time."
        );
      } else {
        setStatus("failed");
        setMessage(
          data.message || "Payment was not successful."
        );
      }
    } catch (error) {
      setStatus("failed");
      setMessage(error.message || "Unable to verify payment.");
    }
  };

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

        {status === "checking" && (
          <>
            <RefreshCw
              size={60}
              className="mx-auto animate-spin text-yellow-500"
            />

            <h1 className="mt-5 text-2xl font-bold text-[#0B1D2B]">
              Verifying Payment
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={65}
              className="mx-auto text-green-500"
            />

            <h1 className="mt-5 text-2xl font-bold text-green-700">
              Payment Successful!
            </h1>
          </>
        )}

        {status === "pending" && (
          <>
            <Clock3
              size={65}
              className="mx-auto text-yellow-500"
            />

            <h1 className="mt-5 text-2xl font-bold text-[#0B1D2B]">
              Payment Pending
            </h1>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle
              size={65}
              className="mx-auto text-red-500"
            />

            <h1 className="mt-5 text-2xl font-bold text-red-600">
              Verification Failed
            </h1>
          </>
        )}

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {message}
        </p>

        {orderId && (
          <p className="mt-4 break-all rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            Order ID: {orderId}
          </p>
        )}

        {status === "pending" && (
          <button
            onClick={verifyPayment}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 font-semibold text-[#0B1D2B] hover:bg-yellow-500"
          >
            <RefreshCw size={17} />
            Check Payment Again
          </button>
        )}

        <Link
          to="/user/payments"
          className="mt-5 block w-full rounded-xl bg-[#0B1D2B] py-3 font-semibold text-white hover:bg-[#16374c]"
        >
          Go to My Payments
        </Link>
      </div>
    </div>
  );
}
