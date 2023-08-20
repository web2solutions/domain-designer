<script setup lang="ts">
/*global $*/
import { onMounted, ref, onUnmounted } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import router from '@/router';
import { DynamicTable } from '@/components/DynamicTable/';
import { default as DomainOverviewHeader } from './DomainOverviewHeader.vue'
import {  default as  PropertyPanel } from "../../components/Domain/PropertyPanel.vue";
import { useDomainsStore, useEntitiesStore, useDomainOverviewStore } from '@/stores';
import type { IGridColumn } from '@/components/IGridColumn';


const domainStore = useDomainsStore();
const entityStore = useEntitiesStore();
const domainOverViewStore = useDomainOverviewStore();

const route = useRoute();
const id = route.params.id ? route.params.id.toString() : undefined;

const emptyColumns: IGridColumn[] = [];
const entitiesColumns = ref(emptyColumns);

const actionsEntity = ref([
  {
    name: 'edit entity',
    icon: 'mdi-pencil',
    handler: (id: string) => {
      router.push(`/entities/update/${id}`);
    },
  },
  {
    name: 'remove entity',
    icon: 'mdi-close',
    handler: async (id: string) => {
      await entityStore.remove(id);
      console.log(domainOverViewStore.entities)
      domainOverViewStore.entities = domainOverViewStore.entities.filter((record: any) => {
        return record.id !== id
      });
      destroyGraph();
      await buildGraph();
    },
  }
]);



const toolbarActionsEntity = ref([
  {
    name: 'add entity',
    icon: 'mdi-plus-circle',
    handler: () => {
      router.push({
        path: `/entities/create`,
        query: { onDomain: route.params.id }
      });
    },
  },
]);



function destroyGraph(): void {
  (document.getElementById('paper') as HTMLElement).innerHTML = '';
}

async function buildGraph() {
  const  graph = new joint.dia.Graph();
    const wrapperHeight = 200;
    
    new joint.dia.Paper({
        el: document.getElementById('paper'),
        width: window.getComputedStyle(document.getElementById('paper')?.parentElement as HTMLElement).getPropertyValue("width") - 30,
        height: wrapperHeight,
        gridSize: 1,
        model: graph
    });

    const  uml = joint.shapes.uml;

    const  classes: any = { };

    let x = 0;
    let y = 0;
    for(const entity of domainOverViewStore.entities) {
      await domainOverViewStore.setSelectedDataEntity(entity.id)
      const height = domainOverViewStore.properties.map(property => 20).reduce((acc, num) => { return acc + num }, 40);
      classes[entity.name] = new uml.Class({
            position: { x, y },
            size: { width: 260, height },
            name: entity.name,
            attributes: domainOverViewStore.properties.map(property => {
              return property.name;
            }),
            methods: [],
            attrs: {
                '.uml-class-name-rect': {
                    fill: '#cfcece',
                    stroke: '#ffffff',
                    'stroke-width': 0.5,
                },
                '.uml-class-attrs-rect': {
                    fill: '#fafafa',
                    stroke: '#fff',
                    'stroke-width': 0.5
                },
                '.uml-class-methods-rect': {
                    fill: '#fafafa',
                    stroke: '#fff',
                    'stroke-width': 0.5
                },
                '.uml-class-methods-text, .uml-class-attrs-text': {
                    fill: '#fff'
                }
            }
        })
        x += 300
    }

    Object.keys(classes).forEach(function(key) {
        graph.addCell(classes[key]);
    });

    /* const  relations = [
        new uml.Generalization({ source: { id: classes.man.id }, target: { id: classes.person.id }}),
        new uml.Generalization({ source: { id: classes.woman.id }, target: { id: classes.person.id }}),
        new uml.Implementation({ source: { id: classes.person.id }, target: { id: classes.mammal.id }}),
        new uml.Aggregation({ source: { id: classes.person.id }, target: { id: classes.address.id }}),
        new uml.Composition({ source: { id: classes.person.id }, target: { id: classes.bloodgroup.id }})
    ];

    Object.keys(relations).forEach(function(key) {
        graph.addCell(relations[key]);
    });*/
}

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()

onUnmounted(() => {
  domainOverViewStore.$reset();
});

onMounted(async () => {
  // console.log(domainOverViewStore.entities)
  try {
    if (id) {
      const record = await domainStore.getRecord(id as string);
      console.log(record);

      entitiesColumns.value = entityStore.columns.filter((c:IGridColumn) => {
        if(!c.foreignKey && c.name !== 'createdAt' && c.name !== 'updatedAt') return c;
      }) as IGridColumn[];

      domainOverViewStore.entities = await domainStore.getEntities(id);
      await buildGraph();
    }
  } catch (error) {
   console.log(error)
  }
});
</script>
<template>
    <DomainOverviewHeader :store="domainStore" :entities="domainOverViewStore.entities" :appName="childName" :icon="icon" />
    
    <div class="columns">
      <div class="column">
        <DynamicTable
          key="entities" 
          title="Data Entities"
          :store="domainOverViewStore"
          :columns="entitiesColumns" 
          :data="domainOverViewStore.entities" 
          :icon="'mdi-alpha-e-box'" 
          :actions="actionsEntity"
          :toolbarActions="toolbarActionsEntity"
          :hideHeader="false"
        />
      </div>
      <div class="column">
        <PropertyPanel :key="domainOverViewStore.selectedDataEntity" :icon="icon" />
      </div>
    </div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <span class="icon"><i :class="'mdi ' + icon"></i></span>
          Domain visual representation
        </p>
        <!-- <a href="#" class="card-header-icon">
          <span class="icon"><i class="mdi mdi-reload"></i></span>
        </a> -->
      </header>
      <div class="card-content">
        <div id="paper"></div>
      </div>
    </div>
</template>
<style>
.paper{
  width: 100%;
}
.v-line { 
  font-size: 14px;
  font-family: Nunito;
}
</style>
