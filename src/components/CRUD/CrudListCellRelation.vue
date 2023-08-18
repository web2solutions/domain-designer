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
    console.log(props.col)
    console.log(props.value)
    try {
      const document =  await props.col.foreignKey.model.get(props.value);
      cellValue.value = document[props.col.foreignKey.labelKey];
    } catch (error) {
      // console.log(error);
    }
});
</script>
<template>
    {{ cellValue }}
</template>