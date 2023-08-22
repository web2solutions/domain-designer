import { OpenAPIV3 } from "openapi-types";
export interface IPropertyCreateDTO {
    id?: string;
    name: string;
    domain_id: string;
    entity_id: string;
    description?: string;
    spec: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject,
}