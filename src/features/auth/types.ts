export interface Area {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  scope: "GLOBAL" | "LOCAL";
}

export interface UserPayload {
  sub: string;
  email: string;
  imageUrl?: string;
  areas: Area[];
  roles: Role[];
  permissions: string[];
  fullName: string;
  position: string
}

export interface LoginDto {
    identifier: string;
    password: string;
}