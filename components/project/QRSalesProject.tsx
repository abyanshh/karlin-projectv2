'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Plus, User, FileText, Check, Download, Camera, X } from 'lucide-react';
import api from '../../lib/axios';

interface Sale {
  id: string;
  name: string;
  phone: string;
  company: string;
  email: string;
}

interface ProjectData {
  customerId: string;
  customerName: string;
  phone: string;
  company: string;
  email: string;
  projectName: string;
  description: string;
  budget: string;
  po?: string;
  deadline?: string;
}

const QRSalesProject = () => {
  const [view, setView] = useState<'sales' | 'project'>('sales');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState('Initializing...');
  const [salesList, setSalesList] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [projectData, setProjectData] = useState<ProjectData>({
    customerId: '',
    customerName: '',
    phone: '',
    company: '',
    email: '',
    projectName: '',
    description: '',
    budget: '',
    po: '',
    deadline: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const jsQRRef = useRef<any>(null);
  const router = useRouter();

  // Auth check + Fetch sales (only for sales role)
  useEffect(() => {
    const init = async () => {
      try {
        // check current user (update endpoint if your API uses a different path)
        const { data: me } = await api.get('/auth/me', { withCredentials: true });
        // support various response shapes: { user: { role } } or { role }
        const role = me?.role || me?.user?.role || me?.data?.role;
        if (role === 'sales' || (Array.isArray(me?.roles) && me.roles.includes('sales'))) {
          setAllowed(true);
          try {
            const { data } = await api.get('/project/sales-list', { withCredentials: true });
            setSalesList(data.sales || []);
          } catch (fetchErr) {
            console.error('Error fetching sales:', fetchErr);
            alert('Gagal memuat data sales');
          }
        } else {
          setAllowed(false);
          alert('Akses ditolak: hanya sales yang dapat mengakses halaman ini.');
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // not authenticated -> go to login
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  // Load jsQR library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.onload = () => {
      jsQRRef.current = (window as any).jsQR;
      console.log('jsQR loaded successfully');
    };
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const generateQR = async (sale: Sale) => {
    const data = JSON.stringify({
      customerId: sale.id,
      customerName: sale.name,
      phone: sale.phone,
      company: sale.company,
      email: sale.email
    });
    
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    
    setQrDataUrl(qrApiUrl);
    setSelectedSale(sale);
  };

  const startScanner = async () => {
    if (!jsQRRef.current) {
      alert('QR Scanner belum siap. Tunggu sebentar dan coba lagi.');
      return;
    }

    setShowScanner(true);
    setScanStatus('Starting camera...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        
        setScanStatus('Ready! Point camera at QR code');
        requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Tidak bisa mengakses kamera. Pastikan:\n1. Izin kamera sudah diberikan\n2. Menggunakan HTTPS atau localhost\n3. Kamera tidak digunakan aplikasi lain');
      setShowScanner(false);
    }
  };

  const scanFrame = () => {
    if (!showScanner || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      
      if (jsQRRef.current && imageData) {
        const code = jsQRRef.current(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code && code.data) {
          setScanStatus('QR Code detected!');
          
          try {
            const data = JSON.parse(code.data);
            
            if (data.customerName) {
              setProjectData({
                customerId: data.customerId || '',
                customerName: data.customerName || '',
                phone: data.phone || '',
                company: data.company || '',
                email: data.email || '',
                projectName: '',
                description: '',
                budget: '',
                po: '',
                deadline: ''
              });
              
              stopScanner();
              setView('project');
              setTimeout(() => {
                alert('✅ QR Code berhasil di-scan! Data customer sudah terisi.');
              }, 100);
              return;
            }
          } catch (e) {
            console.log('Invalid QR data format');
          }
        } else {
          setScanStatus('Scanning... Point at QR code');
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const stopScanner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setShowScanner(false);
    setScanStatus('Initializing...');
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-${selectedSale?.name.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitProject = async () => {
    if (!projectData.projectName || !projectData.description || !projectData.budget) {
      alert('Mohon lengkapi semua field!');
      return;
    }
    
    try {
      const { data } = await api.post('/project/create-from-qr', {
        customerId: projectData.customerId,
        customerName: projectData.customerName,
        phone: projectData.phone,
        company: projectData.company,
        email: projectData.email,
        projectName: projectData.projectName,
        description: projectData.description,
        budget: projectData.budget,
        po: projectData.po || `QR-${Date.now()}`,
        deadline: projectData.deadline || null
      });
      
      console.log('Project created:', data);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setView('sales');
        setProjectData({
          customerId: '',
          customerName: '',
          phone: '',
          company: '',
          email: '',
          projectName: '',
          description: '',
          budget: '',
          po: '',
          deadline: ''
        });
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.error || 'Gagal membuat project');
    }
  };

  const testScanQR = (sale: Sale) => {
    setProjectData({
      customerId: sale.id,
      customerName: sale.name,
      phone: sale.phone,
      company: sale.company,
      email: sale.email,
      projectName: '',
      description: '',
      budget: '',
      po: '',
      deadline: ''
    });
    setView('project');
  };

  // ========================================
  // SALES VIEW - Shows list of sales people
  // ========================================
  if (view === 'sales') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 md:p-6 text-gray-800 dark:text-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <User className="text-blue-500 dark:text-blue-300" />
                <span>Sales / Customer List</span>
              </h1>
              <button
                onClick={startScanner}
                className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 flex items-center gap-2 w-full md:w-auto justify-center shadow-lg transform hover:scale-105 transition"
              >
                <Camera size={20} />
                Scan QR Code
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-300 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading sales data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {salesList.map(sale => (
                  <div key={sale.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition bg-white dark:bg-gray-800">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">{sale.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{sale.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{sale.phone}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{sale.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateQR(sale)}
                          className="flex-1 md:flex-none bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <QrCode size={20} />
                          Generate QR
                        </button>
                        <button
                          onClick={() => testScanQR(sale)}
                          className="flex-1 md:flex-none bg-purple-500 dark:bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 flex items-center justify-center gap-2"
                        >
                          <Plus size={20} />
                          Test
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {qrDataUrl && selectedSale && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto text-gray-800 dark:text-gray-100">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">QR Code - {selectedSale.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm md:text-base">
                    Print QR code ini lalu scan dengan tombol <strong>&quot;Scan QR Code&quot;</strong> untuk auto-fill data!
                  </p>
                  
                  <div className="flex justify-center mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                    <img 
                      src={qrDataUrl} 
                      alt="QR Code" 
                      className="w-64 h-64"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={downloadQR}
                      className="w-full bg-green-500 dark:bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Download QR Code
                    </button>
                    
                    <button
                      onClick={() => {
                        setQrDataUrl('');
                        setSelectedSale(null);
                      }}
                      className="w-full bg-gray-500 dark:bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showScanner && (
              <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <div className="w-full h-full max-w-4xl flex flex-col">
                  <div className="bg-gray-900 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Camera className="text-green-400" size={24} />
                      <div>
                        <h2 className="text-xl font-bold text-white">QR Code Scanner</h2>
                        <p className="text-sm text-gray-400">{scanStatus}</p>
                      </div>
                    </div>
                    <button
                      onClick={stopScanner}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <X size={20} />
                      Close
                    </button>
                  </div>
                  
                  <div className="flex-1 relative bg-black">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative">
                        <div className="w-64 h-64 border-4 border-green-500 rounded-2xl shadow-2xl"></div>
                        <div className="absolute -top-2 -left-2 w-12 h-12 border-t-8 border-l-8 border-white rounded-tl-2xl"></div>
                        <div className="absolute -top-2 -right-2 w-12 h-12 border-t-8 border-r-8 border-white rounded-tr-2xl"></div>
                        <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-8 border-l-8 border-white rounded-bl-2xl"></div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-8 border-r-8 border-white rounded-br-2xl"></div>
                      </div>
                    </div>
                    
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  
                  <div className="bg-gray-900 p-4 text-center">
                    <p className="text-white text-lg">
                      📱 Arahkan kamera ke QR Code
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Pastikan QR code berada dalam kotak hijau
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // PROJECT FORM VIEW - Add new project
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 md:p-6 text-gray-800 dark:text-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-green-500 dark:text-green-400" />
            Tambah Project Baru
          </h1>

          {showSuccess && (
            <div className="mb-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded flex items-center gap-2">
              <Check size={20} />
              Project berhasil ditambahkan!
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <User size={20} />
                Data Customer (dari QR Code)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Nama Customer</label>
                  <input
                    type="text"
                    value={projectData.customerName}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={projectData.phone}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Perusahaan</label>
                  <input
                    type="text"
                    value={projectData.company}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={projectData.email}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText size={20} />
                Detail Project
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project *</label>
                  <input
                    type="text"
                    value={projectData.projectName}
                    onChange={(e) => setProjectData({...projectData, projectName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Contoh: Website Company Profile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Project *</label>
                  <textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Jelaskan detail project..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (Rp) *</label>
                  <input
                    type="number"
                    value={projectData.budget}
                    onChange={(e) => setProjectData({...projectData, budget: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="5000000"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={() => setView('sales')}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-semibold"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmitProject}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Tambah Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRSalesProject;