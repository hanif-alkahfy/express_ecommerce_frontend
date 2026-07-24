import { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { authService } from '../../services/authService';
import { handleApiError } from '../../utils/apiError';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { token: tokenParam } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token') || tokenParam;

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing');
        return;
      }

      try {
        const response = await authService.verify(token);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(handleApiError(error));
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verification Successful' : 'Verification Failed'}
            </h3>
            <p className="text-sm text-gray-500">
              {status === 'loading' 
                ? 'Please wait while we verify your email...' 
                : status === 'success'
                ? 'Your email has been verified successfully. Redirecting to login...'
                : 'There was a problem verifying your email.'}
            </p>
          </div>
          <div className="p-6 pt-0">
            {status === 'loading' && (
              <div className="flex justify-center py-4">
                <Spinner size="xl" />
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-green-600 mb-4">{message}</p>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 hover:bg-gray-800 text-white h-10 px-4 py-2 w-full"
                >
                  Go to Login
                </Link>
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-red-600 mb-4">{message}</p>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 h-10 px-4 py-2 w-full"
                >
                  Register Again
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
