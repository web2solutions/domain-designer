
import type { IVersionBranches } from "@/components/OAS";

export class APISchema {
    id: string;
    name: string;
    description: string;
    versions: IVersionBranches;    
    createdAt: Date;
    updatedAt: Date;
}