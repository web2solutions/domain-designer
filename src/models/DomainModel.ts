
import { BaseModel } from "@/models/BaseModel";
import type { IQueryRequest } from "@/stores/IQueryRequest";
import type { IPagingResponse } from "@/stores/IPagingResponse";
import type { IDomainCreateDTO } from "@/models/IDomainCreateDTO";
import { idx, DomainDesignerDB } from '@/database/IDX'
import { DomainSchema } from "@/database/DomainSchema";

export class DomainModel extends BaseModel implements DomainSchema {
    private db: DomainDesignerDB;
    public name: string;
    public description: string;
    constructor(record: IDomainCreateDTO){
        super();
        if(record.id) {
            this.id = record.id;
        }
        this.name = record.name;
        this.description = record.description || '';
        this.db = idx.db;
    }

    async save(): Promise<DomainSchema> {
        try {
            const rawDoc = this.toJSON()
            const id = await this.db.domains.add(rawDoc)
            const document = { ...rawDoc, id };
            await DomainModel.storeEvent('Domain', 'Domain created', document);
            return document;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async count () {
        try {
            return await idx.db.domains.toCollection().count();
        } catch (error) {
            console.log(error);
            return 0
        }
    }

    toJSON(): DomainSchema {
        const { name, description, version } = this;
        const json = {
            id: this.id,
            name,
            description,
            version,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
        return json
    }

    static async getAll(query: IQueryRequest): Promise<IPagingResponse<DomainSchema>> {
        const page = query.page || 1;
        const size = query.size || 30;
        const total = await idx.db.domains.toCollection().count();
        const offset = (page * size) - size;
        const result = await idx.db.domains
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
        // console.log(response)
        return response;
    }

    static async getEntireCollection(): Promise<DomainSchema[]> {
        const result = await idx.db.domains
            .orderBy('name')
            .toArray();
        return result;
    }

    static async remove(id: string): Promise<boolean> {
        return await idx.db.domains.delete(id);
    }

    static async get(id: string): Promise<DomainSchema> {
        return await idx.db.domains.get(id);
    }

    static async update(id: string, data: IDomainCreateDTO): Promise<DomainSchema> {
        let document = await idx.db.domains.get(id);
        await idx.db.domains.update(id, { 
            ...document, 
            ...data, 
            version: document.version + 1,
            id: document.id, // avoid change id
        });
        document = await idx.db.domains.get(id);
        await DomainModel.storeEvent('Domain', 'Domain updated', document);
        return document;
    }
}