export enum ObjectAccessGroupType {}

export interface ObjectAccessGroup {
  type: ObjectAccessGroupType;
  id: string;
}

export enum ObjectPermission {
  READ = "read",
  WRITE = "write",
}

export interface ObjectAclRule {
  group: ObjectAccessGroup;
  permission: ObjectPermission;
}

export interface ObjectAclPolicy {
  owner: string;
  visibility: "public" | "private";
  aclRules?: Array<ObjectAclRule>;
}

export async function setObjectAclPolicy(_file: any, _aclPolicy: ObjectAclPolicy): Promise<void> {}
export async function getObjectAclPolicy(_file: any): Promise<ObjectAclPolicy | null> { return null; }
export async function canAccessObject(_opts: any): Promise<boolean> { return true; }
