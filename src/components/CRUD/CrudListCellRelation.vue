<script setup lang="ts">
import { onMounted, ref } from 'vue';
const props = defineProps<{
  name: string,
  label: string,
  type: string, // string, number, date
  value: any,
  col: any,
}>();
const cellValue = ref(null);
onMounted(async() => {
    const document =  await props.col.foreignKey.model.get(props.value);
    cellValue.value = document[props.col.foreignKey.labelKey];
});
</script>
<template>
    {{ cellValue }}
</template>