
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
    constructor(record: IEntityCreateDTO){
        super();
        this.name = record.name;
        this.domain_id = record.domain_id
        this.description = record.description || '';
        this.db = idx.db;
    }

    save() {
        return this.db.entities.add(this.toJSON());
    }

    toJSON() {
        const { name, description, domain_id } = this;
        const json = {
            id: this.id,
            name,
            domain_id,
            description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json
    }

    log () {
        console.log(this);
    }

    static async getAll(query: IQueryRequest): Promise<IPagingResponse<EntitySchema>> {
        const page = query.page || 1;
        const size = query.size || 30;
        const total = await idx.db.entities.toCollection().count();
        const offset = (page * size) - size;
        const result = await idx.db.entities
            // .where({ name: 'Products' })
            .offset(offset)
            .limit(size)
            .sortBy('name');
            
        const response = {
            page,
            size,
            total,
            result,
        };
        console.log(response)
        return response;
    }

    static async remove(id: string) {
        return await idx.db.entities.delete(id);
    }

    static async get(id: string) {
        return await idx.db.entities.get(id);
    }

    static async update(id: string, data: IEntityCreateDTO) {
        await idx.db.entities.update(id, data);
        const document = await idx.db.entities.get(id);
        return document;
    }
}