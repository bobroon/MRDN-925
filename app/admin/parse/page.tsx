"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, XCircle, Download, LinkIcon } from "lucide-react"
import { createUrlProductsMany } from "@/lib/actions/product.actions"

type Product = {
  id: string
  name: string
  images: string[]
  isAvailable: boolean
  quantity: number
  url: string
  priceToShow: number
  price: number
  category: string
  vendor: string
  description: string
  articleNumber: string
  params: { name: string; value: string }[]
}

type Status = "idle" | "loading" | "success" | "error"

export default function ProductScraper() {
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState<string[]>([])
  const [products, setProducts] = useState<(Product | null)[]>([])
  const [linkStatus, setLinkStatus] = useState<Status>("idle")
  const [productStatus, setProductStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  const fetchLinks = async () => {
    if (!url) return setError("Please enter a URL")

    setLinkStatus("loading")
    setLinks([])
    setError("")

    try {
      const response = await fetch("/api/parseRzCatalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Failed to fetch links")

      const data = await response.json()
      setLinks(data.links.slice(0, 50))
      setLinkStatus("success")
    } catch (error) {
      console.error("Error fetching links:", error)
      setError("Failed to fetch links")
      setLinkStatus("error")
    }
  }

  const fetchProducts = async () => {
    if (links.length === 0) return setError("No links to parse")

    setProductStatus("loading")
    setProducts([])
    setError("")

    try {
      const productResponses = await Promise.all(
        links.map((url) => fetch(`/api/parseRzProduct?url=${encodeURIComponent(url)}`).then((res) => res.json())),
      )

      const fetchedProducts = productResponses.flat()

      // Call createUrlProductsMany with the fetched data
      await createUrlProductsMany(fetchedProducts)

      console.log(fetchedProducts)
      setProducts(fetchedProducts)
      setProductStatus("success")
    } catch (err) {
      setError("Failed to fetch product data")
      setProductStatus("error")
    }
  }

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2))
    const anchor = document.createElement("a")
    anchor.href = dataStr
    anchor.download = "products.json"
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Product Data Scraper</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={fetchLinks} disabled={linkStatus === "loading"}>
              {linkStatus === "loading" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
              )}
              Scrape URLs
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {linkStatus === "success" && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Scraped Links ({links.length})</h3>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:underline text-sm mb-1"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <Button onClick={fetchProducts} disabled={productStatus === "loading"} className="w-1/2">
                {productStatus === "loading" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {productStatus === "loading" ? "Parsing..." : "Parse Products"}
              </Button>
              {products.length > 0 && (
                <Button onClick={downloadJSON} variant="outline" className="w-1/2 ml-2">
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
              )}
            </div>
          )}

          {productStatus === "loading" && (
            <div className="mt-4">
              <Progress value={33} className="w-full" />
              <p className="text-center mt-2">Parsing products...</p>
            </div>
          )}

          {productStatus === "success" && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Successfully parsed {products.length} products.</AlertDescription>
            </Alert>
          )}

          {productStatus === "error" && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to parse products. Please try again.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

