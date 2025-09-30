import React from "react";
import TopProducts from "./components/Top Products/TopProducts";
import FeaturedSection from "./components/FeaturedSection";
import CompanyLogoMarquee from "./components/CompanyLogoMarquee";
import Reviews from "./components/Reviews/Reviews";
import Tracking from "./components/Tracking";
import ContactUs from "./components/ContactUs";
import Banner from "./components/Banner/Banner";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopProducts></TopProducts>
      <FeaturedSection></FeaturedSection>
      <Tracking></Tracking>
      <ContactUs></ContactUs>
      <Reviews></Reviews>
      <CompanyLogoMarquee></CompanyLogoMarquee>
    </div>
  );
};

export default Home;
