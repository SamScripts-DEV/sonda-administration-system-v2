export interface Permission {
    id: string;
    code: string;
    name: string ;
    module: string ;
    group: string ;
    description: string ;
    createdAt?: string;
    updatedAt?: string;
}