import React from "react";

const Banner = () => {
  return (
    <section className=" py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left - Vertical Navigation (1/4 width on md and up) */}
        <aside className="md:col-span-1">
          {/* category nav/menu */}
          <p>Sidebar</p>
        </aside>

        {/* Right - Carousel (3/4 width on md and up) */}
        <div className="md:col-span-3 bg-amber-950">
          {/* carousel/slider */}
          <p>Carousel</p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
