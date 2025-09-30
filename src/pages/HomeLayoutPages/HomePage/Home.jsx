import React from "react";
import Banner from "./components/Banner";
import TopProducts from "./components/Top Products/TopProducts";
import FeaturedSection from "./components/FeaturedSection";
import CompanyLogoMarquee from "./components/CompanyLogoMarquee";
import Reviews from "./components/Reviews";
import Tracking from "./components/Tracking";
import ContactUs from "./components/ContactUs";


const Home = () => {
  return (
    <div className="w-11/12 mx-auto">
      <Banner></Banner>
      <TopProducts></TopProducts>
      <FeaturedSection></FeaturedSection>
      <Tracking></Tracking>
      <ContactUs></ContactUs>
      <CompanyLogoMarquee></CompanyLogoMarquee>
      <Reviews></Reviews>
    </div>
  );
};

export default Home;
