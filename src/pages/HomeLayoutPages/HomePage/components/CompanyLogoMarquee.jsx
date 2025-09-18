import React from "react";
import Marquee from "react-fast-marquee";

const companyLogos = [
  // Electronics & Gadget Brands
  { id: 1, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { id: 2, name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { id: 3, name: "Sony", logo: "https://i.ibb.co.com/sv5sZ5Fv/sony-5969151.png" },
  { id: 4, name: "Intel", logo: "https://i.ibb.co.com/mVz86qM5/intel-888863.png" },
  { id: 5, name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
  { id: 6, name: "HP", logo: "https://i.ibb.co.com/zCXjnt1/hp-882851.png" },
  { id: 7, name: "Asus", logo: "https://i.ibb.co.com/DHn15Vbb/asus-5969050.png" },
  { id: 8, name: "Acer", logo: "https://i.ibb.co.com/BXLg0qJ/acer-882748.png" },
  { id: 9, name: "Lenovo", logo: "https://i.ibb.co.com/cS95Vq9j/lenovo-882717.png" },
  { id: 10, name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg" },
  { id: 11, name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
  { id: 12, name: "OnePlus", logo: "https://i.ibb.co.com/k22N7h89/one-plus-882743.png" },
  { id: 13, name: "Oppo", logo: "https://i.ibb.co.com/fzDzH39n/oppo-882745.png" },
  { id: 14, name: "Vivo", logo: "https://i.ibb.co.com/N6p78Qgh/vivo-882711.png" },
  { id: 15, name: "Huawei", logo: "https://i.ibb.co.com/My6mZKN6/huawei-882738.png" },
  { id: 16, name: "Realme", logo: "https://i.ibb.co.com/WWWv9ydM/realme-logo-png-seeklogo-349344.png" },
  { id: 17, name: "Nokia", logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg" },
  { id: 18, name: "Motorola", logo: "https://i.ibb.co.com/PsXj21XS/motorola-882707.png" },
  { id: 19, name: "Philips", logo: "https://i.ibb.co.com/7J8q91R2/Phillips-2008-2-300x169.png" },
];

const CompanyLogoMarquee = () => {
  return (
    <section className="pb-10 pt-4 mt-15 shadow-sm rounded-lg">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold pb-4 text-center mb-8">Trusted by Top Companies</h2>
        <Marquee speed={60} gradient={false} pauseOnHover={true}>
          {companyLogos.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-center mx-10"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-12 object-contain grayscale hover:cursor-pointer hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default CompanyLogoMarquee;
