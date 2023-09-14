<script setup lang="ts">
import { onMounted } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';

import { default as DataEventOverviewHeader } from './DataEventOverviewHeader.vue'
import { useDataEventsStore } from '@/stores';

const domainStore = useDataEventsStore();
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
    <DataEventOverviewHeader :store="domainStore" :appName="childName" :icon="icon" />
</template>