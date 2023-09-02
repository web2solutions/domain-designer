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
        gridSize: 10,
        drawGrid: {
            name: 'doubleMesh',
            args: [
                { color: 'red', thickness: 1 }, // settings for the primary mesh
                { color: 'green', scaleFactor: 5, thickness: 5 } //settings for the secondary mesh
        ]},
        drawGridSize: 10,
        //background: {
        //  color: 'rgba(0, 255, 0, 0.3)'
        //},
        model: graph,
        defaultLink: () => new joint.shapes.standard.Link({
            attrs: {
                wrapper: {
                    cursor: 'default'
                }
            }
        }),
    });

    const  uml = joint.shapes.uml;

    const  classes: any = { };

    let portsIn = {
      id: '',
      attrs: {
        portBody: {
          magnet: true,
          r: 5,
          fill: '#023047',
          stroke: '#023047',
          x: -5,
          y: -5,
        },
        label: { 
            text: 'port in' 
        }
      },
      markup: [{
        tagName: 'circle',
        selector: 'portBody'
      }]
    };

    let portsOut = {
      id: '',
      attrs: {
        portBody: {
          magnet: true,
          r: 5,
          fill: '#E6A502',
          stroke: '#023047'
        },
        label: { 
            text: 'port out' 
        }
      },
      markup: [{
        tagName: 'circle',
        selector: 'portBody'
      }]
    };

    let x = 10;
    let y = 0;
    const entities = await EntityModel.getAllByFilter('domain_id', domainOverViewStore.selectedDomain);
    const allProperties = await PropertyModel.getAllByFilter('domain_id', domainOverViewStore.selectedDomain);
    for(const entity of entities) {
      const properties = allProperties.filter(p => {
        if(p.entity_id === entity.id) return p
      })
      // console.log(properties)
      const height = properties.map(() => 20).reduce((acc, num) => { return acc + num }, 40);
      portsIn.id = `portIn_${entity.name}`
      portsOut.id = `portOut_${entity.name}`
      classes[entity.name] = new uml.Class({
            position: { x, y },
            size: { width: 260, height },
            name: entity.name,
            attributes: properties.map(property => {
              // console.log(property)
              return `+ ${property.name}: ${property.spec?.format ?  property.spec?.format + '(' + property.spec?.type + ')' : property.spec?.type}`;
            }),
            ports: {
                items: [ portsIn, portsOut ] // add a port in constructor,
            },
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
                    'stroke-width': 0.5,
                },
                '.uml-class-methods-rect': {
                    fill: '#f5f5f5',
                    stroke: '#666',
                    'stroke-width': 0.5,
                },
                '.uml-class-methods-text, .uml-class-attrs-text': {
                    fill: '#fff',
                    color: '#ffffff',
                }
            }
        })
        x += 330
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


    /* var linkAttrs =  {
        'fill': 'none',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        'stroke': '#4b4a67'
    }; */

    // console.log(Object.keys(uml))

    // console.log(classes)

    /* const  relations = [
         new uml.Generalization({ source: { id: classes.man.id }, target: { id: classes.person.id }}),
        new uml.Generalization({ source: { id: classes.woman.id }, target: { id: classes.person.id }}),
        new uml.Implementation({ source: { id: classes.person.id }, target: { id: classes.mammal.id }}),
        new uml.Aggregation({ source: { id: classes.person.id }, target: { id: classes.address.id }}),
        new uml.Composition({ source: { id: classes.person.id }, target: { id: classes.bloodgroup.id }}) 
        new uml.Association({
          source: { id: classes.Product.id },
          target: { id: classes.ProductCategory.id },
          // attrs: { '.connection': linkAttrs }
      }),
    ]; */

    
    
    //const [productPortIn, productPortOut] = classes.Product.getPorts();
    //const [productCategoryPortIn, productCategoryPortOut] = classes.ProductCategory.getPorts();
    //console.log(classes.Product.getPorts(), productPortIn)
    //console.log(classes.ProductCategory.getPorts(), productCategoryPortOut)

    // console.log('xxxxxxxxxx', productPortIn.get('position'))
    // element.getPorts()[0].id
    // const link = new joint.shapes.standard.Link();
    // link.set('source', { id: classes.Product.id });
    // link.set('target', { id: classes.ProductCategory.id });
    // link.source(classes.Product.getPorts()[1]);
    //link.target(classes.ProductCategory);
    // link.addTo(graph);


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
      <div class="card-content gridbgd">
        <div id="paper">
          
        </div>
      </div>
    </div>
</template>
<style scoped>
.paper{
  width: 100%;
}
.gridbgd{
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJ2LTEzIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGVmcyBpZD0idi0xMiI+PHBhdHRlcm4gaWQ9InBhdHRlcm5fMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48cmVjdCBpZD0idi0xNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI0FBQUFBQSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgaWQ9InYtMTYiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl8wKSIvPjwvc3ZnPg==");
  overflow: hidden;
}
.v-line { 
  font-size: 14px;
  font-family: Nunito;
  color: #fff;
}
</style>
