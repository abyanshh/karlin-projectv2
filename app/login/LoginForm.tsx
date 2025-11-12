"use client";

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

const LoginForm = () => {
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
      const { data } = await api.post("/auth/login", formData);
      sessionStorage.setItem("accessToken", data.accessToken);
      const user = await api.get("/profile/me");
      sessionStorage.setItem("user", JSON.stringify(user.data.profile));

      toast({
        title: "Login berhasil!",
        description: `Selamat datang! Mengarahkan ke dashboard...`,
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
      <div className="w-full max-w-md">
        <div className="py-2">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Landing Page
          </Link>
        </div>
        <Card className="shadow-card w-full rounded-xl">
          <CardHeader className="text-center space-y-4">
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
      </div>
    </div>
  );
};

export default LoginForm;
