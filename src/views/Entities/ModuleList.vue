<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';
import { CrudApp } from '@/components/CRUD/';
import { useEntitiesStore } from '@/stores';

const entityStore = useEntitiesStore();

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>();
</script>

<template>
  <CrudApp :store="entityStore" :appName="childName" :icon="icon" />
</template>