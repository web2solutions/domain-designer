import { OpenAPIV3 } from "openapi-types";

import { BaseModel } from "@/models/BaseModel";
import type { IQueryRequest } from "@/stores/IQueryRequest";
import type { IPagingResponse } from "@/stores/IPagingResponse";
import type { ISchemaCreateDTO } from "@/models/ISchemaCreateDTO";
import { idx, DomainDesignerDB } from '@/database/IDX'
import { SchemaSchema } from "@/database/SchemaSchema";

export class SchemaModel extends BaseModel implements SchemaSchema {
    private db: DomainDesignerDB;
    public name: string;
    public spec: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
    constructor(record: ISchemaCreateDTO){
        super();
        console.log(this.id)
        if(record.id) {
            this.id = record.id;
        }
        this.name = record.name;
        this.spec = record.spec || {};
        this.db = idx.db;
    }

    async save() {
        try {
            const rawDoc = this.toJSON()
            const id = await this.db.schemas.add(rawDoc)
            const document = { ...rawDoc, id };
            await SchemaModel.storeEvent('Schema', 'Schema created', document);
            return document;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async count () {
        try {
            return await idx.db.schemas.toCollection().count();
        } catch (error) {
            console.log(error);
            return 0
        }
    }

    toJSON(): SchemaSchema {
        const { name, spec, version } = this;
        const json = {
            id: this.id,
            name,
            spec,
            version,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json
    }

    static async getAll(query: IQueryRequest): Promise<IPagingResponse<SchemaSchema>> {
        const page = query.page || 1;
        const size = query.size || 30;
        const total = await idx.db.schemas.toCollection().count();
        const offset = (page * size) - size;
        const result = await idx.db.schemas
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
        return await idx.db.schemas.delete(id);
    }

    static async getEntireCollection(): Promise<SchemaSchema[]> {
        const result = await idx.db.schemas
            .orderBy('name')
            .toArray();
        return result;
    }

    static async get(id: string) : Promise<SchemaSchema> {
        return await idx.db.schemas.get(id);
    }

    static async getAllByFilter(indexName: string, value: string): Promise<SchemaSchema[]> {
        return await idx.db.schemas.where(indexName).equals(value).sortBy('name');
    }

    static async update(id: string, data: ISchemaCreateDTO): Promise<SchemaSchema> {
        let document = await idx.db.schemas.get(id);
        await idx.db.schemas.update(id, { 
            ...document, 
            ...data, 
            version: document.version + 1,
            id: document.id, // avoid change id
        });
        document = await idx.db.schemas.get(id);
        await SchemaModel.storeEvent('Schema', 'Schema updated', document);
        return document;
    }
}