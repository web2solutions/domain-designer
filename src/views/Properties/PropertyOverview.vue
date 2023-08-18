<script setup lang="ts">
import { onMounted } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';

import { default as PropertyOverviewHeader } from './PropertyOverviewHeader.vue'
import { usePropertiesStore } from '../../stores';

const propertyStore = usePropertiesStore();
const route = useRoute();
const id = route.params.id ? route.params.id.toString() : undefined;

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()

onMounted(async () => {
  if (id) {
    const record = await propertyStore.getRecord(id as string);
    console.log(record);
  }
});


</script>

<template>
    <PropertyOverviewHeader :store="propertyStore" :appName="childName" :icon="icon" />
    
</template>