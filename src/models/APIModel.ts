import { BaseModel } from "@/models/BaseModel";
import type { IQueryRequest } from "@/stores/IQueryRequest";
import type { IPagingResponse } from "@/stores/IPagingResponse";
import type { IAPICreateDTO } from "@/models/IAPICreateDTO"; 
import { idx, DomainDesignerDB } from '@/database/IDX'
import { APISchema } from "@/database/APISchema";
import type { IVersionBranches } from "@/components/OAS";

export class APIModel extends BaseModel implements APISchema {
    private db: DomainDesignerDB;
    public name: string;
    public description: string;
    public versions: IVersionBranches;
    constructor(record: IAPICreateDTO){
        super();
        this.name = record.name;
        this.description = record.description || '';
        this.versions = record.versions || {};
        this.db = idx.db;
    }

    async save() {
        const rawDoc = this.toJSON()
        const id = await this.db.apis.add(rawDoc)
        return { ...rawDoc, id };
    }

    toJSON(): APISchema {
        const { name, description, versions } = this;
        const json = {
            id: this.id,
            name,
            description,
            versions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json
    }

    static async getAll(query: IQueryRequest): Promise<IPagingResponse<APISchema>> {
        const page = query.page || 1;
        const size = query.size || 30;
        const total = await idx.db.apis.toCollection().count();
        const offset = (page * size) - size;
        const result = await idx.db.apis
            .orderBy('name')
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
        console.log(response)
        return response;
    }

    static async remove(id: string) : Promise<boolean> {
        return await idx.db.apis.delete(id);
    }

    static async getEntireCollection(): Promise<APISchema[]> {
        const result = await idx.db.apis
            .orderBy('name')
            .toArray();
        return result;
    }

    static async get(id: string) : Promise<APISchema> {
        return await idx.db.apis.get(id);
    }

    static async getAllByFilter(indexName: string, value: string): Promise<APISchema[]> {
        return await idx.db.apis.where(indexName).equals(value).sortBy('name');
    }

    static async update(id: string, data: IAPICreateDTO): Promise<APISchema> {
        await idx.db.apis.update(id, data);
        const document = await idx.db.apis.get(id);
        return document;
    }
}