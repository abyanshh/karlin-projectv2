import Image from "next/image";
import { BreadcrumbDemo } from "../breadcrumb-project";
import { usePathname } from "next/navigation";

const HeaderSection = () => {
  const pathname = usePathname();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const getHeaderContent = () => {
    if (pathname === "/dashboard") {
      return {
        title: `Halo, ${user?.user_nama}`,
        subtitle: "Selamat datang di Karlin Mastrindo Project Manager.",
      };
    } else if (pathname === "/dashboard/projects") {
      return {
        title: "Proyek Anda",
        subtitle: "Lihat semua projek yang Anda miliki.",
      };
    } else if (pathname.startsWith("/dashboard/team")) {
      return {
        title: "Tim Anda",
        subtitle: "Lihat anggota tim Anda.",
      };
    } else if (pathname.startsWith("/dashboard/projects/")) {
      return {
        title: "Detail Proyek",
        subtitle: "Lihat detail proyek Anda.",
      };
    } else {
      return { title: "", subtitle: "" };
    }
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <header className="relative h-50 text-white overflow-hidden rounded-b-3xl">
      <div className="absolute inset-0 dark:hidden">
        <Image src="/bg-orange.png" alt="hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="absolute inset-0 hidden dark:block">
        <Image src="/Bg-blue.png" alt="hero dark" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative flex flex-col pt-5 px-6">
        <h1 className="text-3xl font-semibold capitalize">{title}</h1>
        <p className="mb-2">{subtitle}</p>
        <BreadcrumbDemo />
      </div>
    </header>
  );
};

export default HeaderSection;