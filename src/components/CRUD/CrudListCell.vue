<script setup lang="ts">
import { toHumanDate } from './utils';

defineProps<{
  name: string,
  label: string,
  type: string, // string, number, date
  value: any,
}>()
</script>
<template>
    <template v-if="type === 'date'">
      <td 
        :data-label="name"
      >
        <small 
          class="has-text-grey is-abbr-like" 
          :title="toHumanDate(value)"
        >
          {{ toHumanDate(value) }}
        </small>
      </td>
    </template>
    <template v-else>
      <td 
        :data-label="name"
      >
        {{ value }}
      </td>
    </template>
    
</template>