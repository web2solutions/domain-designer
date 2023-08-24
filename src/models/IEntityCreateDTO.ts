export interface IEntityCreateDTO {
    id?: string;
    name: string;
    domain_id?: string;
    isSchemaOnly?: boolean;
    description?: string;
}