"use server"

import Map from "@/components/shared/Map";
import Divider from "@/components/shared/Divider";
import AboutUs from "@/components/landing/AboutUs";
import BannerHero from "@/components/banner/BannerHero";
import { sleep } from "@/lib/utils";
import Categories from "@/components/landing/Categories";
import History from "@/components/landing/History";
import Brand from "@/components/landing/Brand";
import InfiniteLogoScroll from "@/components/landing/InfiniteLogoScroll";
import NewsLetterSignUp from "@/components/landing/NewsLetterSignUp";

export default async function Home() {
  
  return (
    <>
      <BannerHero/>
      {/* <div className="mt-32">
        <Divider iconUrl="/assets/arrow-down.svg" width={64} height={64} mt={32} mb={12} type="icon-only" />  
      </div> */}
      <Categories/>
      {/* <Divider iconUrl="" width={0} height={0} mt={0} mb={0} type="default"/> */}
      <AboutUs/>
      {/* <Map/>   */}
      <InfiniteLogoScroll/>
      {/* <EleganceShowcase/> */}
      <NewsLetterSignUp />
    </>
  );
}
