export interface UserRegisterInfo {
  firstname?:string,
  lastname?:string,
  email?:string,
  phone?:string,
  password?:string,
  role?:string,
}
export interface RegisterRequest{
  userInfo:UserRegisterInfo,
  plantsManagingIds?:number[],
  productSectionsManagingIds?:number[],
  segmentsManagingIds?:number[],
  resourceHumanSegmentsIds?:number[],
  plantDoctorId?:number,
  plantNurseId?:number,
  linesManagingIds?:number[],
  lineWorkingId?:number
}
