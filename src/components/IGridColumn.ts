import type { BaseModel as IBaseModel } from "@/stores";

export interface IGridForeignKey {
    model: IBaseModel;
    labelKey: string;
}

export interface IGridColumn {
    name: string;
    label: string;
    type: string;
    foreignKey?: IGridForeignKey;
}