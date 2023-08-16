<script setup lang="ts">
import { toHumanDate } from './utils';
import { CrudListCellRelation } from '.';

const props = defineProps<{
  name: string,
  label: string,
  type: string, // string, number, date
  value: any,
  col: any,
  store: any,
}>()

function getRecord(value: any){
  return Promise.resolve(props.store.getRecord(value));
}
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
        <template v-if="col.foreignKey">
          <CrudListCellRelation 
            :name="name" 
            :label="label" 
            :type="type" 
            :value="value" 
            :col="col" 
          />
        </template>
        <template v-else>
          {{ value }}
        </template>
      </td>
    </template>
    
</template>