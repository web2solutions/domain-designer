<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';

defineProps<{
  moduleName: RouteRecordName | null | undefined,
}>()
</script>

<template>
    <section class="hero is-hero-bar">
        <div class="hero-body">
          <div class="level">
            <div class="level-left">
              <div class="level-item"><h1 class="title">
                {{ moduleName }}
              </h1></div>
            </div>
            <div class="level-right" style="display: none;">
              <div class="level-item"></div>
            </div>
          </div>
        </div>
      </section>
</template>
