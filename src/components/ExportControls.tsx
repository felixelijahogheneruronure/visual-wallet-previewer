
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ExportControlsProps {
  previewRef: React.RefObject<HTMLDivElement>;
  translations: (key: string) => string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ previewRef, translations: t }) => {
  const [isExporting, setIsExporting] = useState(false);

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
    if (!previewRef.current || isExporting) return;

    setIsExporting(true);
    toast.info('Starting GIF export...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const GIF = (await import('gif.js')).default;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
      });

      // Capture multiple frames with different progress values
      const frames = 30;
      const originalStatus = previewRef.current.querySelector('#percent-text')?.textContent;
      
      for (let i = 0; i <= frames; i++) {
        const progress = Math.round((i / frames) * 100);
        
        // Update the progress display
        const progressText = previewRef.current.querySelector('#percent-text');
        const progressCircle = previewRef.current.querySelector('.progress-ring__circle');
        
        if (progressText) progressText.textContent = `${progress}%`;
        if (progressCircle) {
          const circumference = 2 * Math.PI * 50;
          const offset = circumference - (progress / 100) * circumference;
          progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
          progressCircle.style.strokeDashoffset = `${offset}`;
        }

        // Wait a bit for the change to render
        await new Promise(resolve => setTimeout(resolve, 50));

        const canvas = await html2canvas(previewRef.current, {
          backgroundColor: null,
          scale: 1,
          useCORS: true,
        });

        gif.addFrame(canvas, { delay: 100 });
      }

      // Restore original status
      const progressText = previewRef.current.querySelector('#percent-text');
      if (progressText && originalStatus) progressText.textContent = originalStatus;

      gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'wallet-preview.gif';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('GIF exported successfully!');
        setIsExporting(false);
      });

      gif.render();
    } catch (error) {
      toast.error('GIF export failed');
      console.error('GIF export failed:', error);
      setIsExporting(false);
    }
  };

  const exportAsMP4 = async () => {
    if (!previewRef.current || isExporting) return;

    setIsExporting(true);
    toast.info('Starting MP4 export...');

    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
      const html2canvas = (await import('html2canvas')).default;

      const ffmpeg = new FFmpeg();
      
      // Load FFmpeg
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      // Capture frames
      const frames = 30;
      const originalStatus = previewRef.current.querySelector('#percent-text')?.textContent;
      
      for (let i = 0; i <= frames; i++) {
        const progress = Math.round((i / frames) * 100);
        
        // Update the progress display
        const progressText = previewRef.current.querySelector('#percent-text');
        const progressCircle = previewRef.current.querySelector('.progress-ring__circle');
        
        if (progressText) progressText.textContent = `${progress}%`;
        if (progressCircle) {
          const circumference = 2 * Math.PI * 50;
          const offset = circumference - (progress / 100) * circumference;
          progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
          progressCircle.style.strokeDashoffset = `${offset}`;
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        const canvas = await html2canvas(previewRef.current, {
          backgroundColor: null,
          scale: 1,
          useCORS: true,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            await ffmpeg.writeFile(`frame${i.toString().padStart(3, '0')}.png`, await fetchFile(blob));
          }
        }, 'image/png');
      }

      // Restore original status
      const progressText = previewRef.current.querySelector('#percent-text');
      if (progressText && originalStatus) progressText.textContent = originalStatus;

      // Convert frames to MP4
      await ffmpeg.exec([
        '-framerate', '10',
        '-i', 'frame%03d.png',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-t', '3',
        'output.mp4'
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = 'wallet-preview.mp4';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('MP4 exported successfully!');
      setIsExporting(false);
    } catch (error) {
      toast.error('MP4 export failed');
      console.error('MP4 export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={exportAsPNG}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        disabled={isExporting}
      >
        📸 {t('download_png')}
      </Button>
      
      <Button
        onClick={exportAsGIF}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        disabled={isExporting}
      >
        🎬 {isExporting ? 'Exporting...' : t('download_gif')}
      </Button>
      
      <Button
        onClick={exportAsMP4}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        disabled={isExporting}
      >
        🎥 {isExporting ? 'Exporting...' : t('download_mp4')}
      </Button>
    </div>
  );
};
