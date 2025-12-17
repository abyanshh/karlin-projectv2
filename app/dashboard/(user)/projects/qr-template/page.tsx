'use client'

import { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, Download, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axios';

interface Task {
  nama: string;
  deskripsi: string;
}

interface SalesUser {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
}

export default function QRTemplatePage() {
  const [formData, setFormData] = useState({
    po: '',
    client: '',
    deadline: '',
    salesName: '',
  });
  
  const [tasks, setTasks] = useState<Task[]>([
    { nama: '', deskripsi: '' }
  ]);

  const [salesList, setSalesList] = useState<SalesUser[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Fetch sales list
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await api.get('/project/sales-list', { withCredentials: true });
        setSalesList(data.sales || []);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoadingSales(false);
      }
    };
    fetchSales();
  }, []);

  const handleAddTask = () => {
    setTasks([...tasks, { nama: '', deskripsi: '' }]);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, field: 'nama' | 'deskripsi', value: string) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const generateQR = () => {
    // Validate required fields
    if (!formData.po || !formData.client || !formData.deadline || !formData.salesName) {
      alert('Mohon isi semua field yang wajib (PO, Client, Deadline, Sales)');
      return;
    }

    const validTasks = tasks.filter(t => t.nama.trim() !== '');
    if (validTasks.length === 0) {
      alert('Mohon tambahkan minimal 1 task');
      return;
    }

    const templateData = {
      type: 'project-template',
      ...formData,
      tasks: validTasks,
      createdAt: new Date().toISOString(),
    };

    // Encode data as base64 URL parameter
    const encodedData = btoa(JSON.stringify(templateData));
    
    // Create URL that redirects to your app
    const redirectUrl = `${window.location.origin}/dashboard/projects/new?template=${encodedData}`;
    
    // Generate QR with the URL instead of raw JSON
    // Larger size (800x800) and high error correction (ecc=H) for better detection on low-quality cameras
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&ecc=H&data=${encodeURIComponent(redirectUrl)}`;
    
    setQrDataUrl(qrApiUrl);
    setShowQR(true);
  };

  const downloadQR = async () => {
    if (!qrDataUrl) return;
    
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QR-Template-${formData.po.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading QR:', error);
      alert('Gagal mendownload QR Code');
    }
  };

  const resetForm = () => {
    setFormData({ po: '', client: '', deadline: '', salesName: '' });
    setTasks([{ nama: '', deskripsi: '' }]);
    setQrDataUrl('');
    setShowQR(false);
  };

  if (showQR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6" />
                QR Code Template Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <img src={qrDataUrl} alt="QR Code" className="w-96 h-96 shadow-2xl rounded" />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  {formData.po}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Client: {formData.client}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Sales: {formData.salesName}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Deadline: {new Date(formData.deadline).toLocaleDateString('id-ID')}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Tasks: {tasks.filter(t => t.nama.trim()).length}
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={downloadQR} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Download QR Code
                </Button>
                <Button variant="outline" onClick={resetForm} className="w-full">
                  Buat Template Baru
                </Button>
                <Link href="/dashboard/projects" className="block">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6" />
                Buat QR Template Project
              </CardTitle>
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 <strong>Fitur QR Template:</strong> Buat QR code berisi data project yang bisa di-scan oleh Sales/Admin lain untuk membuat project baru dengan data yang sudah terisi otomatis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="po">Nomor PO <span className="text-red-500">*</span></Label>
                <Input
                  id="po"
                  value={formData.po}
                  onChange={(e) => setFormData({ ...formData, po: e.target.value })}
                  placeholder="PO-XXX-2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Nama Client <span className="text-red-500">*</span></Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="PT. Example Indonesia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline <span className="text-red-500">*</span></Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesName">Nama Sales <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.salesName}
                  onValueChange={(value) => setFormData({ ...formData, salesName: value })}
                  disabled={loadingSales}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingSales ? "Loading..." : "Pilih Sales"} />
                  </SelectTrigger>
                  <SelectContent>
                    {salesList.map((sales) => (
                      <SelectItem key={sales.id} value={sales.name}>
                        {sales.name} - {sales.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tasks <span className="text-red-500">*</span></Label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddTask}>
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Task
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.map((task, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Task {index + 1}</Label>
                        {tasks.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTask(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="Nama Task (required)"
                          value={task.nama}
                          onChange={(e) => handleTaskChange(index, 'nama', e.target.value)}
                        />
                        <Textarea
                          placeholder="Deskripsi Task (optional)"
                          value={task.deskripsi}
                          onChange={(e) => handleTaskChange(index, 'deskripsi', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button onClick={generateQR} className="w-full" size="lg">
              <QrCode className="mr-2 h-5 w-5" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}