import React from 'react';

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-green-600">✅ Payment Successful</h2>
      <p className="mt-4 text-gray-700 text-center">
        Thank you for your donation! <br />
        Your payment has been received successfully.
      </p>
    </div>
  );
};

export default Success;

