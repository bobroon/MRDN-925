import { AddedToCart } from "@/components/admin-components/statistics/AddedToCart";
import { AverageOrderValue } from "@/components/admin-components/statistics/AverageOrderValue";
import { CanceledOrders } from "@/components/admin-components/statistics/CanceledOrders";
import { DeclinedOrders } from "@/components/admin-components/statistics/DeclinedOrders";
import { FulfilledOrders } from "@/components/admin-components/statistics/FulfilledOrders";
import { LeastSellingProduct } from "@/components/admin-components/statistics/LeastSellingProduct";
import { MostPopularRegion } from "@/components/admin-components/statistics/MostPopuarRegion";
import { NewCustomers } from "@/components/admin-components/statistics/NewCustomers";
import { SalesByCategory } from "@/components/admin-components/statistics/SalesByCategory";
import { SuccessfulOrders } from "@/components/admin-components/statistics/SuccessfulOrders";
import { TopSellingProduct } from "@/components/admin-components/statistics/TopSellingProduct";
import { TotalOrders } from "@/components/admin-components/statistics/TotalOrders";
import { TotalRevenue } from "@/components/admin-components/statistics/TotalRevenue";

const Page = async () => {

  return (
    <section className="px-10 py-10 pb-20 w-full max-[360px]:px-4"> 
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Statistics</h1>
          <TotalRevenue/>
          <TotalOrders/>
          <AverageOrderValue/>
          <AddedToCart/>
          <NewCustomers/>
          <FulfilledOrders/>
          <CanceledOrders/>
          <SuccessfulOrders/>
          <DeclinedOrders/>
          <MostPopularRegion/>
          <SalesByCategory/>
          <TopSellingProduct/>
          {/* <LeastSellingProduct/> */}
          <div className="w-full h-1"></div>
    </section>
  )
}

export default Page;