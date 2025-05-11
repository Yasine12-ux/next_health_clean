import {ProductSectionResponse} from "./ProductSectionResponse";

export interface ProductSectionSimpleResponse {
  productSectionId:number ,
  plant: string,
  productSection:string,
}

export const toProductSectionResponse = (psSRes:ProductSectionSimpleResponse,createdNow:boolean=false):ProductSectionResponse => {
  return {
      productSectionId: psSRes.productSectionId,
      plantName: psSRes.plant,
      name: psSRes.productSection,
      SegmentCount: 0,
    createdNow:createdNow
    }
}
