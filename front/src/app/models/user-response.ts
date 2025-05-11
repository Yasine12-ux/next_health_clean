export interface UserResponse {
  id?:number,
  firstname?:string,
  lastname?:string,
  email?:string,
  phone?:string,
  password?:string,
  role?:string,
  isEnable?:boolean,
  isArchived?:boolean,
  createdNow?:boolean
}

export interface FullUserResponse {
  userInfo:UserResponse,
  plantsManagingIds?:number[],
  productSectionsManagingIds?:number[],
  segmentsManagingIds?:number[],
  resourceHumanSegmentsIds?:number[],
  plantDoctorId?:number,
  plantNurseId?:number,
  linesManagingIds?:number[],
  lineWorkingId?:number
}

export const copyUserResponse = (userResponse:UserResponse, createdNow:boolean=false):UserResponse => {
  return {
    id: userResponse.id,
    firstname: userResponse.firstname,
    lastname: userResponse.lastname,
    email: userResponse.email,
    phone: userResponse.phone,
    role: userResponse.role,
    isEnable: userResponse.isEnable,
    createdNow:createdNow
  }
}
