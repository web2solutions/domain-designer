
<script setup lang="ts">
// import type { Store } from 'pinia';
import { onMounted } from 'vue';
import { toHumanDate } from './utils';

const props = defineProps<{
  store: any,
}>()



onMounted(() => {
  console.log(props.store.columns[1])
})


</script>

<template>
    <div class="card-content">
        <div class="b-table has-pagination">
          <div class="table-wrapper has-mobile-cards">
            <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th class="is-checkbox-cell">
                    <label class="b-checkbox checkbox">
                      <input type="checkbox" value="false">
                      <span class="check"></span>
                    </label>
                  </th>
                  <th></th>
                  <th v-for="colObj in props.store.columns" :key="colObj.name">
                    {{ colObj.name }}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in props.store.records" :key="record.id">
                  <td class="is-checkbox-cell">
                    <label class="b-checkbox checkbox">
                      <input type="checkbox" value="false">
                      <span class="check"></span>
                    </label>
                  </td>
                  <td class="is-image-cell">
                    <div class="image">
                      <img :src="'https://avatars.dicebear.com/v2/initials/'+record.name+'.svg'" :alt="record.name" class="is-rounded">
                    </div>
                  </td>
                  <td data-label="Name">{{ record.name }}</td>
                  <td data-label="Description">{{ record.description }}</td>
                  <td data-label="Entities">{{ record.entities.map(r => r.name).join(', ') }}</td>
                  <td data-label="Created">
                    <small class="has-text-grey is-abbr-like" :title="toHumanDate(record.createdAt)">{{ toHumanDate(record.createdAt) }}</small>
                  </td>
                  <td data-label="Updated">
                    <small class="has-text-grey is-abbr-like" :title="toHumanDate(record.createdAt)">{{ toHumanDate(record.updatedAt) }}</small>
                  </td>
                  <td class="is-actions-cell">
                    <div class="buttons is-right">
                      <button class="button is-small is-primary" type="button">
                        <span class="icon"><i class="mdi mdi-eye"></i></span>
                      </button>
                      <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                        <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="box">
            <nav class="pagination is-small" role="navigation" aria-label="pagination">
              <a class="pagination-previous">Previous</a>
              <a class="pagination-next">Next page</a>
              <ul class="pagination-list">
                <li><a class="pagination-link" aria-label="Goto page 1">1</a></li>
                <li><span class="pagination-ellipsis">&hellip;</span></li>
                <li><a class="pagination-link" aria-label="Goto page 45">45</a></li>
                <li><a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a></li>
                <li><a class="pagination-link" aria-label="Goto page 47">47</a></li>
                <li><span class="pagination-ellipsis">&hellip;</span></li>
                <li><a class="pagination-link" aria-label="Goto page 86">86</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
</template>