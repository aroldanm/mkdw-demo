import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => void;
}

export function SignInModal({ isOpen, onClose, onSignIn }: SignInModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn('demo@example.com', 'password');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl p-8">
          <div className="flex justify-end mb-2">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-[32px] font-bold mb-2">Unlimited free access</h2>
            <p className="text-[18px] text-gray-600">Sign up to see more</p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-[15px]"
            >
              <span>Continue with email</span>
            </button>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-[15px]"
            >
              {/* Google's official logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-[15px]"
            >
              {/* Apple's official logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.24,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z" fill="#000"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              By continuing, you agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Terms of Service</a>
            </p>
            <p>
              and acknowledge you've read our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Privacy Policy</a>.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already a member?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Log in</a>
            </p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}