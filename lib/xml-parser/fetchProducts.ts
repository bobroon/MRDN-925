import { DOMParser } from "xmldom";
import { generateUniqueId, getElementData, replaceDescription } from "../utils";
import getTagsMap from "./getTagsMap";
import { Config, ProductType } from "../types/types";

interface CreateUrlParams {
    _id?: string,
    id: string | null,
    name: string | null,
    isAvailable: boolean,
    quantity: number,
    url: string | null,
    priceToShow: number,
    price: number,
    images: (string | null)[],
    vendor: string | null,
    description: string | null,
    params: {
        name: string | null,
        value: string | null
    }[],
    category:string,
    isFetched: boolean,
}

export default function getProductsData(xmlString: string, config: Config) {
  if (!xmlString) {
    console.log("No XML data found");
    return null;
  }

  const xmlDocument = new DOMParser().parseFromString(xmlString, "text/xml");

  const categories = [] as { name: string, id: string, ref: string}[];
  const categoriesElements = getElementData({...config.paths.Start.categories, parent: xmlDocument.documentElement, many: true}) as Element[];

  for (let i = 0; i < categoriesElements.length; i++) {
    const categoryElement = categoriesElements[i];

    const name = getElementData({...config.paths.Categories.name, parent: categoryElement}) as string;
    const id = getElementData({...config.paths.Categories.category_id, parent: categoryElement}) as string;
    const ref = getElementData({...config.paths.Categories.reference_by, parent: categoryElement}) as string;
    categories.push({ name, id, ref })
  }

  const products = getElementData({...config.paths.Start.products, parent: xmlDocument.documentElement, many: true}) as Element[];

  if (!products) {
     console.log("No product data found in the XML");
     return null;
  }

  const result: CreateUrlParams[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    // // Extract attributes and elements
    const articleNumber = getElementData({...config.paths.Products.article_number, parent: product }) as string;
    const isAvailableValue = getElementData({...config.paths.Products.available, parent: product }) as string;
    const quantityElement = getElementData({...config.paths.Products.quantity, parent: product }) as Element;
    const urlElement = getElementData({...config.paths.Products.url, parent: product }) as Element;
    const priceToShowElement = getElementData({...config.paths.Products.discount_price, parent: product }) as Element;
    const priceElement = getElementData({...config.paths.Products.price, parent: product }) as Element;
    const imagesElements = getElementData({...config.paths.Products.images, parent: product, many: true }) as Element[];
    const vendorElement = getElementData({...config.paths.Products.vendor, parent: product }) as Element;
    const nameElement = getElementData({...config.paths.Products.name, parent: product }) as Element;
    const descriptionElement = getElementData({...config.paths.Products.description, parent: product }) as Element;
    const paramsElements = getElementData({...config.paths.Products.params, parent: product, many: true }) as Element[];
    const categoryIdElement = getElementData({...config.paths.Products.category, parent: product }) as Element;
    const images: string[] = [];
    const params: { name: string; value: string}[] = [];
  
    const isAvailable = isAvailableValue === "true";
    const quantity = quantityElement ? parseFloat(quantityElement.textContent || "0") : 0;
    const url = urlElement ? urlElement.textContent : "" as string;
    const priceToShow = priceToShowElement ? parseFloat(priceToShowElement.textContent || "0") : 0;
    let price = priceElement ? parseFloat(priceElement.textContent || "0") : 0;
    if (price === 0 || price === null) {
      price = priceToShow;
    }
    const categoryId = categoryIdElement ? categoryIdElement.textContent : "";
    const vendor = vendorElement ? vendorElement.textContent : "" as string;
    const name = nameElement ? nameElement.textContent : "" as string;
    const description = descriptionElement ? replaceDescription(descriptionElement.textContent || "") : "" as string;
  
    let category = "";
    if (categoryId) {
      category = categories.filter(category => category.ref === categoryId)[0]?.name;
    }
  
    for (let i = 0; i < imagesElements.length; i++) {
       const image = imagesElements[i].textContent;
       if (image) {
        images.push(image.replace(/\s+/g, ""));
      }
    }
  
    for (let i = 0; i < paramsElements.length; i++) {
      const paramElement = paramsElements[i];
  
      const name = getElementData({...config.paths.Params.name, parent: paramElement}) as string;
      const value = getElementData({...config.paths.Params.value, parent: paramElement}) as string;
  
      if(name) {
          params.push({ name, value: value ? value : "Не вказано"})
      }
    }
    
    const id = generateUniqueId();

    const sampleProduct = {
      id,
      articleNumber,
      name: name as string,
      isAvailable,
      quantity,
      url: url as string,
      priceToShow,
      price,
      images,
      vendor: vendor as string,
      description,
      params,
      category,
      isFetched: true,
    };

    result.push(sampleProduct)
  }

  result.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return 0;
  });

  return result;
}
