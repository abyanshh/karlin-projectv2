'use client';
import Image from "next/image";
import { BreadcrumbDemo } from "../breadcrumb-project";
import { useSession } from "@/context/SessionContext";

const HeaderSection = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <header className="relative h-50 text-white overflow-hidden rounded-b-3xl">
      <div className="absolute inset-0 dark:hidden">
        <Image
          src="/bg-orange.png"
          alt="hero"
          fill
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="absolute inset-0 hidden dark:block">
        <Image
          src="/Bg-blue.png"
          alt="hero dark"
          fill
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative flex flex-col pt-5 px-6">
        <h1 className="text-3xl font-semibold leading-tight capitalize">
          {title}
        </h1>
        <p className="mb-2">{subtitle}</p>
        <BreadcrumbDemo />
      </div>
    </header>
  );
};

export default HeaderSection;
