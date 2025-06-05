import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { WalletPreview } from '@/components/WalletPreview';
import { ExportControls } from '@/components/ExportControls';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';

type Language = 'en' | 'pt' | 'es';

const Index = () => {
  const [formData, setFormData] = useState({
    name: 'Valtenisson dos Santos',
    balance: 'R$ 17,743.43',
    bank: 'Nubank',
    pixKey: '048.448.575.09',
    status: 98
  });
  const [language, setLanguage] = useState<Language>('en');
  const [isShaking, setIsShaking] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations(language);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language);
  };

  const handleUpdate = () => {
    setIsShaking(true);
    toast.success(t('update_success'));
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            📄 {t('app_title')}
          </h1>
          <p className="text-gray-300 text-lg">{t('app_subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Controls Panel */}
          <Card className="p-6 bg-black/20 backdrop-blur-lg border-gray-700">
            <div className="space-y-6">
              {/* Language Selector */}
              <LanguageSelector language={language} onLanguageChange={handleLanguageChange} />

              {/* Form Inputs */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">{t('form_title')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('name_label')}
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('name_placeholder')}
                    className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('balance_label')}
                  </label>
                  <Input
                    type="text"
                    value={formData.balance}
                    onChange={(e) => handleInputChange('balance', e.target.value)}
                    placeholder={t('balance_placeholder')}
                    className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('bank_label')}
                  </label>
                  <Input
                    type="text"
                    value={formData.bank}
                    onChange={(e) => handleInputChange('bank', e.target.value)}
                    placeholder={t('bank_placeholder')}
                    className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('pix_label')}
                  </label>
                  <Input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => handleInputChange('pixKey', e.target.value)}
                    placeholder={t('pix_placeholder')}
                    className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('status_label')} ({formData.status}%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', parseInt(e.target.value) || 0)}
                    className="bg-black/30 border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleUpdate}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3"
                >
                  {t('update_btn')}
                </Button>
                
                <ExportControls previewRef={previewRef} translations={t} />
              </div>
            </div>
          </Card>

          {/* iPhone Preview */}
          <div className="flex justify-center">
            <WalletPreview
              ref={previewRef}
              formData={formData}
              isShaking={isShaking}
              translations={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
