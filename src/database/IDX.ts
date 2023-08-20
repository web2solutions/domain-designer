import Dexie from 'dexie';
import { DomainSchema } from '@/database/DomainSchema';
import { EntitySchema } from '@/database/EntitySchema';
import { PropertySchema } from '@/database/PropertySchema';

const stores = {
	domains: 'id,&name,description,createdAt,updatedAt',
    entities: 'id,domain_id,&name,description,createdAt,updatedAt',
    properties: 'id,domain_id,entity_id,name,description,createdAt,updatedAt',
}


export class DomainDesignerDB extends Dexie {
    public domains: Dexie.Table<DomainSchema, number>;
    public entities: Dexie.Table<EntitySchema, number>;
    public properties: Dexie.Table<PropertySchema, number>;

    constructor(name: string) {
        super(name);
        this.version(1).stores(stores);
        this.domains.mapToClass(DomainSchema);
        this.entities.mapToClass(EntitySchema);
        this.properties.mapToClass(PropertySchema);
    }
}

export class IDX {
    public db: any;
    constructor(){
        this.db = new DomainDesignerDB("DomainDesignerx1");
        // this.db.version(1).stores(stores)
    }

    public async start () {
        await this.db.open();
    }
}
export const idx = new IDX();