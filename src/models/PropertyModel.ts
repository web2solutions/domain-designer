import { OpenAPIV3 } from "openapi-types";

import { BaseModel } from "@/models/BaseModel";
import type { IQueryRequest } from "@/stores/IQueryRequest";
import type { IPagingResponse } from "@/stores/IPagingResponse";
import type { IPropertyCreateDTO } from "@/models/IPropertyCreateDTO";
import { idx, DomainDesignerDB } from '@/database/IDX'
import { PropertySchema } from "@/database/PropertySchema";


export class PropertyModel extends BaseModel implements PropertySchema {
    private db: DomainDesignerDB;
    public name: string;
    public domain_id: string;
    public entity_id: string;
    public description: string;
    public spec: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject;
    constructor(record: IPropertyCreateDTO){
        super();
        console.log(this.id)
        if(record.id) {
            this.id = record.id;
        }
        this.name = record.name;
        this.domain_id = record.domain_id;
        this.entity_id = record.entity_id;
        this.description = record.description || '';
        this.spec = record.spec || {};
        this.db = idx.db;
    }

    async save() {
        try {
            const rawDoc = this.toJSON()
            const id = await this.db.properties.add(rawDoc)
            const document = { ...rawDoc, id };
            await PropertyModel.storeEvent('Property', 'Property created', document);
            return document;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async count () {
        try {
            return await idx.db.properties.toCollection().count();
        } catch (error) {
            console.log(error);
            return 0
        }
    }

    toJSON(): PropertySchema {
        const { name, description, domain_id, entity_id, spec, version } = this;
        const json = {
            id: this.id,
            name,
            domain_id,
            entity_id,
            description,
            spec,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            version,
        };
        return json
    }

    static async getAll(query: IQueryRequest): Promise<IPagingResponse<PropertySchema>> {
        const page = query.page || 1;
        const size = query.size || 30;
        const total = await idx.db.properties.toCollection().count();
        const offset = (page * size) - size;
        const result = await idx.db.properties
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
        return await idx.db.properties.delete(id);
    }

    static async getEntireCollection(): Promise<PropertySchema[]> {
        const result = await idx.db.properties
            .orderBy('name')
            .toArray();
        return result;
    }

    static async get(id: string) : Promise<PropertySchema> {
        return await idx.db.properties.get(id);
    }

    static async getAllByFilter(indexName: string, value: string): Promise<PropertySchema[]> {
        return await idx.db.properties.where(indexName).equals(value).sortBy('name');
    }

    static async update(id: string, data: IPropertyCreateDTO): Promise<PropertySchema> {
        let document = await idx.db.properties.get(id);
        await idx.db.properties.update(id, { 
            ...document, 
            ...data, 
            version: document.version + 1,
            id: document.id, // avoid change id
        });
        document = await idx.db.properties.get(id);
        await PropertyModel.storeEvent('Property', 'Property updated', document);
        return document;
    }
}