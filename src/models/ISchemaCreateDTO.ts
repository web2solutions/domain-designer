import { OpenAPIV3 } from "openapi-types";
export interface ISchemaCreateDTO {
    id?: string;
    name: string;
    spec: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
    createdAt?: Date;
    updatedAt?: Date;
}