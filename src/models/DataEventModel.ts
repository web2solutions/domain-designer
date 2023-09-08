
import { BaseModel } from "@/models/BaseModel";
import type { IQueryRequest } from "@/stores/IQueryRequest";
import type { IPagingResponse } from "@/stores/IPagingResponse";
import type { IDataEventCreateDTO } from "@/models/IDataEventCreateDTO";
import { idx, DomainDesignerDB } from '@/database/IDX'
import { DataEventSchema } from "@/database/DataEventSchema";

export class DataEventModel extends BaseModel implements DataEventSchema {
    private db: DomainDesignerDB;
    public collection: string;
    public action: string;
    public data_id: string;
    public data: any;

    constructor(record: IDataEventCreateDTO){
        super();
        if(record.id) {
            this.id = record.id;
        }
        this.collection = record.collection;
        this.action = record.action || '';
        this.data = record.data;
        this.data_id = record.data_id;
        this.db = idx.db;
    }

    async save() {
        const rawDoc = this.toJSON()
        const id = await this.db.dataevents.add(rawDoc)
        return { ...rawDoc, id };
    }

    async count () {
        try {
            return await idx.db.dataevents.toCollection().count();
        } catch (error) {
            console.log(error);
            return 0
        }
    }

    toJSON(): DataEventSchema {
        const { collection, action, data, data_id } = this;
        const json = {
            id: this.id,
            collection,
            action,
            data_id,
            data,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json
    }

    static async getAll(query: IQueryRequest): Promise<IPagingResponse<DataEventSchema>> {
        const page = query.page || 1;
        const size = query.size || 30;
        const total = await idx.db.dataevents.toCollection().count();
        const offset = (page * size) - size;
        const result = await idx.db.dataevents
            .orderBy('collection')
            //.reverse()
            .offset(offset)
            .limit(size)
            .toArray();
            
            
        const response = {
            page,
            size,
            total,
            result,
        };
        // console.log(response)
        return response;
    }

    static async getEntireCollection(): Promise<DataEventSchema[]> {
        const result = await idx.db.dataevents
            .orderBy('collection')
            .toArray();
        return result;
    }

    static async remove(id: string): Promise<boolean> {
        return await idx.db.dataevents.delete(id);
    }

    static async get(id: string): Promise<DataEventSchema> {
        return await idx.db.dataevents.get(id);
    }

    static async update(id: string, data: IDataEventCreateDTO): Promise<DataEventSchema> {
        await idx.db.dataevents.update(id, data);
        const document = await idx.db.dataevents.get(id);
        return document;
    }
}