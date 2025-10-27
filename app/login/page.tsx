"use client";

import { useSession } from "@/context/SessionContext";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import api from "@/lib/axios";

const LoginPage = () => {
  const { login } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await api.post("/login", formData);
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    login({ user, accessToken });

    toast({
      title: "Login berhasil!",
      description: `Selamat datang ${user.name}`,
    });

    router.push("/dashboard");
  } catch (err: any) {
    toast({
      title: "Login gagal",
      description: err.response?.data?.message || "Email atau password salah",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full md:max-w-4xl max-w-md ">
        {/* Back to home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="flex">
          <Card className="shadow-card w-full md:w-2/5 md:rounded-none md:rounded-l-xl">
            <CardHeader className="text-center space-y-4">
              {/* Logo */}
              <div className="flex justify-center">
                <Image
                  src="/karlin-logo.png"
                  alt="Karlin Mastrindo Logo"
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              </div>
              <CardTitle className="text-2xl font-bold">
                Masuk ke Akun Anda
              </CardTitle>
              <p className="text-muted-foreground">
                Karlin Mastrindo Project Management
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="w-full md:w-3/5 relative rounded-r-xl overflow-hidden shadow-lg md:block hidden">
            <Image
              src="/hero-image.jpg"
              width={600}
              height={600}
              alt="Hero Image"
              className="w-full h-full object-cover"
              priority={true}
            />
            {/* Overlay gelap */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
