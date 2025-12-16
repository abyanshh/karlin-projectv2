'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, QrCode, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const [scanStatus, setScanStatus] = useState('Initializing...');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const jsQRRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load jsQR library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.onload = () => {
      jsQRRef.current = (window as any).jsQR;
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
            
            if (code && code.data) {
              try {
                const data = JSON.parse(code.data);
                if (data.type === 'project-template' && data.po) {
                  onScanSuccess(data);
                  setOpen(false);
                } else {
                  alert('QR Code ini bukan template project yang valid');
                }
              } catch (err) {
                alert('Format QR Code tidak valid');
              }
            } else {
              alert('Tidak dapat membaca QR Code dari gambar');
            }
          }
        };
        
        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading QR from image:', error);
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
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setScanStatus('Camera ready - Point at QR code');
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
    }
  };

  const scanFrame = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      
      if (!context) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      if (jsQRRef.current && imageData) {
        try {
          const code = jsQRRef.current(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          
          if (code) {
            setScanStatus('QR Code terdeteksi! Memproses...');
            
            try {
              const data = JSON.parse(code.data);
              
              if (data.type === 'project-template' && data.po) {
                stopScanner();
                onScanSuccess(data);
                setOpen(false);
                return;
              } else {
                setScanStatus('QR Code bukan template project');
                setTimeout(() => setScanStatus('Camera ready - Point at QR code'), 2000);
              }
            } catch (parseError) {
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
    setIsScanning(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
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