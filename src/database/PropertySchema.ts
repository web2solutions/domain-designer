
import { OpenAPIV3 } from "openapi-types";

export class PropertySchema {
    id: string;
    domain_id: string;
    entity_id: string;
    name: string;
    spec: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject;
    description: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}