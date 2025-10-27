import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Target, Award, LogIn } from "lucide-react";
import Link from "next/link";
import heroImage from "../public/hero-image.jpg";
import Image from "next/image";
import Navbar from "@/layout/navbar";
import MarqueeLogo from "@/components/LandingPage/marqueelogo";
import Marquee from "react-fast-marquee";

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Tim Berpengalaman",
      description:
        "Tim profesional dengan pengalaman puluhan tahun dalam manajemen proyek",
    },
    {
      icon: Target,
      title: "Fokus Hasil",
      description:
        "Komitmen penuh untuk menyelesaikan setiap proyek tepat waktu dan sesuai target",
    },
    {
      icon: Award,
      title: "Kualitas Terjamin",
      description:
        "Standar kualitas tinggi dalam setiap aspek pelaksanaan proyek",
    },
  ];

  const testimonials = [
    {
      company: "PT Teknologi Maju",
      text: "Karlin Mastrindo berhasil menyelesaikan proyek kami tepat waktu dengan kualitas luar biasa.",
    },
    {
      company: "CV Digital Inovasi",
      text: "Manajemen proyek yang profesional dan komunikasi yang sangat baik sepanjang project.",
    },
    {
      company: "PT Infrastruktur Nusa",
      text: "Tim yang sangat berpengalaman dan selalu memberikan solusi terbaik untuk setiap tantangan.",
    },
    {
      company: "PT Manufaktur Indo",
      text: "Implementasi ERP berjalan lancar berkat expertise tim Karlin Mastrindo.",
    },
    {
      company: "Bank Central Asia",
      text: "Partner terpercaya untuk transformasi digital perusahaan kami.",
    },
    {
      company: "Telkom Indonesia",
      text: "Kualitas layanan dan komitmen yang tinggi dalam setiap project.",
    },
  ];

  const trustedVendors = [
    "Microsoft",
    "Oracle",
    "SAP",
    "IBM",
    "Salesforce",
    "AWS",
    "Google Cloud",
    "Adobe",
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="min-h-screen relative py-32 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Karlin Mastrindo Project Management"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Navbar inside Hero */}
        <Navbar />
        <div className="container mx-auto relative z-10 pt-10 mt-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
              <span className="text-primary">Karlin</span> Manager Project
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              Karlin Mastrindo hadir sebagai partner terpercaya untuk mengelola
              proyek Anda dengan profesionalisme tinggi dan hasil yang
              memuaskan.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              
            </div>

          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">
                    K
                  </span>
                </div>
                <span className="text-xl font-bold">Karlin Mastrindo</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Solusi terdepan dalam manajemen proyek untuk berbagai industri
                dengan standar kualitas internasional.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: info@karlinmastrindo.com</p>
                <p>Telepon: +62 21 1234 5678</p>
                <p>Alamat: Jakarta, Indonesia</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Layanan</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Project Management</p>
                <p>Konsultasi Strategis</p>
                <p>Implementation Support</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2025 Karlin Mastrindo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
