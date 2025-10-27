import React from "react";
import TopProducts from "./components/Top Products/TopProducts";
import FeaturedSection from "./components/FeaturedSection";
import CompanyLogoMarquee from "./components/CompanyLogoMarquee";
import Reviews from "./components/Reviews/Reviews";
import Tracking from "./components/Tracking";
import ContactUs from "./components/ContactUs";
import Banner from "./components/Banner/Banner";
import Advertisement from "./components/Advertizement/Advertisement";


const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopProducts></TopProducts>
      <FeaturedSection></FeaturedSection>
      <Advertisement/>
      <CompanyLogoMarquee></CompanyLogoMarquee>
      {/* <Tracking></Tracking> */}
      <ContactUs></ContactUs>
      <Reviews></Reviews>

    </div>
  );
};

export default Home;
