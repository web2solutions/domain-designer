<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';
import { useLanguageStore } from '@/stores';

const languageStore = useLanguageStore();

defineProps<{
  moduleName: RouteRecordName | null | undefined,
  childName: RouteRecordName | null | undefined,
}>()
</script>

<template>
  <div class="box breadcumb-main">
    <nav class="breadcrumb has-succeeds-separator is-fixed-top is-transparent" aria-label="breadcrumbs">
      <ul>
        <li>
          <router-link to="/" class="has-icon">
            <span class="icon"><i class="mdi mdi-monitor-dashboard"></i></span>
            <span v-if="childName !== ''" class="menu-item-label">{{ languageStore.default.application.Home }}</span>
            <span class="menu-item-label" v-else>{{ languageStore.default.application.Dashboard }}</span>
          </router-link>
        </li>
        <li v-if="childName !== ''"><a href="#">{{ moduleName }}</a></li>
        <li v-if="childName !== ''" class="is-active"><a href="#" aria-current="page">{{ childName }}</a></li>
      </ul>
    </nav>    
  </div>
</template>
<style scope>
.breadcumb-main {
  position: fixed;
  width: 100%;
  top: 20;
  left: 30;
  overflow:hidden;
  z-index: 10;
  background-color: #cfcece;
}
</style>