import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import type { ISchemaCreateDTO } from '@/models/ISchemaCreateDTO';
import type { IQuery } from './IQuery';
import { useAlertStore } from '@/stores/alert.store';
import type { SchemaSchema } from '@/database/SchemaSchema';
import { SchemaModel } from '@/models/SchemaModel'
import type { IGridColumn } from '@/components/IGridColumn';

const gridComuns: IGridColumn[] = [
    {
        name: 'name',
        label: 'Schema name',
        type: 'string',
    },
    {
        name: 'version',
        label: 'Version',
        type: 'number',
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

export const useSchemasStore = defineStore({
    id: 'schemas',
    state: () => ({
        columns: [ ...gridComuns ],
        records: [ ...[] as SchemaSchema[] ],
        record: { ...{} as SchemaSchema },
        filter: false,
        page: 1,
        pageSize: 10,
        pageSizes: [5, 10, 15, 20, 50, 100],
        total: 0,
        numberOfPages: 0,
        pageTotalRecords: [1],
        pages: [],
        loading: false,
        gotTo: '',
    }),
    actions: {
        reset (): void {
            this.records = [];
            this.record = { ...{} as SchemaSchema };
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
        
        async create(record: ISchemaCreateDTO): Promise<SchemaSchema> {
            this.loading = true;
            const document = new SchemaModel(record);
            await document.save();
            const rawDocument = document.toJSON();
            // console.log(rawDocument);
            this.records.push(rawDocument);
            this.loading = false;
            this.total += 1;
            return rawDocument;
        },

        async update (id: string, record: ISchemaCreateDTO): Promise<SchemaSchema> {
            this.loading = true;
            const document = await SchemaModel.update(id, record);
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

        async getRecord (id: string): Promise<SchemaSchema> {
            const document = await SchemaModel.get(id);
            this.record = { ...document };
            return document
        },

        async remove (id: string): Promise<void> {
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
                await SchemaModel.remove(id);
                await this.sync();
                const alertStore = useAlertStore();
                alertStore.warning('The document is deleted')
                this.loading = false;
            } else {
                this.loading = false;
            }
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
                const { result, total } = await SchemaModel.getAll(paging);
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

        async getAll(): Promise<SchemaSchema[]> {
            const documents: SchemaSchema[] = await SchemaModel.getEntireCollection();
            return documents;            
        },

        async getAllByEntityId (entity_id: string): Promise<SchemaSchema[]> {
            try {
                const documents = await SchemaModel.getAllByFilter('entity_id', entity_id);
                return documents;
            } catch (error) {
                console.log(error)
                throw error;
            }
        }
    }
});
