
import { BaseModel } from "@/models/BaseModel";
import type { IQueryRequest } from "@/stores/IQueryRequest";
import type { IPagingResponse } from "@/stores/IPagingResponse";
import type { IEntityCreateDTO } from "@/models/IEntityCreateDTO";
import { idx, DomainDesignerDB } from '@/database/IDX'
import { EntitySchema } from "@/database/EntitySchema";


export class EntityModel extends BaseModel implements EntitySchema {
    private db: DomainDesignerDB;
    public name: string;
    public domain_id: string;
    public description: string;
    public isSchemaOnly: boolean;
    constructor(record: IEntityCreateDTO){
        super();
        if(record.id) {
            this.id = record.id;
        }
        this.name = record.name;
        this.domain_id = record.domain_id || ''
        this.description = record.description || '';
        this.isSchemaOnly = record.isSchemaOnly || false;
        this.db = idx.db;
    }

    async save() {
        const rawDoc = this.toJSON();
        const id = await this.db.entities.add(rawDoc);
        return { ...rawDoc, id };
    }

    async count () {
        try {
            return await idx.db.entities.toCollection().count();
        } catch (error) {
            console.log(error);
            return 0
        }
    }

    toJSON(): EntitySchema {
        const { name, description, domain_id, version } = this;
        const json = {
            id: this.id,
            name,
            domain_id,
            description,
            version,
            isSchemaOnly: this.isSchemaOnly,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json
    }

    static async getAll(query: IQueryRequest): Promise<IPagingResponse<EntitySchema>> {
        const page = query.page || 1;
        const size = query.size || 30;
        const total = await idx.db.entities.toCollection().count();
        const offset = (page * size) - size;
        const result = await idx.db.entities
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

    static async remove(id: string) : Promise<Boolean> {
        return await idx.db.entities.delete(id);
    }

    static async getEntireCollection(): Promise<EntitySchema[]> {
        const result = await idx.db.entities
            .orderBy('name')
            .toArray();
        return result;
    }

    static async get(id: string) : Promise<EntitySchema> {
        return await idx.db.entities.get(id);
    }

    static async getAllByFilter(indexName: string, value: string): Promise<EntitySchema[]> {
        return await idx.db.entities.where(indexName).equals(value).sortBy('name');
    }

    static async update(id: string, data: IEntityCreateDTO): Promise<EntitySchema> {
        let document = await idx.db.entities.get(id);
        await idx.db.entities.update(id, { 
            ...document, 
            ...data, 
            version: document.version + 1,
            id: document.id, // avoid change id
        });
        document = await idx.db.entities.get(id);
        await EntityModel.storeEvent('entities', 'update', document);
        return document;
    }
}