<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import { CrudApp } from '@/components/CRUD/';
import { default as DomainOverviewHeader } from './DomainOverviewHeader.vue'
import { useDomainsStore } from '@/stores';

const domainStore = useDomainsStore();
const route = useRoute();
const id = route.params.id ? route.params.id.toString() : undefined;

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()

onMounted(async () => {
  if (id) {
    const record = await domainStore.getRecord(id as string);
    console.log(record);
  }
});


</script>

<template>
    <DomainOverviewHeader :store="domainStore" :appName="childName" :icon="icon" />
    <CrudApp :store="domainStore" appName="Entities" :icon="icon" />
</template>