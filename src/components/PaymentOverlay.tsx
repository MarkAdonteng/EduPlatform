import React from 'react';
import { LockKeyhole } from 'lucide-react';

const PaymentOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="text-center p-6 space-y-3">
          <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
            <LockKeyhole className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600">Access Restricted</h2>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <p className="text-lg font-medium">
            This site requires payment to access
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="font-medium">Contact the developer:</p>
            <p>Email: adontengm6@gmail.com</p>
            <p>WhatsApp: +233592762255</p>
          </div>
          
          <p className="text-sm text-gray-600">
            After payment confirmation, you will receive full access to all features
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverlay;