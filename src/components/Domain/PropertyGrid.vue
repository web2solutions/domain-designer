<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CrudListCell } from '../CRUD';

import { useDomainOverviewStore } from '@/stores';

const store = useDomainOverviewStore();

const props = defineProps<{
  title: string,
  data: any[],
  icon: string,
  columns: any[],
  actions: any[],
}>()


onMounted(() => {
    
});

const showSpec = ref(false)

async function preview(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    await store.setSelectedProperty(id);
    showSpec.value = !showSpec.value;
}

function selectMainId(id: string) {
  store.setSelectedProperty(id);
  showSpec.value = false;
}
</script>
<template>
    <div class="card has-table">
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
                    </span>
                  </th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <template
                  v-for="record in data" 
                  :key="record.id"
                >
                  <tr 
                      
                    @click="selectMainId(record.id)"
                    :class="'clickable' + (record.id === store.selectedProperty?.id ? ' is-selected' : '')"
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
                          :maxLenght="20"
                          >
                      </CrudListCell>
                      <th class="is-actions-cell" >
                          <div class="buttons is-right">
                              <button 
                                  class="button is-small is-light" 
                                  type="button"
                                  @click="preview(record.id, $event)"
                              >
                                  <span class="icon"><i class="mdi mdi-eye"></i></span>
                              </button>
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
                  <tr v-if="record.id === store.selectedProperty?.id && showSpec">
                    <td colspan="5">
                      <json-viewer :value="{ ...record.spec, description: record.description || '' }" :boxed="true" :copyable="true"></json-viewer>
                    </td>
                  </tr>
                </template>
                
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

.jsonView{
  margin-left: 20px;
  font-family: Nunito;
  font-size: 13px;
  line-height: 13px;
  padding: 2px;
  cursor: default;
  color: rgb(66, 66, 66);
  white-space: nowrap;
  -webkit-user-select: none;
}

.jsonView>div{
  display: inline-block;
}

.jsonView>.children, .jsonView.insert{
  display: block;
}

.jsonView>.name{
  color: rgb(136, 19, 145);
}

.jsonView>.separator:before{
  content: ":";
}

.jsonView>.separator {
  padding-right: 5px;
}

.jsonView>.value.null{
  color: rgb(128, 128, 128);
}

.jsonView>.value.boolean, .jsonView>.value.number{
  color: rgb(28, 0, 207);
}

.jsonView>.value.string:not(.edit):before, .jsonView>.value.string:not(.edit):after{
  content: "\"";
}

.jsonView>.value.string {
  color: rgb(196, 26, 22);
}

.jsonView>.name:hover, .jsonView>.value:hover{
  background-color: rgba(56, 121, 217, 0.1);
}

.jsonView>.expand, .jsonView>.collapse{
  min-width: 20px;
  margin-left: -20px;
  cursor: pointer;
}

.jsonView>.expand:before{
  content: '\25B6';
}

.jsonView>.collapse:before{
  content: '\25BC';
}

.jsonView>.edit{
  padding: 0px 5px 0px 5px;
  white-space: nowrap;
  overflow: hidden;
  background-color: transparent;
}

.jsonView>.edit br{
  display: none;
}

.jsonView>.edit *{
  display: inline;
  white-space: nowrap;
}

.jsonView>.value.edit{
  color: rgb(0, 0, 0);
}

.jsonView>.delete:before{
  content: 'X';
}

.jsonView>.delete{
  opacity: 0;
  display: inline;
  padding: 3px;
  margin-left: 20px;
  cursor: pointer;
  color: rgb(150, 150, 150);
}

.jsonView>.delete:hover{
  opacity: 1;
  color: rgb(0, 0, 0);
  background: rgb(220, 220, 220);
}

.jsonView>.insert:before{
  content: '+';
}

.jsonView>.insert{
  display: none;
  color: rgb(150, 150, 150);
  cursor: pointer;
}

.jsonView.expanded>.insert, .jsonView.expanded>.insert{
  display: inline-block;
  margin-left: 20px;
  padding: 3px;
}

.jsonView>.insert:hover{
  color: rgb(0, 0, 0);
  background: rgb(220, 220, 220);
}
</style>