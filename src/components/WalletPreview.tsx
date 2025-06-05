
import React, { forwardRef } from 'react';
import { CircularProgress } from './CircularProgress';

interface WalletPreviewProps {
  formData: {
    name: string;
    balance: string;
    bank: string;
    pixKey: string;
    status: number;
  };
  isShaking: boolean;
  translations: (key: string) => string;
}

export const WalletPreview = forwardRef<HTMLDivElement, WalletPreviewProps>(
  ({ formData, isShaking, translations: t }, ref) => {
    return (
      <div className="relative">
        {/* iPhone Frame */}
        <div className={`
          relative w-[375px] h-[812px] bg-black rounded-[50px] 
          shadow-2xl shadow-black/50 p-[20px] pt-[40px] pb-[60px]
          transition-transform duration-300
          ${isShaking ? 'animate-shake' : ''}
        `}>
          {/* iPhone Notch */}
          <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-[180px] h-[30px] bg-gray-900 rounded-b-[30px] shadow-inner"></div>
          
          {/* Screen Content */}
          <div 
            ref={ref}
            className="w-full h-full bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 rounded-[30px] p-6 flex flex-col justify-between overflow-hidden relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-white mb-2">💳 {t('wallet_title')}</div>
                <div className="text-green-100 text-sm">{t('secure_transaction')}</div>
              </div>

              {/* User Info */}
              <div className="space-y-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-green-100 text-sm font-medium">{t('name_label')}</div>
                  <div className="text-white text-lg font-semibold">{formData.name}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-green-100 text-sm font-medium">{t('balance_label')}</div>
                  <div className="text-white text-2xl font-bold">{formData.balance}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-green-100 text-xs font-medium">{t('bank_label')}</div>
                    <div className="text-white text-sm font-semibold">{formData.bank}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-green-100 text-xs font-medium">{t('pix_label')}</div>
                    <div className="text-white text-sm font-mono">{formData.pixKey}</div>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="text-center">
                <div className="text-green-100 text-sm font-medium mb-4">{t('loading_label')}</div>
                <CircularProgress percentage={formData.status} />
                <div className="mt-4 text-white font-semibold">
                  {t('transaction_label')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

WalletPreview.displayName = 'WalletPreview';
