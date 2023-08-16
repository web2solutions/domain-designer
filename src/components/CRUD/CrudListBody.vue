<script setup lang="ts">
import { CrudListCell } from './';
const props = defineProps<{
  store: any,
}>()
</script>
<template>
    <tbody>
        <tr>
          <td colspan="7">
            <progress v-if="store.loading" class="progress is-small is-primary" max="100">15%</progress>
          </td>
        </tr>
        <tr v-for="record in props.store.records" :key="record.id">
          <td class="is-checkbox-cell">
            <label class="b-checkbox checkbox">
              <input type="checkbox">
              <span class="check"></span>
            </label>
          </td>
          <td class="is-image-cell">
            <div class="image">
              <img :src="'https://avatars.dicebear.com/v2/initials/'+record.name+'.svg'" :alt="record.name" class="is-rounded">
            </div>
          </td>
          
          <CrudListCell
              v-for="col in props.store.columns" :key="col.name"
             :name="col.name" 
             :label="col.label" 
             :type="col.type" 
             :foreignKey="col.foreignKey || {}"
             :value="record[col.name]"
             :col="col"
             :store="store"
            >
          </CrudListCell>
          
          <td class="is-actions-cell">
            <div class="buttons is-right">
              <router-link :to="'overview/' + record.id" class="button is-small is-light" type="button">
                <span class="icon"><i class="mdi mdi-eye"></i></span>
              </router-link>
              <router-link :to="'update/' + record.id" class="button is-small is-light" type="button">
                <span class="icon"><i class="mdi mdi-pencil"></i></span>
              </router-link>
              <button 
                class="button is-small is-danger" 
                type="button"
                @click="store.remove(record.id)"
              >
                <span class="icon"><i class="mdi mdi-trash-can"></i></span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
</template>