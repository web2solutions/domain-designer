<script setup lang="ts">
import { ref } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { BreadCrumbMain } from '@/components/Application/index'
import router from '@/router';

const route = ref(router.currentRoute)

defineProps<{
  moduleName: RouteRecordName | null | undefined,
  icon: RouteRecordName | null | undefined,
}>()
</script>

<template>
  <BreadCrumbMain v-bind:moduleName="moduleName" v-bind:childName="route.name" />
  <section class="section is-main-section">
    <router-view />
  </section>
</template>