import React from 'react';
import { LockKeyhole } from 'lucide-react';

const PaymentOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="text-center p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
          <div className="mx-auto bg-red-100 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center">
            <LockKeyhole className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">
            Access Restricted
          </h2>
        </div>
        
        {/* Content Section */}
        <div className="p-4 sm:p-5 md:p-6 text-center space-y-3 sm:space-y-4">
          <p className="text-base sm:text-lg font-medium">
            This site requires payment to access
          </p>
          
          {/* Contact Box */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
            <p className="font-medium text-sm sm:text-base">Contact the developer:</p>
            <div className="space-y-1 text-sm sm:text-base">
              <p className="break-words">Email: adontengm6@gmail.com</p>
              <p>WhatsApp: +233592762255</p>
            </div>
          </div>
          
          {/* Footer Text */}
          <p className="text-xs sm:text-sm text-gray-600 px-2">
            After payment confirmation, you will receive full access to all features
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverlay;