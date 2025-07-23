'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const PaymentForm = () => {
  const [dataFromForm, setDataFromForm] = useState({
    mpesa_phone: '',
    name: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataFromForm({
      ...dataFromForm,
      [e.target.name]: e.target.value,
    });
  };

  const verifyPayment = async (CheckoutRequestID: string) => {
    try {
      const response = await fetch('/api/query-stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CheckoutRequestID }),
      });

      const result = await response.json();
      console.log('Query result:', result);

      if (result.ResultCode === '0') {
        toast.success('✅ Payment successful!');
        setShowConfetti(true);
        setDataFromForm({ mpesa_phone: '', name: '', amount: '' });

        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        toast.error(`❌ Payment failed: ${result.ResultDesc || 'Unknown error'}`);
      }
    } catch (error: any) {
      toast.error('❌ Failed to confirm payment.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('📲 Sending payment request...');

    try {
      const res = await fetch('/api/send-stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mpesa_number: dataFromForm.mpesa_phone,
          name: dataFromForm.name,
          amount: Number(dataFromForm.amount),
        }),
      });

      const result = await res.json();
      console.log('STK result:', result);

      if (!res.ok || !result.CheckoutRequestID) {
        throw new Error(result.error || 'STK push failed');
      }

      toast.dismiss(loadingToast);
      toast.success('📲 Request sent! Waiting for confirmation...');

      await new Promise((resolve) => setTimeout(resolve, 10000));
      await verifyPayment(result.CheckoutRequestID);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} />}

      {loading ? (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>

          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-100 rounded w-full"></div>

          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-100 rounded w-full"></div>

          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-100 rounded w-full"></div>

          <div className="h-10 bg-blue-200 rounded w-full"></div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-4 p-4 bg-white rounded shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>

          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={dataFromForm.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="mpesa_phone"
              value={dataFromForm.mpesa_phone}
              onChange={handleChange}
              required
              placeholder="e.g. 0712345678"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={dataFromForm.amount}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Pay Now'}
          </button>
        </form>
      )}
    </>
  );
};

export default PaymentForm;










