import { defineStore } from 'pinia';
import type { IQuery } from './IQuery';
import { domains } from './domains';

export const useDomainsStore = defineStore({
    id: 'domains',
    state: () => ({
        columns: [
            {
                name: 'Name',
            },
            {
                name: 'Description',
            },
            {
                name: 'Entities',
            },
            {
                name: 'Created',
            },
            {
                name: 'Updated',
            },
        ],
        records: [...domains],
        record: {},
        filter: false,
        page: 1,
        pageSize: 20,
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
        
    }
});
