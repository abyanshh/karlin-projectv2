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
      <section className="relative py-32 px-4 overflow-hidden">
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
        <div className="container mx-auto relative z-10 pt-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
              Solusi Manajemen Proyek
              <span className="text-primary block mt-2">Terdepan</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              Karlin Mastrindo hadir sebagai partner terpercaya untuk mengelola
              proyek Anda dengan profesionalisme tinggi dan hasil yang
              memuaskan.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant text-xl px-10 py-8"
                asChild
              >
                <Link href="/login">Mulai Sekarang</Link>
              </Button>
            </div>

            {/* Achievement Badge */}
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-12">
              <CheckCircle className="h-10 w-10 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-white">100+ Proyek</p>
                <p className="text-gray-200">Berhasil Diselesaikan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Profile Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
              Tentang Karlin Mastrindo
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Karlin Mastrindo adalah perusahaan konsultan manajemen proyek yang
              telah dipercaya oleh berbagai klien untuk mengelola proyek-proyek
              strategis dengan tingkat kompleksitas tinggi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  15+
                </h3>
                <p className="text-muted-foreground">Tahun Pengalaman</p>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  100+
                </h3>
                <p className="text-muted-foreground">Proyek Selesai</p>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  50+
                </h3>
                <p className="text-muted-foreground">Klien Puas</p>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  98%
                </h3>
                <p className="text-muted-foreground">Tingkat Kepuasan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-20 bg-muted/30 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Dipercaya Oleh
          </h2>
          <p className="text-muted-foreground">
            Berbagai perusahaan terkemuka telah mempercayai layanan kami
          </p>
        </div>

        {/* Trusted Vendors Marquee */}
        <MarqueeLogo />

        {/* Testimonials Marquee */}

        <div className="flex flex-col gap-2">
          <Marquee direction="left">
            <div className="flex p-2">
              {[...testimonials, ...testimonials].map((card, index) => (
                <div key={index} className="flex-shrink-0 max-w-sm bg-white p-6 rounded-lg shadow-sm mx-2">
                  <p className="text-muted-foreground mb-4 italic h-2/3">
                    "{card.text}"
                  </p>
                  <p className="font-semibold text-secondary h-1/3">
                    — {card.company}
                  </p>
                </div>
              ))}
            </div>
          </Marquee>
          <Marquee direction="right">
            <div className="flex p-2">
              {[...testimonials, ...testimonials].map((card, index) => (
                <div key={index} className="flex-shrink-0 max-w-sm bg-white p-6 rounded-lg shadow-sm mx-2">
                  <p className="text-muted-foreground mb-4 italic h-2/3">
                    "{card.text}"
                  </p>
                  <p className="font-semibold text-secondary h-1/3">
                    — {card.company}
                  </p>
                </div>
              ))}
            </div>
          </Marquee>
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
              <p className="text-gray-300 leading-relaxed">
                Solusi terdepan dalam manajemen proyek untuk berbagai industri
                dengan standar kualitas internasional.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <div className="space-y-2 text-gray-300">
                <p>Email: info@karlinmastrindo.com</p>
                <p>Telepon: +62 21 1234 5678</p>
                <p>Alamat: Jakarta, Indonesia</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Layanan</h3>
              <div className="space-y-2 text-gray-300">
                <p>Project Management</p>
                <p>Konsultasi Strategis</p>
                <p>Implementation Support</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Karlin Mastrindo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
