'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, QrCode, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProjectTemplate {
  type: string;
  po: string;
  client: string;
  deadline: string;
  salesName: string;
  tasks: Array<{ nama: string; deskripsi: string }>;
  createdAt: string;
}

interface QRScannerDialogProps {
  onScanSuccess: (data: ProjectTemplate) => void;
}

export function QRScannerDialog({ onScanSuccess }: QRScannerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const isScanningRef = useRef(false); // Add ref to track scanning state
  const [scanStatus, setScanStatus] = useState('Initializing...');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const jsQRRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameCountRef = useRef(0);
  const lastScanTimeRef = useRef(0); // Track last scan time for throttling

  // Load jsQR library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.onload = () => {
      jsQRRef.current = (window as any).jsQR;
      console.log('jsQR library loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load jsQR library');
    };
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleUploadQR = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!jsQRRef.current) {
      alert('QR Scanner belum siap. Tunggu sebentar dan coba lagi.');
      return;
    }

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          context?.drawImage(img, 0, 0);

          const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
          
          if (jsQRRef.current && imageData) {
            const code = jsQRRef.current(imageData.data, imageData.width, imageData.height);
            
            console.log('Upload - QR scan result:', code);
            
            if (code && code.data) {
              console.log('Upload - QR data:', code.data);
              
              try {
                // Try to extract template from URL first
                let templateData;
                
                if (code.data.includes('/dashboard/projects/new?template=') || code.data.includes('template=')) {
                  console.log('Upload - Detected URL format');
                  // It's a URL - extract the template parameter
                  const url = new URL(code.data);
                  const encodedTemplate = url.searchParams.get('template');
                  
                  console.log('Upload - Encoded template:', encodedTemplate);
                  
                  if (encodedTemplate) {
                    const decoded = atob(encodedTemplate);
                    console.log('Upload - Decoded string:', decoded);
                    templateData = JSON.parse(decoded);
                    console.log('Upload - Parsed template:', templateData);
                  } else {
                    throw new Error('No template parameter in URL');
                  }
                } else {
                  console.log('Upload - Attempting direct JSON parse');
                  // Try parsing as direct JSON (backwards compatibility)
                  templateData = JSON.parse(code.data);
                  console.log('Upload - Parsed as JSON:', templateData);
                }
                
                if (templateData && templateData.type === 'project-template' && templateData.po) {
                  console.log('Upload - Valid template, calling onScanSuccess');
                  onScanSuccess(templateData);
                  setOpen(false);
                } else {
                  console.warn('Upload - Invalid template structure:', templateData);
                  alert('QR Code ini bukan template project yang valid');
                }
              } catch (err) {
                console.error('Upload - Parse error:', err);
                alert('Format QR Code tidak valid');
              }
            } else {
              console.log('Upload - No QR code detected in image');
              alert('Tidak dapat membaca QR Code dari gambar');
            }
          }
        };
        
        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload - Error reading QR from image:', error);
      alert('Gagal membaca QR Code dari gambar');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startScanner = async () => {
    if (!jsQRRef.current) {
      alert('QR Scanner belum siap. Tunggu sebentar dan coba lagi.');
      return;
    }

    console.log('Starting camera scanner...');
    setIsScanning(true);
    setScanStatus('Starting camera...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      console.log('Camera stream obtained');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play().then(() => {
            console.log('Video playing, starting scan loop');
            setScanStatus('Camera ready - Point at QR code');
            // Set scanning ref to true right before starting the loop
            isScanningRef.current = true;
            console.log('isScanningRef set to:', isScanningRef.current);
            requestAnimationFrame(scanFrame);
          }).catch(err => {
            console.error('Video play error:', err);
          });
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Tidak bisa mengakses kamera');
      setIsScanning(false);
      isScanningRef.current = false;
    }
  };

  const scanFrame = () => {
    // Use ref instead of state to avoid closure issues
    console.log('scanFrame called, isScanningRef.current:', isScanningRef.current);
    
    if (!isScanningRef.current || !videoRef.current || !canvasRef.current) {
      console.log('Scan frame check failed:', {
        isScanning: isScanningRef.current,
        hasVideo: !!videoRef.current,
        hasCanvas: !!canvasRef.current
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Throttle scanning to 150ms between attempts (gives camera time to focus)
      const now = Date.now();
      if (now - lastScanTimeRef.current < 150) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }
      lastScanTimeRef.current = now;

      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      
      if (!context) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Image preprocessing for better QR detection on low-quality cameras
      const data = imageData.data;
      const contrast = 1.5; // Increase contrast
      const brightness = 10; // Slight brightness boost
      
      for (let i = 0; i < data.length; i += 4) {
        // Apply contrast and brightness to RGB channels
        data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));
        data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness));
        data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness));
      }
      
      // Log every 60 frames
      frameCountRef.current++;
      if (frameCountRef.current % 60 === 0) {
        console.log('📹 Scanning frame', frameCountRef.current, 'Canvas:', canvas.width, 'x', canvas.height);
      }
      
      if (jsQRRef.current && imageData) {
        try {
          const code = jsQRRef.current(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          
          if (code) {
            console.log('🎯 Camera - QR Code detected!');
            console.log('Camera - Raw QR data:', code.data);
            setScanStatus('QR Code terdeteksi! Memproses...');
            
            try {
              // Try to extract template from URL first
              let templateData;
              
              if (code.data.includes('/dashboard/projects/new?template=') || code.data.includes('template=')) {
                console.log('Camera - Detected URL format');
                // It's a URL - extract the template parameter
                const url = new URL(code.data);
                const encodedTemplate = url.searchParams.get('template');
                
                console.log('Camera - Encoded template:', encodedTemplate);
                
                if (encodedTemplate) {
                  const decoded = atob(encodedTemplate);
                  console.log('Camera - Decoded string:', decoded);
                  templateData = JSON.parse(decoded);
                  console.log('Camera - Parsed template:', templateData);
                } else {
                  throw new Error('No template parameter in URL');
                }
              } else {
                console.log('Camera - Attempting direct JSON parse');
                // Try parsing as direct JSON (backwards compatibility)
                templateData = JSON.parse(code.data);
                console.log('Camera - Parsed as JSON:', templateData);
              }
              
              if (templateData && templateData.type === 'project-template' && templateData.po) {
                console.log('✅ Camera - Valid template found, stopping scanner');
                stopScanner();
                onScanSuccess(templateData);
                setOpen(false);
                return;
              } else {
                console.warn('⚠️ Camera - Invalid template structure:', templateData);
                setScanStatus('QR Code bukan template project');
                setTimeout(() => setScanStatus('Camera ready - Point at QR code'), 2000);
              }
            } catch (parseError) {
              console.error('❌ Camera - Parse error:', parseError);
              setScanStatus('Format QR tidak valid');
              setTimeout(() => setScanStatus('Camera ready - Point at QR code'), 2000);
            }
          }
        } catch (scanError) {
          console.error('Error during QR scan:', scanError);
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const stopScanner = () => {
    console.log('Stopping scanner...');
    setIsScanning(false);
    isScanningRef.current = false;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    frameCountRef.current = 0;
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      stopScanner();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          Scan QR Template
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {isScanning ? 'Scan QR Code' : 'Scan Project Template'}
          </DialogTitle>
          <DialogDescription>
            Scan QR template untuk auto-fill data project
          </DialogDescription>
        </DialogHeader>

        {!isScanning ? (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 Scan QR Code yang dibuat oleh Sales lain untuk auto-fill data project
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={startScanner} className="w-full h-24 flex-col gap-2">
                <Camera className="h-8 w-8" />
                <span>Scan dengan Kamera</span>
              </Button>
              <Button onClick={handleUploadQR} variant="outline" className="w-full h-24 flex-col gap-2">
                <Upload className="h-8 w-8" />
                <span>Upload Gambar QR</span>
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                className="w-full h-auto"
                style={{ maxHeight: '500px' }}
                playsInline
                muted
                autoPlay
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative" style={{ width: '280px', height: '280px' }}>
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="w-full h-1 bg-green-400 animate-scan"></div>
                  </div>
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                <div className="bg-gradient-to-r from-black/50 via-black/70 to-black/50 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
                  <p className="text-white text-sm font-medium">
                    {scanStatus === 'Starting camera...' && '📸 Membuka kamera...'}
                    {scanStatus === 'Camera ready - Point at QR code' && '✨ Arahkan ke QR Template'}
                    {scanStatus.includes('terdeteksi') && '✅ QR Code terdeteksi!'}
                    {scanStatus.includes('bukan') && '⚠️ QR Code bukan template'}
                    {scanStatus.includes('tidak valid') && '❌ Format tidak valid'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">💡 Tips:</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1.5">
                <li>• Pastikan QR code tercetak jelas</li>
                <li>• Posisikan dalam kotak hijau</li>
                <li>• Jaga jarak 15-30 cm</li>
                <li>• Periksa console (F12) untuk log detail</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => { 
                  stopScanner();
                }} 
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
              <Button 
                onClick={() => { 
                  stopScanner();
                  setTimeout(handleUploadQR, 100);
                }} 
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Gambar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}