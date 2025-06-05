
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ExportControlsProps {
  previewRef: React.RefObject<HTMLDivElement>;
  translations: (key: string) => string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ previewRef, translations: t }) => {
  const exportAsPNG = async () => {
    if (!previewRef.current) return;

    try {
      // Dynamic import for client-side only
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = 'wallet-preview.png';
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success(t('export_success'));
    } catch (error) {
      toast.error(t('export_error'));
      console.error('PNG export failed:', error);
    }
  };

  const exportAsGIF = async () => {
    toast.info(t('gif_export_info'));
    // Placeholder for GIF export functionality
    // This would require additional libraries like gif.js
  };

  const exportAsMP4 = async () => {
    toast.info(t('mp4_export_info'));
    // Placeholder for MP4 export functionality
    // This would require additional libraries like ffmpeg.wasm
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={exportAsPNG}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        📸 {t('download_png')}
      </Button>
      
      <Button
        onClick={exportAsGIF}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        🎬 {t('download_gif')}
      </Button>
      
      <Button
        onClick={exportAsMP4}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        🎥 {t('download_mp4')}
      </Button>
    </div>
  );
};
