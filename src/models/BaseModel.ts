import {
    v4 as uuidv4
} from 'uuid';

import { DataEventModel } from "./DataEventModel";

export class BaseModel {
    public id: string;
    public createdAt: Date;
    public updatedAt: Date;
    public version: number;

    constructor(){
        const now = new Date();
        this.id = uuidv4();
        this.createdAt = now;
        this.updatedAt = now;

        this.version = 0;
    }

    static async storeEvent (entity: string, action: string, data: any) {
        const model = new DataEventModel({
            entity,
            action,
            data,
            data_id: data.id,
        });
        await model.save();
    }
}