
import { OpenAPIV3 } from "openapi-types";

// OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject
export class PropertySchema {
    id: string;
    domain_id: string;
    entity_id: string;
    
    name: string;
    spec: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject | null;
    
    description: string;
    createdAt: Date;
    updatedAt: Date;
}