
<script setup lang="ts">
// import type { Store } from 'pinia';
import { onMounted } from 'vue';
import { CrudListTable } from './index'

defineProps<{
  store: any,
}>()

onMounted(() => {
  // console.log(props.store.columns[1])
})

</script>

<template>
    
      <div class="card-content">
        <CrudListTable :store="store" />
      </div>
</template>