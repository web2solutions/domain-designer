<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import router from '@/router';
import { DynamicTable } from '@/components/DynamicTable/';
import { default as DomainOverviewHeader } from './DomainOverviewHeader.vue'
import { useDomainsStore, useEntitiesStore } from '@/stores';
import { EntitySchema } from '../../database/EntitySchema';
import type { IGridColumn } from '@/components/IGridColumn';

const domainStore = useDomainsStore();
const entityStore = useEntitiesStore();

const route = useRoute();
const id = route.params.id ? route.params.id.toString() : undefined;
const parentPath = route.matched[0].path;

const emptyEntities: EntitySchema[] = [];
const emptyColumns: IGridColumn[] = [];
const entities = ref(emptyEntities);
const columns = ref(emptyColumns);

const actions = ref([
  {
    name: 'edit entity',
    icon: 'mdi-pencil',
    handler: (id: string) => {
      router.push(`/entities/update/${id}`);
    },
  }
]);

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()

onMounted(async () => {
  if (id) {
    const record = await domainStore.getRecord(id as string);
    console.log(record);
    entities.value = await domainStore.getEntities(id);

    try {
      const r = entityStore.columns.filter((c:IGridColumn) => {
        if(!c.foreignKey && c.name !== 'createdAt' && c.name !== 'updatedAt') return c;
      }) as IGridColumn[];
      console.log(r)
      columns.value = r;
    } catch (error) {
      console.log(error)
    }
  }
});
</script>
<template>
    <DomainOverviewHeader :store="domainStore" :entities="entities" :appName="childName" :icon="icon" />
    <DynamicTable key="entities" :columns="columns" :data="entities" :icon="'mdi-alpha-e-box'" :actions="actions" />
</template>