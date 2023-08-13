<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteRecordName } from 'vue-router';
import { CrudList, CrudToolbar } from '@/components/CRUD/';
import type { IPagingRequest } from '@/stores/IPagingRequest';


const route = useRoute();

const props = defineProps<{
    appName: RouteRecordName | null | undefined,
    icon: string,
    store: any,
}>();

onMounted(async() => {
    // console.log('mounted')
    watch(
        () => route.query.page,
        async page => {    
        if (page && !isNaN(+page)) {
            const paging: IPagingRequest = {
            page: +page,
            }
            if (route.query.size && !isNaN(+route.query.size)) {
            paging.size = +route.query.size;
            }
            props.store.setPaging(paging);
            await props.store.sync();
        }
        }
    )

    watch(
        () => route.query.size,
        async size => {    
        if (size && !isNaN(+size)) {
            const paging: IPagingRequest = {
            size: +size,
            }
            if (route.query.page && !isNaN(+route.query.page)) {
            paging.page = +route.query.page;
            }
            props.store.setPaging(paging);
            await props.store.sync();
        }
        }
    )
    const { page, size } = route.query;
    if (page && !isNaN(+page)) {
        props.store.changePage(+page);
    }
    if (size && !isNaN(+size)) {
        props.store.changePageSize(+size);
    }
    await props.store.sync();
    console.log(route.query)
});

</script>
<template>
    <div class="card has-table">
        <CrudToolbar :appName="appName" :icon="icon" />
        <CrudList :store="store" />
    </div>
</template>