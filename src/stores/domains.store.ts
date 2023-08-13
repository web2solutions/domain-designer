import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import type { IDomainCreateDTO } from '@/models/IDomainCreateDTO';
import { DomainModel } from '@/models/DomainModel'
import type { IQuery } from './IQuery';
import { useAlertStore } from '@/stores/alert.store';

export const useDomainsStore = defineStore({
    id: 'domains',
    state: () => ({
        columns: [
            {
                name: 'name',
                label: 'Name',
                type: 'string',
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
        ],
        records: [],
        record: {},
        filter: false,
        page: 1,
        pageSize: 10,
        pageSizes: [5, 10, 15, 20, 50, 100],
        total: 0,
        numberOfPages: 0,
        pageTotalRecords: [1],
        pages: []
    }),
    actions: {
        reset () {
            this.records = [];
            this.record = {};
            this.filter = false;
            this.page = 1;
            this.pageSize = 20;
            this.pageSizes = [5, 10, 15, 20, 50, 100];
            this.total = 0;
            this.numberOfPages = 0;
            this.pageTotalRecords = [1];
            this.pages = [];
        },
        setPaging(query: IQuery) {
            const { page, size } = query;
            if (page) {
                this.page = page;
            }
            if (size) {
                this.pageSize = size;
            }
        },
        
        async create(record: IDomainCreateDTO) {
            const document = new DomainModel(record);
            await document.save();
            const rawDocument = document.toJSON();
            // console.log(rawDocument);
            this.records.push(rawDocument);
            return rawDocument;
        },

        async update (id: string, record: IDomainCreateDTO) {
            const document = await DomainModel.update(id, record);
            const rawDocument = document;
            // console.log(rawDocument);
            this.records = this.records.map(record =>{
                if(record.id === id) {
                    return { ...record, ...rawDocument };
                }
                return record;
            });
            return rawDocument;
        },

        async getRecord (id: string) {
            const document = await DomainModel.get(id);
            this.record = { ...document };
            return document
        },

        async remove (id: string) {
            const { isConfirmed } = await Swal.fire({
                title: 'Delete domain',
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
                await DomainModel.remove(id);
                await this.sync();
                const alertStore = useAlertStore();
                alertStore.warning('The document is deleted')
            }
        },

        async changePage(page: number) {
            this.page = page;
        },

        async changePageSize(size: number) {
            this.pageSize = size;
        },

        async sync() {
            try {
                const paging = {
                    page: this.page,
                    size: this.pageSize,
                };
                console.log(paging)
                const { result, total } = await DomainModel.getAll(paging);
                this.records = [ ...result ];
                this.total = total;
                this.numberOfPages = Math.ceil(this.total / this.pageSize);
                this.pageTotalRecords = [];
                for(let x = 1; x <= this.numberOfPages; x++) {
                    this.pageTotalRecords.push(x);
                }
            } catch (error) {
                console.log(error)
            } 
        }
    }
});
