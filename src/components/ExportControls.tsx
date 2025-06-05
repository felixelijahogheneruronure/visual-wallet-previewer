
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
        repeat: 0, // Loop forever
      });

      // Get the current user input percentage
      const currentPercentageElement = previewRef.current.querySelector('#percent-text') as HTMLElement;
      const targetPercentage = parseInt(currentPercentageElement?.textContent?.replace('%', '') || '100');

      // Create 5 second animation with 50 frames (10 FPS)
      const frames = 50;
      
      for (let i = 0; i <= frames; i++) {
        // Progress from 0 to target percentage over 5 seconds
        const progress = Math.round((i / frames) * targetPercentage);
        
        // Update the progress display
        const progressText = previewRef.current.querySelector('#percent-text') as HTMLElement;
        const progressCircle = previewRef.current.querySelector('#progress-circle') as SVGCircleElement;
        
        if (progressText) progressText.textContent = `${progress}%`;
        if (progressCircle) {
          const circumference = 2 * Math.PI * 50;
          const offset = circumference - (progress / 100) * circumference;
          progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
          progressCircle.style.strokeDashoffset = `${offset}`;
        }

        // Wait a bit for the change to render
        await new Promise(resolve => setTimeout(resolve, 30));

        const canvas = await html2canvas(previewRef.current, {
          backgroundColor: null,
          scale: 1,
          useCORS: true,
        });

        gif.addFrame(canvas, { delay: 100 }); // 100ms = 10 FPS
        
        // Update progress for user feedback
        const exportProgress = Math.round((i / frames) * 100);
        if (i % 10 === 0) { // Update every second
          toast.info(`Capturing frames... ${exportProgress}%`);
        }
      }

      // Restore original status
      const progressText = previewRef.current.querySelector('#percent-text') as HTMLElement;
      if (progressText) progressText.textContent = `${targetPercentage}%`;

      toast.info('Rendering GIF...');
      
      gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'wallet-preview-5s.gif';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('GIF exported successfully!');
        setIsExporting(false);
      });

      gif.on('progress', (progress) => {
        const percent = Math.round(progress * 100);
        toast.info(`Rendering GIF... ${percent}%`);
      });

      gif.render();
    } catch (error) {
      toast.error('GIF export failed');
      console.error('GIF export failed:', error);
      setIsExporting(false);
    }
  };

  const exportAsWebM = async () => {
    if (!previewRef.current || isExporting) return;

    setIsExporting(true);
    toast.info('Starting WebM video export...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      
      // Create a canvas to record from
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = previewRef.current.offsetWidth;
      canvas.height = previewRef.current.offsetHeight;

      // Create MediaRecorder for WebM
      const stream = canvas.captureStream(10); // 10 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'wallet-preview-5s.webm';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('WebM video exported successfully!');
        setIsExporting(false);
      };

      mediaRecorder.start();

      // Get the current user input percentage
      const currentPercentageElement = previewRef.current.querySelector('#percent-text') as HTMLElement;
      const targetPercentage = parseInt(currentPercentageElement?.textContent?.replace('%', '') || '100');

      // Record for 5 seconds
      const frames = 50; // 5 seconds at 10 FPS
      
      for (let i = 0; i <= frames; i++) {
        // Progress from 0 to target percentage over 5 seconds
        const progress = Math.round((i / frames) * targetPercentage);
        
        // Update the progress display
        const progressText = previewRef.current.querySelector('#percent-text') as HTMLElement;
        const progressCircle = previewRef.current.querySelector('#progress-circle') as SVGCircleElement;
        
        if (progressText) progressText.textContent = `${progress}%`;
        if (progressCircle) {
          const circumference = 2 * Math.PI * 50;
          const offset = circumference - (progress / 100) * circumference;
          progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
          progressCircle.style.strokeDashoffset = `${offset}`;
        }

        // Capture and draw to canvas
        const htmlCanvas = await html2canvas(previewRef.current, {
          backgroundColor: null,
          scale: 1,
          useCORS: true,
        });

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(htmlCanvas, 0, 0, canvas.width, canvas.height);
        }

        await new Promise(resolve => setTimeout(resolve, 100)); // 10 FPS
        
        const exportProgress = Math.round((i / frames) * 100);
        if (i % 10 === 0) { // Update every second
          toast.info(`Recording... ${exportProgress}%`);
        }
      }

      // Restore original status
      const progressText = previewRef.current.querySelector('#percent-text') as HTMLElement;
      if (progressText) progressText.textContent = `${targetPercentage}%`;

      mediaRecorder.stop();
    } catch (error) {
      toast.error('WebM export failed');
      console.error('WebM export failed:', error);
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
        🎬 {isExporting ? 'Exporting GIF...' : 'Export 5s GIF'}
      </Button>
      
      <Button
        onClick={exportAsWebM}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        disabled={isExporting}
      >
        🎥 {isExporting ? 'Exporting Video...' : 'Export 5s WebM'}
      </Button>
    </div>
  );
};
