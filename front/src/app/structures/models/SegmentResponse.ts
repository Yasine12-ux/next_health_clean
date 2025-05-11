export interface SegmentResponse {
  segmentId? : number,
  segmentName:string,
  productSection : string,
  lineCount?: number,
  manager?:string,
  rh?:string,
  plant:string,
  createdNow?:boolean
}
