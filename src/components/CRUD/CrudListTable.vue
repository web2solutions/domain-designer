
<script setup lang="ts">
import { CrudListHead, CrudListBody } from './';

const props = defineProps<{
  store: any,
}>()
</script>
<template>
    <div class="b-table has-pagination">
        <div class="table-wrapper has-mobile-cards">
          <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
            <CrudListHead :store="store" />
            <CrudListBody :store="store" />
          </table>
        </div>
        <div class="box">
          <!-- <nav class="pagination is-small" role="navigation" aria-label="pagination">
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
          </nav> -->
        </div>
      </div>
</template>