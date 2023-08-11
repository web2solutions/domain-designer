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
  <div class="box">
    <nav class="breadcrumb has-succeeds-separator" aria-label="breadcrumbs">
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
