<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import { CrudApp } from '@/components/CRUD/';
import { useDataEventsStore } from '@/stores';

const entityStore = useDataEventsStore();

const route = useRoute();

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>();
</script>

<template>
  <CrudApp :store="entityStore" :appName="childName" :icon="icon"  :listpath="route.path" />
</template>