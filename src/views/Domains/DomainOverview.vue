<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import YAML from 'yaml'
import router from '@/router';
import { default as EntityPanel } from '@/components/Domain/EntityPanel.vue';
import { default as DomainOverviewHeader } from './DomainOverviewHeader.vue'
import {  default as  PropertyPanel } from "../../components/Domain/PropertyPanel.vue";
import { useDomainsStore, useEntitiesStore, useDomainOverviewStore } from '@/stores';
import type { IGridColumn } from '@/components/IGridColumn';
import { EntityModel } from '../../models/EntityModel';
import { PropertyModel } from '../../models/PropertyModel';

const domainStore = useDomainsStore();
const entityStore = useEntitiesStore();
const domainOverViewStore = useDomainOverviewStore();

const { reDrawGraph } = storeToRefs(domainOverViewStore)

const route = useRoute();
domainOverViewStore.setSelectedDomain((route.params.id as string) || '');

const emptyColumns: IGridColumn[] = [];
const entitiesColumns = ref(emptyColumns);

const domainSpec = ref(YAML.stringify({}))

async function buildDomainSpec() {
  let spec: Record<string, any> = {
    definitions: {}
  }
  const entities = await EntityModel.getAllByFilter('domain_id', domainOverViewStore.selectedDomain);
  for(const entity of entities) {
    spec.definitions[entity.name] = {
      required: [],
      properties: { }
    }
    const properties = await PropertyModel.getAllByFilter('entity_id', entity.id);
    for(const property of properties) {
      spec.definitions[entity.name].properties[property.name] = { ...property.spec, description: property.description || '' }
    }
  }
  console.log(spec)
  domainSpec.value = YAML.stringify(spec);
  visualDomainPanelLoading.value = false;
  return spec;
}

const visualDomainPanelLoading = ref(true)
const showOverAll = ref('visual')


async function selectOverAllTab (tabId: string) {
  showOverAll.value = tabId;
  visualDomainPanelLoading.value = true;
  if (tabId === 'visual') {
    setTimeout(async () => {
      
      destroyGraph();
      await buildGraph();
    }, 1000)
  } else {
    await buildDomainSpec();
  }
}


const actionsEntity = ref([
  {
    name: 'edit entity',
    icon: 'mdi-pencil',
    handler: async (id: string, event: Event) => {
      event.stopPropagation();
      event.preventDefault();
      domainOverViewStore.entityFormMode = 'update';
      await domainOverViewStore.setSelectedDataEntity(id);
      // domainOverViewStore.selectedDataEntity = await EntityModel.get(id);
      // domainOverViewStore.entities = await EntityModel.getAllByFilter('domain_id', domainOverViewStore.selectedDomain);
      domainOverViewStore.panelEntitySelected = 'form';
      domainOverViewStore.entityFormTitle = 'Edit data entity';
    },
  },
  {
    name: 'remove entity',
    icon: 'mdi-close',
    handler: async (id: string) => {
      const removed = await entityStore.remove(id);
      if (!removed) return;
      console.log(domainOverViewStore.entities)
      domainOverViewStore.entities = domainOverViewStore.entities.filter((record: any) => {
        return record.id !== id
      });


      // reset property panel
      destroyGraph();
      visualDomainPanelLoading.value = true;
      await buildGraph();
    },
  }
]);


function destroyGraph(): void {
  (document.getElementById('paper') as HTMLElement).innerHTML = '';
}

async function buildGraph() {
  // visualDomainPanelLoading.value = true;
  const  graph = new joint.dia.Graph();
    const wrapperHeight = 200;
    
    const paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        width: +((window.getComputedStyle(document.getElementById('paper')?.parentElement as HTMLElement).getPropertyValue("width") as string).replace(/px/, '')) - 30,
        height: wrapperHeight,
        gridSize: 1,
        model: graph
    });

    const  uml = joint.shapes.uml;

    const  classes: any = { };

    let x = 0;
    let y = 0;
    const entities = await EntityModel.getAllByFilter('domain_id', domainOverViewStore.selectedDomain);
    const allProperties = await PropertyModel.getAllByFilter('domain_id', domainOverViewStore.selectedDomain);
    for(const entity of entities) {
      const properties = allProperties.filter(p => {
        if(p.entity_id === entity.id) return p
      })
      // console.log(properties)
      const height = properties.map(() => 20).reduce((acc, num) => { return acc + num }, 40);
      classes[entity.name] = new uml.Class({
            position: { x, y },
            size: { width: 260, height },
            name: entity.name,
            attributes: properties.map(property => {
              // console.log(property)
              return `+ ${property.name}: ${property.spec?.format ?  property.spec?.format + '(' + property.spec?.type + ')' : property.spec?.type}`;
            }),
            methods: [],
            attrs: {
                '.uml-class-name-rect': {
                    fill: '#485fc7',
                    stroke: '#666',
                    color: '#ffffff',
                    'stroke-width': 0.5,
                },
                '.uml-class-attrs-rect': {
                    fill: '#f5f5f5',
                    stroke: '#666',
                    'stroke-width': 0.5
                },
                '.uml-class-methods-rect': {
                    fill: '#f5f5f5',
                    stroke: '#666',
                    'stroke-width': 0.5
                },
                '.uml-class-methods-text, .uml-class-attrs-text': {
                    fill: '#fff',
                    color: '#ffffff'
                }
            }
        })
        x += 300
    }

    Object.keys(classes).forEach(function(key) {
        graph.addCell(classes[key]);
    });
    Object.keys(classes).forEach(function(key) {
      classes[key].on('change:position', function(a: any) {
        console.log('a', a)
       //  a.attributes.name
        console.log(classes[key].get('position'))
        paper.fitToContent();
      });
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
    


    // console.log(Object.keys(classes.Supplier),classes.Supplier)
    visualDomainPanelLoading.value = false;
}

watch(reDrawGraph, () => {
  destroyGraph();
  visualDomainPanelLoading.value = true;
  buildGraph();
});

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
    if (domainOverViewStore.selectedDomain !== '') {
      entitiesColumns.value = entityStore.columns.filter((c:IGridColumn) => {
        if(!c.foreignKey && c.name !== 'createdAt' && c.name !== 'updatedAt') return c;
      }) as IGridColumn[];

      domainOverViewStore.entities = await domainStore.getEntities(domainOverViewStore.selectedDomain);
      visualDomainPanelLoading.value = true;
      await buildGraph();

      // await buildDomainSpec();
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
        <EntityPanel
          key="entities" 
          title="Data Entities"
          :store="domainOverViewStore"
          :columns="entitiesColumns" 
          :data="domainOverViewStore.entities" 
          :icon="'mdi-alpha-e-box'" 
          :actions="actionsEntity"
        />
      </div>
      <div class="column" v-if="domainOverViewStore.selectedDataEntity.id">
        <PropertyPanel :icon="icon" />
      </div>
    </div>
    <div class="tabs is-toggle is-fullwidth">
      <ul>
        <li 
          :class="showOverAll === 'visual' ? 'is-active' : ''"
          @click="selectOverAllTab('visual')"
        >
          <a>
            <span class="icon is-small"><i class="mdi mdi-set-none"></i></span>
            Domain visual representation
          </a>
        </li>
        <li
          :class="showOverAll === 'OAS' ? 'is-active' : ''"
          @click="selectOverAllTab('OAS')"
        >
          <a>
            <span class="icon is-small"><i class="mdi mdi-api" aria-hidden="true"></i></span>
            <span>Open API Specification</span>
          </a>
        </li>
      </ul>
    </div>
    <progress  v-if="visualDomainPanelLoading" class="progress is-small is-light" max="100">15%</progress>
    <div class="box" v-if="showOverAll === 'OAS'">
      <highlightjs
        language="yaml"
          :code="domainSpec"
      />
    </div>
    <div class="card" v-if="showOverAll === 'visual'">
      <div class="card-content">
        <div id="paper">
          
        </div>
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
  color: #fff;
}
</style>
