import Dexie from 'dexie';
import { DomainSchema } from '@/database/DomainSchema';
import { EntitySchema } from '@/database/EntitySchema';
import { PropertySchema } from '@/database/PropertySchema';
import { APISchema } from '@/database/APISchema';

const stores = {
    apis: 'id,&name,description,versions,createdAt,updatedAt',
	domains: 'id,&name,description,createdAt,updatedAt',
    entities: 'id,domain_id,&name,description,createdAt,updatedAt',
    properties: 'id,domain_id,entity_id,name,description,createdAt,updatedAt',
}


export class DomainDesignerDB extends Dexie {
    public domains!: Dexie.Table<DomainSchema, string>;
    public entities!: Dexie.Table<EntitySchema, string>;
    public properties!: Dexie.Table<PropertySchema, string>;
    public apis!: Dexie.Table<APISchema, string>;

    constructor(name: string) {
        super(name);
        this.version(1).stores(stores);
        this.apis.mapToClass(APISchema);
        this.domains.mapToClass(DomainSchema);
        this.entities.mapToClass(EntitySchema);
        this.properties.mapToClass(PropertySchema);
    }
}

export class IDX {
    public db: any;
    constructor(){
        this.db = new DomainDesignerDB("DomainDesignerx123");
        // this.db.version(1).stores(stores)
    }

    public async start () {
        await this.db.open();
    }
}
export const idx = new IDX();