<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { RouteRecordName } from 'vue-router';
// import type { Store } from 'pinia';
import { AlertMessage, ModalMessage } from '@/components/Application/';
import { CrudList, CrudToolbar } from '@/components/CRUD/';
import { useDomainsStore } from '@/stores';

// import type { IDomain } from './IDomain';

const domainStore = useDomainsStore();
const domainStoreRef = ref(domainStore)
// console.log(domainStoreRef.value?.records)

// const alertStore = useAlertStore();
// alertStore.error('Test');

console.log(domainStore)

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()


</script>

<template>
  <AlertMessage />
  <div class="card has-table">
    <CrudToolbar v-bind:childName="childName" v-bind:icon="icon" />
    <CrudList :store="domainStoreRef" />
  </div>
  <ModalMessage />
  
</template>