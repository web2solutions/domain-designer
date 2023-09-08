
import { OpenAPIV3 } from "openapi-types";

export class SchemaSchema {
    id: string;
    name: string;
    spec: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}