<script setup lang="ts">
import { OpenAPIV3 } from "openapi-types";
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { RouteRecordName } from 'vue-router';
import { BreadCrumbMain } from '@/components/Application/index';
// import { formatCurrency } from '@/components/CRUD/utils';

import { useDomainsStore, useLanguageStore, useEntitiesStore, usePropertiesStore, useSchemasStore } from '@/stores';
import { SchemaModel } from '@/models/SchemaModel';
import { EntityModel } from '@/models/EntityModel';
import { PropertyModel } from '@/models/PropertyModel';

const languageStore: any = useLanguageStore();
const domainStore = useDomainsStore();
const entityStore = useEntitiesStore();
const schemaStore = useSchemasStore();
const propertyStore = usePropertiesStore();

const visualDomainPanelLoading = ref(true)

function destroyGraph(): void {
  (document.getElementById('paper') as HTMLElement).innerHTML = '';
}

let domainStoreRef = storeToRefs(domainStore);
let entityStoreRef = storeToRefs(entityStore);
let propertyStoreRef = storeToRefs(propertyStore);

/* watch(domainStoreRef.records, async () => {
  console.log('lololololololol')
  destroyGraph();
  await buildGraph();
});

watch(entityStoreRef.records, async () => {
  console.log('lololololololol')
  destroyGraph();
  await buildGraph();
});

watch(propertyStoreRef.records, async () => {
  console.log('lololololololol')
  destroyGraph();
  await buildGraph();
}); */

async function buildGraph() {
  // visualDomainPanelLoading.value = true;
  const  graph = new joint.dia.Graph();
    const wrapperHeight = 200;
    
    const paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        width: +((window.getComputedStyle(document.getElementById('paper')?.parentElement as HTMLElement).getPropertyValue("width") as string).replace(/px/, '')) - 30,
        height: +((window.getComputedStyle(document.getElementById('paper')?.parentElement as HTMLElement).getPropertyValue("height") as string).replace(/px/, '')) - 30,
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



    let x = 10;
    let y = 0;
    const entities = (await EntityModel.getEntireCollection()).sort(function (a, b): number {
      // console.log(a.id, b.id)
      if(a.domain_id && b.domain_id) {
        if(a.domain_id < b.domain_id) {
          return 1;
        } else if(a.id === b.id) {
          return 0;
        } else {
          return -1
        }
      }
      return -1
    });
    const allProperties = await PropertyModel.getEntireCollection();
    let placedItems = 0;
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
                    fill: '#3e8ed0',
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
        placedItems += 1;

        
        x += 330

        if( (placedItems % 4) === 0) {
          y += 250;
          x = 10
        }
    }
    const schemas = await SchemaModel.getEntireCollection();
    
    for(const schema of schemas) {
      
      const props = (schema.spec as OpenAPIV3.SchemaObject).properties || {};
      console.log(schema.name, props)
      const properties = Object.keys(props as Record<string, any>) || [];
      const heightBox = properties.map(() => 20).reduce((acc, num) => {
        return acc + num
      }, 40);
      classes['schema_' + schema.name] = new uml.Class({
        position: {
          x,
          y
        },
        size: {
          width: 260,
          height: heightBox
        },
        name: schema.name,
        attributes: properties.map((propertyName: string) => {
          // console.log({...schemaStore.record.spec}, propertyName)
          const property: OpenAPIV3.SchemaObject = props[propertyName] as OpenAPIV3.SchemaObject;
          
          return `+ ${propertyName}: ${property.format ?  property.format + '(' + property.type + ')' : property.type ? property.type : property.$ref.split('/')[3]} ${property.enum ? ' \n -> enum [' + (property.enum.join(', ')) +']' : ''}`;
        }),
        methods: [],
        attrs: {
          '.uml-class-name-rect': {
            fill: '#48c78e',
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

      placedItems += 1;

        
      x += 330

      if( (placedItems % 4) === 0) {
        y += 250;
        x = 10
      }
    }

    Object.keys(classes).forEach(function(key) {
        graph.addCell(classes[key]);
    });

    paper.fitToContent();

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


defineProps<{
  moduleName: RouteRecordName | null | undefined,
  icon: string,
}>()

onMounted(async() => {

  await domainStore.sync();
  await entityStore.sync()
  await propertyStore.sync();
  await schemaStore.sync();

  await buildGraph();
});
</script>

<template>
      <BreadCrumbMain v-bind:moduleName="moduleName" childName="" />
      <section class="section is-main-section">
        <div class="padding">
          <div class="tile is-ancestor">
            <div class="tile is-parent">
              <div class="card tile is-child">
                <div class="card-content">
                  <div class="level is-mobile">
                    <div class="level-item">
                      <div class="is-widget-label"><h3 class="subtitle is-spaced">
                        {{ languageStore.default.dashboard.Domains }}
                      </h3>
                        <h1 class="title">
                          {{ domainStore.total }}
                        </h1>
                      </div>
                    </div>
                    <div class="level-item has-widget-icon">
                      <div class="is-widget-icon"><span class="icon has-text-primary is-large"><i
                          class="mdi mdi-group mdi-48px"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tile is-parent">
              <div class="card tile is-child">
                <div class="card-content">
                  <div class="level is-mobile">
                    <div class="level-item">
                      <div class="is-widget-label">
                        <h3 class="subtitle is-spaced">
                          {{ languageStore.default.dashboard.DataEntities }}
                        </h3>
                        <!-- <h1 class="title">
                          
                          {{ formatCurrency(7770) }}
                        </h1> -->
                        <h1 class="title">
                          
                          {{ entityStore.total }}
                        </h1>
                      </div>
                    </div>
                    <div class="level-item has-widget-icon">
                      <div class="is-widget-icon"><span class="icon has-text-info is-large"><i
                          class="mdi mdi-database mdi-48px"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tile is-parent">
              <div class="card tile is-child">
                <div class="card-content">
                  <div class="level is-mobile">
                    <div class="level-item">
                      <div class="is-widget-label"><h3 class="subtitle is-spaced">
                        {{ languageStore.default.dashboard.ValueObjects }}
                      </h3>
                        <h1 class="title">
                          {{ propertyStore.total }}
                        </h1>
                      </div>
                    </div>
                    <div class="level-item has-widget-icon">
                      <div class="is-widget-icon"><span class="icon has-text-success is-large"><i
                          class="mdi mdi-book-information-variant mdi-48px"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tile is-parent">
              <div class="card tile is-child">
                <div class="card-content">
                  <div class="level is-mobile">
                    <div class="level-item">
                      <div class="is-widget-label"><h3 class="subtitle is-spaced">
                        {{ languageStore.default.dashboard.SchemasComponents }}
                      </h3>
                        <h1 class="title">
                          {{ schemaStore.total }}
                        </h1>
                      </div>
                    </div>
                    <div class="level-item has-widget-icon">
                      <div class="is-widget-icon"><span class="icon has-text-primary is-large"><i
                          class="mdi mdi-group mdi-48px"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                <span class="icon"><i class="mdi mdi-set-none"></i></span>
                {{ languageStore.default.dashboard.ApplicationComponents }}
              </p>
              <a href="#" class="card-header-icon">
                <span class="icon"><i class="mdi mdi-reload"></i></span>
              </a>
            </header>
            <div class="card-content">
              <div class="card">
                <div class="card-content gridbgd">
                  <div id="paper">
                    xxxxx
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
      </section>
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
</style>