import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
      <p className="text-gray-500 mb-6">Your payment was cancelled. No charges were made to your account.</p>
      
      <div className="flex gap-4">
        <Link
          to="/checkout"
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </Link>
        <Link
          to="/cart"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
