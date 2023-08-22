<script setup lang="ts">
import { onMounted } from 'vue';
import { default as EntityPanelTab } from './EntityPanelTab.vue';
import { default as EntityGrid } from './EntityGrid.vue'
import { default as EntityForm } from './EntityForm.vue';

defineProps<{
  title: string,
  data: any[],
  icon: string,
  columns: any[],
  actions: any[],
  store: any,
}>()


onMounted(() => {
    
});

</script>
<template>
    <div class="block">
        <EntityPanelTab :store="store"/>
        <EntityForm :store="store" />
        <EntityGrid :data="data" :columns="columns" :actions="actions" :store="store" />
    </div>
</template>