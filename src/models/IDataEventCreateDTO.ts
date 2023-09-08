

export interface IDataEventCreateDTO {
    id?: string;
    collection: string;
    action: string;
    data_id: string;
    data: any;
    createdAt?: Date;
    updatedAt?: Date;
}