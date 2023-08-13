
import { BaseModel } from "@/models/BaseModel";
import type { IDomainCreateDTO } from "@/models/IDomainCreateDTO";
import { idx, DomainDesignerDB } from '@/database/IDX'
import { DomainSchema } from "@/database/DomainSchema";

export class DomainModel extends BaseModel implements DomainSchema {
    private db: DomainDesignerDB;
    public name: string;
    public description: string;
    constructor(record: IDomainCreateDTO){
        super();
        this.name = record.name;
        this.description = record.description || '';
        this.db = idx.db;
    }

    save() {
        return this.db.domains.add(this.toJSON());
    }

    toJSON() {
        const { name, description } = this;
        const json = {
            id: this.id,
            name,
            description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json
    }

    log () {
        console.log(this);
    }

    static async getAll() {
        return await idx.db.domains.toArray();
    }

    static async remove(id: string) {
        return await idx.db.domains.delete(id);
    }

    static async get(id: string) {
        return await idx.db.domains.get(id);
    }

    static async update(id: string, data: IDomainCreateDTO) {
        await idx.db.domains.update(id, data);
        const document = await idx.db.domains.get(id);
        return document;
    }
}