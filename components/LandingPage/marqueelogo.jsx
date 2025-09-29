import LogoLoop from "@/components/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
import Marquee from "react-fast-marquee";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

// Alternative with image sources
const imageLogos = [
  {
    src: "/logos/company1.png",
    alt: "Company 1",
    href: "https://company1.com",
  },
  {
    src: "/logos/company2.png",
    alt: "Company 2",
    href: "https://company2.com",
  },
  {
    src: "/logos/company3.png",
    alt: "Company 3",
    href: "https://company3.com",
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

const cardTesti = testimonials.map((t) => ({
  node: (
    <div className="flex items-center justify-center">
    <div className="flex flex-col bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-700 italic h-1/2">"{t.text}"</p>
      <p className="text-xs text-gray-500 font-semibold mt-2">— {t.company}</p>
    </div>
  </div>
  ),
  title: t.company,
  href: "#",
}))

export default function MarqueeLogo() {
  return (
    <div className="mb-5">
      <LogoLoop
        logos={techLogos}
        speed={60}
        direction="right"
        logoHeight={48}
        gap={40}
        scaleOnHover
        pauseOnHover={false}
        ariaLabel="Technology partners"
      />
    </div>
  );
}
