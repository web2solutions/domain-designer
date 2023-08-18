<script setup lang="ts">
import { onMounted } from 'vue';
import { CrudListCell } from '../CRUD';

defineProps<{
  data: any[],
  icon: string,
  columns: any[],
  actions: any[]
}>()

onMounted(() => {
    
});
</script>
<template>
    <div class="card has-table">
        <header class="card-header">
          <p class="card-header-title">
            <span class="icon"><i :class="'mdi ' + icon"></i></span>
            Entities
          </p>
          <!-- <a href="#" class="card-header-icon">
            <span class="icon"><i class="mdi mdi-reload"></i></span>
          </a> -->
        </header>
        <div class="card-content" v-if="data.length === 0" >
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>
                  <span class="icon is-large"><i class="mdi mdi-emoticon-sad mdi-48px"></i></span>
                </p>
                <p>Nothing's here…</p></div>
            </section>
        </div>
        <div class="card-content" v-else>
          <div class="b-table has-pagination">
            <div class="table-wrapper has-mobile-cards">
              <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
                <thead>
                <tr>
                  <th></th>
                  <th v-for="col in columns" :key="col.name">
                    {{ col.label }}
                  </th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="record in data" :key="record.id">
                    <td class="is-image-cell">
                        <div class="image">
                          <img :src="`https://avatars.dicebear.com/v2/initials/${record.name}.svg`" class="is-rounded">
                        </div>
                    </td>
                    <CrudListCell
                        v-for="col in columns" :key="col.name"
                        :name="col.name" 
                        :label="col.label" 
                        :type="col.type" 
                        :foreignKey="col.foreignKey || {}"
                        :value="record[col.name]"
                        :col="col"
                        :store="{}"
                        >
                    </CrudListCell>
                    <th class="is-actions-cell" v-for="action in actions" :key="action.name">
                        <div class="buttons is-right">
                            <button 
                                class="button is-small is-light" 
                                type="button"
                                @click="action.handler(record.id)"
                            >
                              <span class="icon"><i :class="`mdi ${action.icon}`"></i></span>
                            </button>
                        </div>
                    </th>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="notification">
              
            </div>
          </div>
        </div>
      </div>
</template>