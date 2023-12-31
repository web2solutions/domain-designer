
export class EntitySchema {
    id: string;
    domain_id?: string;
    name: string;
    description: string;
    isSchemaOnly: boolean; // schemaOnly entities are only Value Objects and does not represent a data entity
    version: number;
    createdAt: Date;
    updatedAt: Date;
}