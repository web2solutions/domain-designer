

export interface IDataEventCreateDTO {
    id?: string;
    entity: string;
    action: string;
    data_id: string;
    data: any;
    createdAt?: Date;
    updatedAt?: Date;
}