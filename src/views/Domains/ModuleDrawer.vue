<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { BreadCrumbMain, AlertMessage } from '@/components/Application'
import router from '@/router';
import { useDomainsStore } from '@/stores';
const route = ref(router.currentRoute)

const domainStore = useDomainsStore()

defineProps<{
  moduleName: RouteRecordName | null | undefined,
  icon: RouteRecordName | null | undefined,
}>()

onMounted(async () => {
  // await domainStore.sync();
});

// 
</script>

<template>
  <BreadCrumbMain v-bind:moduleName="moduleName" v-bind:childName="route.name" />
  <section class="section is-main-section">
    <div class="padding">
      <AlertMessage />
      <router-view />
    </div>
  </section>
</template>
<style scoped>
  .padding{
    padding-top: 80px;
    padding-bottom: 40px;
  }
</style>