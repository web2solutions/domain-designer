
<script setup lang="ts">
import { useRoute } from 'vue-router';
import router from '@/router';
import type { LocationQueryRaw } from 'vue-router';
import { CrudListHead, CrudListBody } from './';
import type { IQueryRequest } from '@/stores/IQueryRequest'; 

const props = defineProps<{
  store: any,
}>()

const route = useRoute();

function onChangePageSize (size: number) {
    // const id = route.params.id ? route.params.id.toString() : undefined;
    const previousPage = +(route.query.page || props.store.page || 1);
    // const previousFilter = route.query.filter || {};
    const query: IQueryRequest = {
        size,
    };
    // if (previousFilter) query.filters = previousFilter
    if (previousPage) query.page = previousPage;
    console.log('onChangePageSize', query)
    router.push({ path: '/domains/list', query: query as LocationQueryRaw })
}

function onChangePageNumber (page: number) {
    
    const previousSize = +(route.query.size || props.store.pageSize || 30);
    // console.log({ page, previousSize })
    // const previousFilter = route.query.filter || {};
    const query: IQueryRequest = {
        page,
    };
    // if (previousFilter) query.filters = previousFilter
    if (previousSize) query.size = previousSize;
    console.log('onChangePageNumber', query)
    props.store.changePage(page)
    router.push({ path: '/domains/list', query: query as LocationQueryRaw })
}
</script>
<template>
    <div class="b-table has-pagination">
        <div class="table-wrapper has-mobile-cards">
          <template v-if="store.records.length === 0">
            <div class="notification is-light">
              <div class="level">
                <div class="level-left">
                  <div class="level-item">
                    <div>
                      <b>No records ...</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
              <CrudListHead :store="store" />
              <CrudListBody :store="store" />
            </table>
          </template>
        </div>
        <div class="box">
          <nav class="pagination is-small" role="navigation" aria-label="pagination">
            <a v-if="store.page > 1" class="pagination-previous">Previous</a>
            <a class="pagination-next">Next page</a>
            <ul class="pagination-list">
              <li
                v-for="page in store.pageTotalRecords"
                :key="page"
              >
                <button 
                  v-if="store.page === page"
                  class="pagination-link  is-current" 
                  aria-current="page"
                  :aria-label="'Goto page '+ page"
                  @click="onChangePageNumber(page);"
                >
                  {{ page }}
                </button>
                <button 
                  class="pagination-link" 
                  :aria-label="'Goto page '+ page"
                  @click="onChangePageNumber(page);"
                  v-else
                >
                  {{ page }}
                </button>
              </li>
            </ul>
            <ul class="pagination-list">
              <li
                v-for="size in store.pageSizes"
                :key="size"
              >
                <button 
                  :class="'pagination-link' + (store.pageSize === size ? ' is-current': '') " 
                  :aria-label="'Page size ' + size"
                  @click="onChangePageSize(size);"
                >
                  {{ size }}
                </button>
              </li>
              <li>show {{store.pageSize}} records per page</li>
            </ul>
          </nav>
          
        </div>
      </div>
</template>
<style scoped>
.boxprogress{
  width: 100%;
}
</style>