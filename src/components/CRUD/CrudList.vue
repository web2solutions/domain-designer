
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
        <template v-if="store.records.length === 0">
          <div class="notification is-light">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <div>
                    <b>Empty table.</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <CrudListTable :store="store" />
        </template>
      </div>
</template>