import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import type { IDataEventCreateDTO } from '@/models/IDataEventCreateDTO';
import { DataEventModel } from '@/models/DataEventModel';
import type { IQuery } from './IQuery';
import { useAlertStore } from '@/stores/alert.store';
import type { DataEventSchema } from '@/database/DataEventSchema';

export const useDataEventsStore = defineStore({
    id: 'dataevents',
    state: () => ({
        columns: [
            {
                name: 'entity',
                label: 'Component',
                type: 'string',
            },
            {
                name: 'action',
                label: 'Change type',
                type: 'string',
            },
            {
                name: 'createdAt',
                label: 'Created',
                type: 'date',
            },
        ],
        records: [ ...[] as DataEventSchema[]],
        record: { ...{} as DataEventSchema },
        filter: false,
        page: 1,
        pageSize: 20,
        pageSizes: [5, 10, 15, 20, 50, 100],
        total: 0,
        numberOfPages: 0,
        pageTotalRecords: [1],
        pages: [],
        loading: false,
    }),
    actions: {
        reset (): void {
            this.records = [];
            this.record = { ...{} as DataEventSchema };
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
        
        async create(record: IDataEventCreateDTO): Promise<DataEventSchema> {
            this.loading = true;
            const document = new DataEventModel(record);
            await document.save();
            const rawDocument = document.toJSON();
            // console.log(rawDocument);
            this.records.push(rawDocument);
            this.loading = false;
            this.total += 1;
            return rawDocument;
        },

        async update (id: string, record: IDataEventCreateDTO): Promise<DataEventSchema> {
            this.loading = true;
            const document = await DataEventModel.update(id, record);
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

        async getRecord (id: string): Promise<DataEventSchema> {
            const document = await DataEventModel.get(id);
            this.record = { ...document };
            return document
        },

        async remove (id: string): Promise<void> {
            this.loading = true
            const { isConfirmed } = await Swal.fire({
                title: 'Delete event',
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
                await DataEventModel.remove(id);
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
                // console.log(paging)
                const { result, total } = await DataEventModel.getAll(paging);
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

        async getAll(): Promise<DataEventSchema[]> {
            const documents: DataEventSchema[] = await DataEventModel.getEntireCollection();
            return documents;            
        }
    }
});
