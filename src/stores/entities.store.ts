import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import type { IEntityCreateDTO } from '@/models/IEntityCreateDTO';
import { EntityModel } from '@/models/EntityModel'
import type { IQuery } from './IQuery';
import { useAlertStore } from '@/stores/alert.store';
import type { EntitySchema } from '@/database/EntitySchema';
import { DomainModel } from '@/models/DomainModel';
// import type { DomainModel as IDomainModel } from '@/models/DomainModel';
import type { IGridColumn } from '@/components/IGridColumn';
import type { BaseModel } from '.';
import { PropertySchema } from '../database/PropertySchema';
import { PropertyModel } from '@/models/PropertyModel';

const gridComuns: IGridColumn[] = [
    {
        name: 'name',
        label: 'Entity Name',
        type: 'string',
    },
    {
        name: 'domain_id',
        label: 'Domain',
        type: 'string',
        foreignKey: {
            model: DomainModel as unknown as BaseModel,
            labelKey: 'name',
        }
    },
    {
        name: 'description',
        label: 'Description',
        type: 'string',
    },
    {
        name: 'createdAt',
        label: 'Created',
        type: 'date',
    },
    {
        name: 'updatedAt',
        label: 'Updated',
        type: 'date',
    },
];

export const useEntitiesStore = defineStore({
    id: 'entities',
    state: () => ({
        columns: [ ...gridComuns ],
        records: [ ...[] as EntitySchema[] ],
        record: { ...{} as EntitySchema },
        filter: false,
        page: 1,
        pageSize: 10,
        pageSizes: [5, 10, 15, 20, 50, 100],
        total: 0,
        numberOfPages: 0,
        pageTotalRecords: [1],
        pages: [],
        loading: false,
        goTo: '',
    }),
    actions: {
        reset (): void {
            this.records = [];
            this.record = { ...{} as EntitySchema };
            this.filter = false;
            this.page = 1;
            this.pageSize = 20;
            this.pageSizes = [5, 10, 15, 20, 50, 100];
            this.total = 0;
            this.numberOfPages = 0;
            this.pageTotalRecords = [1];
            this.pages = [];
            this.loading = false;
        },
        setPaging(query: IQuery): void {
            const { page, size } = query;
            if (page) {
                this.page = page;
            }
            if (size) {
                this.pageSize = size;
            }
        },
        
        async create(record: IEntityCreateDTO): Promise<EntitySchema> {
            this.loading = true;
            const document = new EntityModel(record);
            await document.save();
            const rawDocument = document.toJSON();
            // console.log(rawDocument);
            this.records.push(rawDocument);
            this.loading = false;
            this.total += 1;
            return rawDocument;
        },

        async update (id: string, record: IEntityCreateDTO): Promise<EntitySchema> {
            this.loading = true;
            const document = await EntityModel.update(id, record);
            const rawDocument = document;
            // console.log(rawDocument);
            this.records = this.records.map(record =>{
                if(record.id === id) {
                    return { ...record, ...rawDocument };
                }
                return record;
            });
            this.loading = false;
            return rawDocument;
        },

        async getRecord (id: string): Promise<EntitySchema> {
            const document = await EntityModel.get(id);
            this.record = { ...document };
            return document
        },

        async remove (id: string): Promise<boolean> {
            this.loading = true
            const { isConfirmed } = await Swal.fire({
                title: 'Delete entity',
                html: 'Do you really want to delete it?',
                confirmButtonText: 'yes',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'button is-danger',
                    cancelButton: 'button is-success',
                }
            });
            if (isConfirmed) {
                // console.log(id)
                await EntityModel.remove(id);
                await this.sync();
                const alertStore = useAlertStore();
                alertStore.warning('The document is deleted')
                this.loading = false;
            } else {
                this.loading = false;
            }
            return isConfirmed
        },

        changePage(page: number): void {
            this.page = page;
        },

        changePageSize(size: number): void {
            this.pageSize = size;
        },

        async sync(): Promise<void> {
            try {
                this.loading = true;
                const paging = {
                    page: this.page,
                    size: this.pageSize,
                };
                console.log(paging)
                const { result, total } = await EntityModel.getAll(paging);
                this.records = [ ...result ];
                this.total = total;
                this.numberOfPages = Math.ceil(this.total / this.pageSize);
                this.pageTotalRecords = [];
                for(let x = 1; x <= this.numberOfPages; x++) {
                    this.pageTotalRecords.push(x);
                }
                this.loading = false;
            } catch (error: any) {
                console.log(error);
                const alertStore = useAlertStore();
                alertStore.error(error.message);
                this.loading = false;
            } 
            
        },

        async getAll(): Promise<EntitySchema[]> {
            const documents: EntitySchema[] = await EntityModel.getEntireCollection();
            return documents;            
        },

        async getProperties (entityId: string): Promise<PropertySchema[]> {
            const documents: PropertySchema[] = await PropertyModel.getAllByFilter('entity_id', entityId);
            return documents;
        },
    }
});
