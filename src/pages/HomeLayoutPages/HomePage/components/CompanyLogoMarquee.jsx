import React from "react";
import Marquee from "react-fast-marquee";

const CompanyLogoMarquee = () => {
  const companyLogos = [
    // Electronics & Gadget Brands
    {
      id: 1,
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      id: 2,
      name: "Samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    },
    {
      id: 3,
      name: "Sony",
      logo: "https://i.ibb.co.com/sv5sZ5Fv/sony-5969151.png",
    },
    {
      id: 4,
      name: "Intel",
      logo: "https://i.ibb.co.com/mVz86qM5/intel-888863.png",
    },
    {
      id: 5,
      name: "Dell",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
    },
    { id: 6, name: "HP", logo: "https://i.ibb.co.com/zCXjnt1/hp-882851.png" },
    {
      id: 7,
      name: "Asus",
      logo: "https://i.ibb.co.com/DHn15Vbb/asus-5969050.png",
    },
    {
      id: 8,
      name: "Acer",
      logo: "https://i.ibb.co.com/BXLg0qJ/acer-882748.png",
    },
    {
      id: 9,
      name: "Lenovo",
      logo: "https://i.ibb.co.com/cS95Vq9j/lenovo-882717.png",
    },
    {
      id: 10,
      name: "LG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg",
    },
    {
      id: 11,
      name: "Xiaomi",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
    },
    {
      id: 12,
      name: "OnePlus",
      logo: "https://i.ibb.co.com/k22N7h89/one-plus-882743.png",
    },
    {
      id: 13,
      name: "Oppo",
      logo: "https://i.ibb.co.com/fzDzH39n/oppo-882745.png",
    },
    {
      id: 14,
      name: "Vivo",
      logo: "https://i.ibb.co.com/N6p78Qgh/vivo-882711.png",
    },
    {
      id: 15,
      name: "Huawei",
      logo: "https://i.ibb.co.com/My6mZKN6/huawei-882738.png",
    },
    {
      id: 16,
      name: "Realme",
      logo: "https://i.ibb.co.com/WWWv9ydM/realme-logo-png-seeklogo-349344.png",
    },
    {
      id: 17,
      name: "Nokia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg",
    },
    {
      id: 18,
      name: "Motorola",
      logo: "https://i.ibb.co.com/PsXj21XS/motorola-882707.png",
    },
    {
      id: 19,
      name: "Philips",
      logo: "https://i.ibb.co.com/7J8q91R2/Phillips-2008-2-300x169.png",
    },
  ];

  // Function to handle logo click - opens company website
  const handleLogoClick = (companyName) => {
    const websites = {
      Apple: "https://www.apple.com",
      Samsung: "https://www.samsung.com",
      Sony: "https://www.sony.com",
      Intel: "https://www.intel.com",
      Dell: "https://www.dell.com",
      HP: "https://www.hp.com",
      Asus: "https://www.asus.com",
      Acer: "https://www.acer.com",
      Lenovo: "https://www.lenovo.com",
      LG: "https://www.lg.com",
      Xiaomi: "https://www.mi.com",
      OnePlus: "https://www.oneplus.com",
      Oppo: "https://www.oppo.com",
      Vivo: "https://www.vivo.com",
      Huawei: "https://www.huawei.com",
      Realme: "https://www.realme.com",
      Nokia: "https://www.nokia.com",
      Motorola: "https://www.motorola.com",
      Philips: "https://www.philips.com",
    };

    const url =
      websites[companyName] || `https://www.${companyName.toLowerCase()}.com`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="py-16 bg-background overflow-hidden section">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-dark mb-4">Our Trusted Partners</h2>
            <p className="text-subtext max-w-2xl mx-auto">
              Trusted by leading companies worldwide. We collaborate with
              industry giants to deliver exceptional solutions.
            </p>
          </div>

          {/* Logo Marquee Container */}
          <div className="relative">
            {/* Gradient overlays for smooth edge effect */}
            <div
              className="absolute left-0 top-0 w-20 h-full z-10"
              style={{
                background:
                  "linear-gradient(to right, var(--color-background), transparent)",
              }}
            ></div>
            <div
              className="absolute right-0 top-0 w-20 h-full z-10"
              style={{
                background:
                  "linear-gradient(to left, var(--color-background), transparent)",
              }}
            ></div>

            {/* React Fast Marquee */}
            <Marquee
              pauseOnHover={true}
              speed={50}
              gradient={false}
              className="py-4"
            >
              {companyLogos.map((company) => (
                <div
                  key={company.id}
                  className="mx-8 w-32 h-20 bg-primary rounded-lg shadow-md hover:shadow-lg
                           transition-all duration-300 cursor-pointer transform hover:scale-105
                           flex items-center justify-center p-4 group border border-gray-200 dark:border-gray-700"
                  onClick={() => handleLogoClick(company.name)}
                  title={`Visit ${company.name} website`}
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'><rect width='100' height='40' fill='var(--color-primary)'/><text x='50' y='20' font-family='Inter, Arial' font-size='12' text-anchor='middle' dy='0.3em' fill='var(--color-text)'>${company.name}</text></svg>`;
                    }}
                  />
                </div>
              ))}
            </Marquee>
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-12">
            <small className="text-subtext">
              Click on any logo to visit their official website
            </small>
          </div>
        </div>
      </section>
    </>
  );
};

export default CompanyLogoMarquee;
