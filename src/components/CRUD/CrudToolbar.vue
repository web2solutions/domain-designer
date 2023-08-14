<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';

defineProps<{
  appName: RouteRecordName | null | undefined,
  icon: string,
  store: any,
}>()
</script>

<template>
    <header class="card-header">
        <p class="card-header-title">
          <span class="icon"><i :class="'mdi ' + icon"></i></span>
          {{ appName }}
        </p>
        <p class="card-header-icon">
          <router-link to="create" type="button" class="button">
            <span class="icon"><i class="mdi mdi-plus-circle"></i></span>
          </router-link>
          <button type="button" class="button">
            <span class="icon"><i class="mdi mdi-close-circle"></i></span>
          </button>
          <button type="button" class="button" @click="store.sync()">
            <span class="icon"><i class="mdi mdi-reload"></i></span>
          </button>
        </p>
      </header>
</template>