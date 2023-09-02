import type { IVersionBranches } from "@/components/OAS";

export interface IAPICreateDTO {
    id?: string;
    name: string;
    description?: string;
    versions: IVersionBranches;
    createdAt?: Date;
    updatedAt?: Date;
}