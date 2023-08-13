<script setup lang="ts">
const props = defineProps<{
  store: any,
}>()
</script>
<template>
    <thead>
        <tr>
          <th class="is-checkbox-cell">
            <label class="b-checkbox checkbox">
              <input type="checkbox">
              <span class="check"></span>
            </label>
          </th>
          <th></th>
          <th v-for="col in props.store.columns" :key="col.name">
            {{ col.label }}
          </th>
          <th></th>
        </tr>
      </thead>
</template>