import {LineResponse} from "./LineResponse";

export interface LineSimpleResponse {
  lineId? : number,
  plant : string,
  productSection : string,
  segment : string,
  line : string
}
export const toLineResponse= (lsr:LineSimpleResponse,createdNow:boolean=false):LineResponse => {
  return {
    lineId:lsr.lineId,
    lineName:lsr.line,
    segmentName:lsr.segment,
    plant:lsr.plant,
    productSection:lsr.productSection,
    nbWorkers:0,
    createdNow:createdNow
  }
}
