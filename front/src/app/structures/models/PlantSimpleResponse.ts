import {ProductSectionResponse} from "./ProductSectionResponse";
import {ProductSectionSimpleResponse} from "./ProductSectionSimpleResponse";
import {PlantResponse} from "./PlantResponse";

export interface PlantSimpleResponse {
  id? : number,
  name?:string
}
export const toPlantResponse = (plant:PlantSimpleResponse,createdNow:boolean=false):PlantResponse => {
  return {

    id: plant.id,
    name: plant.name,
    productSectionsCount : 0,
    segmentsCount : 0,
    linesCount: 0,
    createdNow:createdNow
  }
}
