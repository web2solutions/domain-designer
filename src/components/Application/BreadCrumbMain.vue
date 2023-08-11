<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';

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
            <span class="menu-item-label">Home</span>
          </router-link>
        </li>
        <li><a href="#">{{ moduleName }}</a></li>
        <li class="is-active"><a href="#" aria-current="page">{{ childName }}</a></li>
      </ul>
    </nav>    
  </div>
</template>
