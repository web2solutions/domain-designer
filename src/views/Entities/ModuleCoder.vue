<script setup lang="ts">
import { ref, onMounted,  watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import router from '@/router';
import { default as ControllerTypescript } from '@/components/Coder/ControllerTypescript.vue';
import { default as ServiceTypescript } from '@/components/Coder/ServiceTypescript.vue';
import { default as DataRepositoryTypescript } from '@/components/Coder/DataRepositoryTypescript.vue';
import { default as DataModelTypescript } from '@/components/Coder/DataModelTypescript.vue'
import { default as JsonSchemaTypescript } from '@/components/Coder/JsonSchemaTypescript.vue';
import { useEntitiesStore, useDomainsStore, useAlertStore, usePropertiesStore } from '@/stores';
// import type { IEntityCreateDTO } from '@/models/IEntityCreateDTO';
import { DomainSchema } from '@/database/DomainSchema';
import type { EntitySchema } from '@/database/EntitySchema';
import type { PropertySchema } from '@/database/PropertySchema';

const route = useRoute();

const alertStore = useAlertStore();
const entityStore = useEntitiesStore();
const propertyStore = usePropertiesStore();
const domainstore = useDomainsStore();

const input_name = ref(null);


const id = route.params.id ? route.params.id.toString() : undefined;

console.log(Object.keys(route))
console.log(route.redirectedFrom)
console.log(router.currentRoute)


// const parentPath = ;

const emptydomains: DomainSchema[] = [];
const domains = ref(emptydomains);


const entity = ref({} as EntitySchema);
const properties = ref([] as PropertySchema[]);

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>();

watch(
  () => route.params.id,
  async id => {    
    if(!id) {
        // 
    }
  }
)

onMounted(async () => {
  if(input_name.value) {
    // (input_name.value as HTMLInputElement).focus();
  }

  if(entityStore.goTo === '') {
    entityStore.goTo = `${route.matched[0].path}/list`;
  }
  
  domains.value = await domainstore.getAll();
  
  if (id) {
    entity.value = await entityStore.getRecord(id as string);

    properties.value = await propertyStore.getAllByEntityId(id);
    console.log('>>>', properties.value)
    
    if(entity.value.id) {
      // 
    } else {
      alertStore.error('Document not found');
      goToMainView();
    } 
  }

});

async function goToMainView() {
  await router.push(entityStore.goTo);
}

const showTab = ref('ControllerTab');

function changeTab (tabId: string) {
    showTab.value = tabId;
}
</script>

<template>
  <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <span class="icon"><i class="mdi mdi-xml"></i></span>
          Code Editor - {{ entity.name  }}
        </p>
        <p class="card-header-icon">
          <a 
            class="button is-small"
            @click="goToMainView()"
          >
            <span class="icon"><i class="mdi mdi-download"></i></span>
          </a>
          <a 
            class="button is-small is-danger"
            @click="goToMainView()"
          >
            <span class="icon"><i class="mdi mdi-close-circle"></i></span>
          </a>
        </p>
      </header>
      <div class="card-content">
        
          <div v-if="entity.id && properties.length > 0" class="box ide">
              <div class="tabs is-boxed is-small">
              <ul>
                    <li 
                        :class="showTab === 'ControllerTab' ? 'is-active' : ''"
                        @click="changeTab('ControllerTab')"
                    >
                      <a>
                          {{ entity.name  }}Controller
                      </a>
                  </li>
                  <li
                    :class="showTab === 'ServiceTab' ? 'is-active' : ''"
                    @click="changeTab('ServiceTab')"
                  >
                      <a>{{ entity.name  }}Service</a>
                  </li>
                  <li
                    :class="showTab === 'ModelTab' ? 'is-active' : ''"
                    @click="changeTab('ModelTab')"
                  >
                      <a>{{ entity.name  }}Model</a>
                  </li>
                  <li
                    :class="showTab === 'DataRepositoryTab' ? 'is-active' : ''"
                    @click="changeTab('DataRepositoryTab')"  
                  >
                    <a>
                        {{ entity.name  }}DataRepository
                    </a>
                  </li>
                  <li
                    :class="showTab === 'JsonSchemaTab' ? 'is-active' : ''"
                    @click="changeTab('JsonSchemaTab')"  
                  >
                    <a>
                        {{ entity.name  }} JSON Schema
                    </a>
                </li>
                  <li
                    :class="showTab === 'Use cases' ? 'is-active' : ''"
                    @click="changeTab('Use cases')"
                  >
                    <a>
                        {{ entity.name  }} - Use cases
                    </a>
                </li>
              </ul>
              </div>
              <ControllerTypescript v-if="showTab === 'ControllerTab'" :entity="entity" :properties="properties" />
              <ServiceTypescript v-if="showTab === 'ServiceTab'" :entity="entity" :properties="properties" />
              <DataRepositoryTypescript v-if="showTab === 'DataRepositoryTab'" :entity="entity" :properties="properties" />
              <DataModelTypescript  v-if="showTab === 'ModelTab'" :entity="entity" :properties="properties" />
              <JsonSchemaTypescript  v-if="showTab === 'JsonSchemaTab'" :entity="entity" :properties="properties" />
          </div>
          
      </div>
  </div>
</template>
<style scoped>
.ide{
  height: 68vh; 
  overflow: hidden;
  z-index: 1;
}
</style>