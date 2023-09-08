<script setup lang="ts">
import { OpenAPIV3 } from "openapi-types";
import YAML from 'yaml';
import { onMounted, ref, watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import { openapiSchemaToJsonSchema }  from '@openapi-contrib/openapi-schema-to-json-schema';
import { default as SchemaOverviewHeader } from './SchemaOverviewHeader.vue'
import { useSchemasStore } from '@/stores';

const schemaStore = useSchemasStore();
const route = useRoute();
const id = route.params.id ? route.params.id.toString() : undefined;

const domainSpec = ref(YAML.stringify({}));
const showOverAll = ref('list');
const showForm = ref(true);
const jsonSchema = ref({});


function editProperty (propertyName: string, event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const spec: OpenAPIV3.SchemaObject = schemaStore.record.spec as OpenAPIV3.SchemaObject;
  if(spec.properties) { 
    console.log(propertyName, spec.properties[propertyName])
  } else {
    throw new Error('not implemented')
  }
}


function selectOverAllTab (value: string) {
  showOverAll.value = value;
}

watch(showOverAll, (value: string) => {
  destroyGraph();
  showForm.value = false;
  if(value === 'visual') {
   setTimeout( async () => {
    await buildGraph();
   }, 100 );
  } else if(value === 'OAS') {
    buildOAS();
  } else if(value === 'json') {
    setTimeout( () => {
      buildJsonViewer();
    }, 100 );
  } else if (value === 'list') {
    showForm.value = true;
  }
});


function buildJsonViewer() {
  const json: any = {
    [`${schemaStore.record.name}`]: schemaStore.record.spec,
  };
  console.log(openapiSchemaToJsonSchema(json));
  jsonSchema.value = openapiSchemaToJsonSchema(json);
}

function buildOAS (){
  domainSpec.value = YAML.stringify({
    [`${schemaStore.record.name}`]: schemaStore.record.spec,
  } as any);
}

function destroyGraph(): void {
  if(document.getElementById('paper')) (document.getElementById('paper') as HTMLElement).innerHTML = '';
}

async function buildGraph() {
  
  const graph = new joint.dia.Graph();
  const  wrapper = document.getElementById('gridbgd') as HTMLElement;
  const style = window.getComputedStyle(wrapper);
  const width = (style.getPropertyValue("width") as string).replace(/px/, '');
  const height = (style.getPropertyValue("height") as string).replace(/px/, '');

  const paper = new joint.dia.Paper({
    el: document.getElementById('paper'),
    width: +(width) - 50,
    height: +(height) - 50,
    gridSize: 10,
    drawGrid: {
      name: 'doubleMesh',
      args: [{
          color: 'red',
          thickness: 1
        }, // settings for the primary mesh
        {
          color: 'green',
          scaleFactor: 5,
          thickness: 5
        } //settings for the secondary mesh
      ]
    },
    drawGridSize: 10,
    //background: {
    //  color: 'rgba(0, 255, 0, 0.3)'
    //},
    model: graph,
  });

  const uml = joint.shapes.uml;


  let x = 10;
  let y = 0;
  const props = (schemaStore.record.spec as OpenAPIV3.SchemaObject).properties;
  const properties = Object.keys(props as Record<string, any>);
  // console.log(properties)
  const heightBox = properties.map(() => 20).reduce((acc, num) => {
    return acc + num
  }, 40);

  const schemaUML = new uml.Class({
    position: {
      x,
      y
    },
    size: {
      width: 260,
      height: heightBox,
    },
    name: schemaStore.record.name,
    attributes: properties.map((propertyName: string) => {
      console.log({...schemaStore.record.spec}, propertyName)
      const property = (schemaStore.record.spec as any).properties[propertyName]
      
      return `+ ${propertyName}: ${property.format ?  property.format + '(' + property.type + ')' : property.type} ${property.enum ? ' \n -> enum [' + (property.enum.join(', ')) +']' : ''}`;
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
        'stroke-width': 0.5,
      },
      '.uml-class-methods-rect': {
        // fill: '#f5f5f5',
        // stroke: '#f5f5f5',
        'stroke-width': 0,
      },
      '.uml-class-methods-text, .uml-class-attrs-text': {
        fill: '#fff',
        color: '#ffffff',
      }
    }
  })


  graph.addCell(schemaUML);
  schemaUML.on('change:position', function (a: any) {
    console.log('a', a)
    //  a.attributes.name
    console.log(schemaUML.get('position'))
    paper.fitToContent();
  });

}

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()

onMounted(async () => {
  if (id) {
    const record = await schemaStore.getRecord(id as string);
    console.log(record);
  }
});


</script>

<template>
    <SchemaOverviewHeader :store="schemaStore" :appName="childName" :icon="icon" />
    <div class="columns">
      <div class="column">
        <div class="block">
          <!-- -->
          <div class="tabs is-toggle is-fullwidth">
            <ul>
              <li 
                :class="showOverAll === 'list' ? 'is-active' : ''"
                @click="selectOverAllTab('list')"
              >
                <a>
                  <span class="icon is-small"><i class="mdi mdi-cog"></i></span>
                  Schema properties
                </a>
              </li>
              <li 
                :class="showOverAll === 'visual' ? 'is-active' : ''"
                @click="selectOverAllTab('visual')"
              >
                <a>
                  <span class="icon is-small"><i class="mdi mdi-set-none"></i></span>
                  Visual
                </a>
              </li>
              <li
                :class="showOverAll === 'OAS' ? 'is-active' : ''"
                @click="selectOverAllTab('OAS')"
              >
                <a>
                  <span class="icon is-small"><i class="mdi mdi-api" aria-hidden="true"></i></span>
                  <span>OAS</span>
                </a>
              </li>
              <li
                :class="showOverAll === 'json' ? 'is-active' : ''"
                @click="selectOverAllTab('json')"
              >
                <a>
                  <span class="icon is-small"><i class="mdi mdi-code-braces-box" aria-hidden="true"></i></span>
                  <span>JSON Schema</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="card" v-if="showOverAll === 'visual'">
            <div class="card-content gridbgd" id="gridbgd">
              <div id="paper">
                
              </div>
            </div>
          </div>
          <div class="card" v-if="showOverAll === 'OAS'">
            <highlightjs
              language="yaml"
                :code="domainSpec"
            />
          </div>
          <div class="card" v-if="showOverAll === 'json'">
            <json-viewer :value="jsonSchema"  :expand-depth="10" :copyable="true"></json-viewer>
          </div>
          <div class="card has-table" v-if="showOverAll === 'list'">
            <div class="card-content">
              <div class="b-table has-pagination">
                <div class="table-wrapper has-mobile-cards">
                  <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
                    <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Example</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                      <template v-if="schemaStore.record.spec">
                        <template v-if="(schemaStore.record.spec as OpenAPIV3.SchemaObject).properties">
                          <template v-for="propertyName in Object.keys((schemaStore.record.spec as OpenAPIV3.SchemaObject).properties || {})" :key="propertyName">
                            <tr >
                              <td class="is-image-cell">
                                <div class="image">
                                  <img :src="`https://avatars.dicebear.com/v2/initials/${propertyName}.svg`" class="is-rounded">
                                </div>
                              </td>
                              <td data-label="Name">{{ propertyName }}</td>
                              <td data-label="Type">{{ (((schemaStore.record.spec as  OpenAPIV3.SchemaObject).properties || {})[propertyName] as OpenAPIV3.SchemaObject).type ||  (schemaStore.record.spec as any).properties[propertyName].$ref + ' component'}}</td>
                              <td data-label="Example">{{ (((schemaStore.record.spec as OpenAPIV3.SchemaObject).properties || {})[propertyName] as OpenAPIV3.SchemaObject).example || '' }}</td>
                              <th class="is-actions-cell" >
                                <div class="buttons is-right">
                                    <button 
                                        class="button is-small is-light" 
                                        type="button"
                                        @click="editProperty(propertyName, $event)"
                                    >
                                        <span class="icon"><i class="mdi mdi-eye"></i></span>
                                    </button>
                                </div>
                              </th>
                            </tr>
                          </template>
                        </template>
                      </template>
                    </tbody>
                  </table>
                </div>
                <div class="notification">
                  
                </div>
              </div>
            </div>
          </div>
          <!-- -->
        </div>
      </div>
      <div class="column" v-if="showForm">
        <div class="block">
          <div class="card">
            xxxxxx
          </div>
        </div>
      </div>
    </div>
</template>
<style scope>
.padding{
  padding-top: 80px;
  padding-bottom: 40px;
}
.paper{
  width: 100%;
  overflow: auto;
}
.gridbgd{
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJ2LTEzIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGVmcyBpZD0idi0xMiI+PHBhdHRlcm4gaWQ9InBhdHRlcm5fMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48cmVjdCBpZD0idi0xNCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI0FBQUFBQSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgaWQ9InYtMTYiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl8wKSIvPjwvc3ZnPg==");
  overflow: auto;
  height: 50vh;
}
.v-line { 
  font-size: 14px;
  font-family: Nunito;
  color: #fff;
}
#editor { 
  height: 95%;
  left: 3px;
  right: 5px;
  top: -10px;
}
.ide{
  height: 68vh; 
  overflow: hidden;
  z-index: 1;
}
</style>