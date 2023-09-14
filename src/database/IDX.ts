import Dexie from 'dexie';
import {
    v4 as uuidv4
} from 'uuid';
import { DomainSchema } from '@/database/DomainSchema';
import { EntitySchema } from '@/database/EntitySchema';
import { PropertySchema } from '@/database/PropertySchema';
import { APISchema } from '@/database/APISchema';
import { SchemaSchema } from '@/database/SchemaSchema';
import { DataEventSchema } from '@/database/DataEventSchema';
import { DataEventModel } from '@/models/DataEventModel';

const stores = {
    apis: 'id,&name,description,versions,createdAt,updatedAt', // versions is an array, do not confund with version of other collections
	domains: 'id,&name,description,version,createdAt,updatedAt',
    entities: 'id,domain_id,&name,description,version,createdAt,updatedAt',
    properties: 'id,domain_id,entity_id,name,description,version,createdAt,updatedAt',
    schemas: 'id,name,version,createdAt,updatedAt',
    dataevents: 'id,entity,action,data_id,data,version,createdAt,updatedAt',
}


export class DomainDesignerDB extends Dexie {
    public domains!: Dexie.Table<DomainSchema, string>;
    public entities!: Dexie.Table<EntitySchema, string>;
    public properties!: Dexie.Table<PropertySchema, string>;
    public apis!: Dexie.Table<APISchema, string>;
    public schemas!: Dexie.Table<SchemaSchema, string>;
    public dataevents!: Dexie.Table<DataEventSchema, string>;

    constructor(name: string) {
        super(name);
        this.version(1).stores(stores);
        this.apis.mapToClass(APISchema);
        this.domains.mapToClass(DomainSchema);
        this.entities.mapToClass(EntitySchema);
        this.properties.mapToClass(PropertySchema);
        this.schemas.mapToClass(SchemaSchema);
        this.dataevents.mapToClass(DataEventSchema);
    }

   
}

export class IDX {
    public db: any;
    constructor(){
        this.db = new DomainDesignerDB("DomainDesignerx12345");
        // this.db.version(1).stores(stores)
    }

    public async start () {
        await this.db.open();
    }
}
export const idx = new IDX();