import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 py-6">
      <div className="container mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Image
                  src="/karlin-logo.png"
                  alt="Karlin Mastrindo Logo"
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Karlin Mastrindo
                </span>
                <p className="text-sm text-gray-200">Project Management</p>
              </div>
            </div>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/login">
                <LogIn className="" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
