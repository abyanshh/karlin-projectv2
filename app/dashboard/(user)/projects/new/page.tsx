"use client";

import { ArrowLeft, QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/project/ProjectForm";
import { QRScannerDialog } from "@/components/project/QRScannerDialog";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function Page() {
  const [templateData, setTemplateData] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasProcessedTemplateRef = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useUser();

  // Separate effect just for checking user auth
  useEffect(() => {
    // If user is still undefined (loading), keep checking
    if (user === undefined) {
      setIsCheckingAuth(true);
      return;
    }

    // User has loaded (either user object or null)
    setIsCheckingAuth(false);
  }, [user]);

  // Separate effect for processing template
  useEffect(() => {
    const templateParam = searchParams.get("template");

    // Don't process if:
    // - No template param
    // - Already processed
    // - Still checking auth
    if (!templateParam || hasProcessedTemplateRef.current || isCheckingAuth) {
      return;
    }

    // User data is loaded at this point (user !== undefined)
    console.log("Processing template with user:", user);

    // Check if user is logged in
    if (!user) {
      console.log("User not logged in, redirecting to login...");
      sessionStorage.setItem("pendingTemplate", templateParam);
      router.push("/login");
      return;
    }

    // Check role
    if (user.role !== "admin" && user.role !== "sales") {
      console.log("User doesn't have permission");
      alert("Anda tidak memiliki akses untuk membuat proyek");
      router.push("/dashboard");
      return;
    }

    // Mark as processed BEFORE decoding to prevent re-runs
    hasProcessedTemplateRef.current = true;

    // Decode and set template data
    try {
      const decoded = atob(templateParam);
      const data = JSON.parse(decoded);
      console.log("Successfully decoded template:", data);

      if (data.type === "project-template") {
        setTemplateData(data);
      } else {
        console.warn("Invalid template type:", data.type);
        alert("QR Code bukan template project yang valid");
      }
    } catch (error) {
      console.error("Failed to decode template:", error);
      alert("QR Code tidak valid");
    }
  }, [searchParams, user, router, isCheckingAuth]);

  const handleQRScan = (data: any) => {
    setTemplateData(data);
  };

  // Show loading while checking auth
  if (searchParams.get("template") && isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat template QR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Buat Proyek Baru</h1>
            <p className="text-muted-foreground">
              Isi data proyek untuk menambah proyek baru
            </p>
          </div>
        </div>

        {/* QR Scanner & Template Creator */}
        <div className="flex gap-2">
          <QRScannerDialog onScanSuccess={handleQRScan} />
          <Link href="/dashboard/projects/qr-template">
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              Buat QR Template
            </Button>
          </Link>
        </div>
      </div>

      {/* Show message if template was loaded from URL */}
      {templateData && searchParams.get("template") && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-900 dark:text-green-100">
            ✅ Template QR berhasil dimuat! Form sudah terisi otomatis.
          </p>
        </div>
      )}

      {/* Form */}
      <ProjectForm mode="create" templateData={templateData} />
    </div>
  );
}
