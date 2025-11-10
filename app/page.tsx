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
          <div className="absolute inset-0 bg-black/90"></div>
        </div>

        {/* Navbar inside Hero */}
        <Navbar />
        <div className="container mx-auto relative z-10 pt-10 mt-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
              <span className="text-primary">Karlin Mastrindo</span><br/>Manager Project
            </h1>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
