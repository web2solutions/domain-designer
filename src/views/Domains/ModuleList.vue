<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';
import { CrudApp } from '@/components/CRUD/';
import { useDomainsStore } from '@/stores';

const domainStore = useDomainsStore();

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>();
</script>

<template>
  <CrudApp :store="domainStore" :appName="childName" :icon="icon" />
</template>