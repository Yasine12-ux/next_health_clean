import {SegmentResponse} from "./SegmentResponse";

export interface SegmentSimpleResponse {
  segmentId : number,
  segmentName:string,
  plant:string,
  productSection : string
}

export const toSegmentResponse = (segmentSimpleResponse:SegmentSimpleResponse,createdNow:boolean=false):SegmentResponse => {
  return {
    segmentId : segmentSimpleResponse.segmentId,
    segmentName:segmentSimpleResponse.segmentName,
    productSection : segmentSimpleResponse.productSection,
    plant:segmentSimpleResponse.plant,
    lineCount: 0,
    createdNow:createdNow
  }
}
