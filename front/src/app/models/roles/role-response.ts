
export interface RoleResponse{
  id?:number,
    name?:string,
    description?:string,
    nbUsers?:number,
    rolePermissionsIds?:number[],
    createdNow?:boolean
  requiredStructures?:RelationStructure[]
}

export interface RelationStructure {
  name:string,
  permissions:string[]
}
