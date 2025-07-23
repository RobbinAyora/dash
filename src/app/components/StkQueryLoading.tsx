import React from 'react';

interface STKPushQueryLoadingProps {
  number: string;
}

const STKPushQueryLoading: React.FC<STKPushQueryLoadingProps> = ({ number }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <svg
        className="animate-spin h-10 w-10 text-orange-500 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <h2 className="text-xl font-semibold text-gray-800">Awaiting Payment Confirmation...</h2>
      <p className="mt-2 text-gray-600 text-center">
        Please complete the payment on your phone.
        <br />
        Prompt sent to: <span className="font-medium text-black">{number}</span>
      </p>
    </div>
  );
};

export default STKPushQueryLoading;

