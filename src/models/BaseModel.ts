import {
    v4 as uuidv4
} from 'uuid';

export class BaseModel {
    public id: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(){
        const now = new Date();
        this.id = uuidv4();
        this.createdAt = now;
        this.updatedAt = now;
    }
}