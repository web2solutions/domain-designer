<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()
</script>

<template>
    <header class="card-header">
        <p class="card-header-title">
          <span class="icon"><i :class="'mdi ' + icon"></i></span>
          {{ childName }}
        </p>
        <p class="card-header-icon">
          <button type="button" class="button">
            <span class="icon"><i class="mdi mdi-plus-circle"></i></span>
          </button>
          <button type="button" class="button is-active">
            <span class="icon"><i class="mdi mdi-circle-edit-outline"></i></span>
          </button>
          <button type="button" class="button">
            <span class="icon"><i class="mdi mdi-close-circle"></i></span>
          </button>
          <button type="button" class="button">
            <span class="icon"><i class="mdi mdi-reload"></i></span>
          </button>
        </p>
      </header>
</template>