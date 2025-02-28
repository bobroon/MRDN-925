"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon, ChevronRight } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Rectangle, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { findTopSellingProduct } from "@/lib/actions/order.actions"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const chartConfig = {
  desktop: {
    label: "Added to cart",
    color: "#2563eb",
  },
} satisfies ChartConfig

interface Data {
  dateName: string
  value: {
    product: TopProduct
    amount: number
  }
}

interface TopProduct {
  name: string
  image: string
  searchParam: string | null
  amount: number
}

export function TopSellingProduct() {
  const [data, setData] = React.useState<Data[]>()
  const [topProduct, setTopProduct] = React.useState<TopProduct>()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  })
  const [chartType, setChartType] = React.useState("BarChart")
  const [currentPayload, setCurrentPayload] = React.useState<Data>()
  const [screenWidth, setScreenWidth] = React.useState(0)

  React.useEffect(() => {
    const fetchTopSellingProduct = async () => {
      const { data, topProduct } = await findTopSellingProduct(date?.from, date?.to)

      setData(data)
      setTopProduct(topProduct)

      //console.log(topProduct.image);
    }

    fetchTopSellingProduct()
  }, [date])

  React.useEffect(() => {
    const screenWidth = window.screen.width

    setScreenWidth(screenWidth)
  }, [screenWidth])

  return (
    <section className="w-full mt-10">
      <div className="w-full h-full">
        <div className="w-full h-fit flex gap-2 justify-end max-[1300px]:flex-col">
          <div className="w-full h-full">
            <h3 className="text-heading3-bold font-semibold">Найпопулярніший продукт</h3>
          </div>
          <div className="flex gap-1 max-[1300px]:mt-2 max-[460px]:flex-col">
            <div className={cn("grid gap-2 justify-items-end max-[460px]:justify-items-start")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal max-[460px]:w-full",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg" align={screenWidth <= 1300 ? "start" : "center"}>
                  <Calendar
                    className="bg-white shadow-lg rounded-lg"
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Select defaultValue={"BarChart"} onValueChange={(value) => setChartType(value)}>
              <SelectTrigger className="w-72 border-0 border-b border-black appearance-none rounded-none mb-1 max-[460px]:w-full">
                <SelectValue className="cursor-poiner flex gap-2" />
              </SelectTrigger>
              <SelectContent className="cursor-poiner">
                <SelectItem value="BarChart" className="w-full cursor-poiner">
                  Стовбці
                </SelectItem>
                <SelectItem value="LineChart" className="cursor-poiner">
                  Графік
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full h-[70%] overflow-visible mt-3">
          <ChartContainer config={chartConfig} className="w-full h-full text-subtle-medium overflow-visible pt-1">
            {chartType === "BarChart" ? (
              <BarChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 5,
                  right: 5,
                }}
                onMouseMove={(state) => {
                  if (state.isTooltipActive && state.activePayload && state.activePayload.length) {
                    setCurrentPayload(state.activePayload[0].payload)
                  }
                }}
              >
                <CartesianGrid vertical={true} horizontal={true} syncWithTicks strokeDasharray="4 4 4 4" />
                <XAxis dataKey="dateName" tickLine={true} axisLine={true} tickMargin={6} minTickGap={0} />
                <ChartTooltip content={<CustomTooltip timePeriod={data} />} />
                <Bar dataKey="value.amount" fill="#2563eb" radius={[36, 36, 0, 0]} minPointSize={2}></Bar>
              </BarChart>
            ) : (
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                onMouseMove={(state) => {
                  if (state.isTooltipActive && state.activePayload && state.activePayload.length) {
                    setCurrentPayload(state.activePayload[0].payload)
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateName" tickLine={true} axisLine={true} tickMargin={6} minTickGap={0} />
                <ChartTooltip content={<CustomTooltip timePeriod={data} />} />
                <Line type="monotone" dataKey="value.amount" stroke="#2563eb" activeDot={{ r: 4 }} />
              </LineChart>
            )}
          </ChartContainer>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {topProduct && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Найпопулярніший продукт</CardTitle>
                <CardDescription>За весь обраний період</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                {topProduct.image !== "" && (
                  <Image
                    src={topProduct.image || "/placeholder.svg"}
                    width={96}
                    height={96}
                    alt="Product image"
                    className="rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="text-base-semibold mb-1">{topProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">Продано: {topProduct.amount}</p>
                </div>
              </CardContent>
              {topProduct.searchParam && (
                <CardFooter>
                  <Link href={`/catalog/${topProduct.searchParam}`} target="_blank" passHref>
                    <Button variant="outline" className="w-full">
                      Переглянути продукт
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          )}
          {currentPayload && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Вибраний продукт</CardTitle>
                <CardDescription>За {currentPayload.dateName}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                {currentPayload.value.product.image !== "" && (
                  <Image
                    src={currentPayload.value.product.image || "/placeholder.svg"}
                    width={96}
                    height={96}
                    alt="Product image"
                    className="rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="text-base-semibold mb-1">{currentPayload.value.product.name}</h4>
                  <p className="text-sm text-muted-foreground">Продано: {currentPayload.value.amount}</p>
                </div>
              </CardContent>
              {currentPayload.value.product.searchParam && (
                <CardFooter>
                  <Link href={`/catalog/${currentPayload.value.product.searchParam}`} target="_blank" passHref>
                    <Button variant="outline" className="w-full">
                      Переглянути продукт
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`bg-white/70 rounded-xl shadow-lg p-3`}>
        <p className="text-small-semibold">{label}</p>
        <p className="text-subtle-medium mt-1">
          Всього продано: <span className={`${payload[0].value > 0 && "text-green-500"}`}>{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

