<script setup lang="ts">
import { onMounted } from 'vue';
import { CrudListCell } from '../CRUD';

const props = defineProps<{
  title: string,
  data: any[],
  icon: string,
  columns: any[],
  actions: any[],
  store: any,
  toolbarActions: any,
  hideHeader: boolean,
}>()


onMounted(() => {
    
});

function selectMainId(id: string) {
  props.store.setSelectedDataEntity(id);
}
</script>
<template>
    <div class="card has-table">
        <header class="card-header" v-if="!!!hideHeader">
          <p class="card-header-title">
            <span class="icon"><i :class="'mdi ' + icon"></i></span>
            {{ title }}
          </p>
          <p class="card-header-icon">
            <button
              type="button"
              class="button is-small"
              @click="action.handler()"
              v-for="action in toolbarActions" :key="action.name"
            >
              <span class="icon">
                <i 
                  :class="'mdi ' + action.icon"
                >
              </i>
            </span>
            </button>
          </p>
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
                    
                    <span class="icon-text">
                      
                      <span>{{ col.label }}</span>
                      <span class="icon">
                        <i class="mdi mdi-home"></i>
                      </span>
                      <span class="icon">
                        <i class="mdi mdi-home"></i>
                      </span>
                    </span>
                  </th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr 
                  v-for="record in data" 
                  :key="record.id"
                  @click="selectMainId(record.id)"
                  :class="'clickable' + (record.id === props.store.selectedDataEntity.id ? ' is-selected' : '')"
                >
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
                    <th class="is-actions-cell" >
                        <div class="buttons is-right">
                            <button 
                                class="button is-small is-light" 
                                type="button"
                                v-for="action in actions" :key="action.name"
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
<style scoped>
.clickable {
  cursor: pointer;
}
</style>