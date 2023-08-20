<script setup lang="ts">
import { ref, onMounted,  watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import router from '../../router';
import { usePropertiesStore, useEntitiesStore, useDomainsStore, useAlertStore } from '../../stores';
import type { IPropertyCreateDTO } from '../../models/IPropertyCreateDTO';
import type { DomainSchema } from '@/database/DomainSchema';
import type { EntitySchema } from '@/database/EntitySchema';

const route = useRoute();

const alertStore = useAlertStore();
const propertyStore = usePropertiesStore();
const entityStore = useEntitiesStore();
const domainStore = useDomainsStore();

const input_name = ref(null);
const input_name_invalid = ref(false);
const input_description = ref(null);
const input_description_invalid = ref(false);
const input_domain_id = ref(null);
const input_domain_id_invalid = ref(true);

const input_entity_id = ref(null);
const input_entity_id_invalid = ref(true);


let isUpdate = false;

const id = route.params.id ? route.params.id.toString() : undefined;

const parentPath = route.matched[0].path;

const emptyDomains: DomainSchema[] = [];
const domains = ref(emptyDomains);
const emptyEntities: EntitySchema[] = [];
const entities = ref(emptyEntities);


defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>();

watch(
  () => route.params.id,
  async id => {    
    if(!id) {
      reset();
      isUpdate = false;
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

  domains.value = await domainStore.getAll();
  entities.value = await entityStore.getAll();


  
  if (id) {
    const record = await propertyStore.getRecord(id as string);
    
    if(record) {
      if(input_name.value) {
        (input_name.value as HTMLInputElement).value = record?.name;
      }
      if(input_description.value) {
        (input_description.value as HTMLInputElement).value = record?.description;
      }
      if(input_entity_id.value) {
        (input_entity_id.value as unknown as HTMLSelectElement).value = record.entity_id;
      }
      if(input_domain_id.value) {
        (input_domain_id.value as unknown as HTMLSelectElement).value = record.domain_id;
      }
      isUpdate = true;
      return;
    } else {
      alertStore.error('Document not found');
      goToMainView();
    } 
  }

  reset();
  isUpdate = false;
});



async function goToMainView() {
  await router.push(entityStore.goTo);
}


async function changeDomain () {
  const val = (input_domain_id.value as unknown as HTMLSelectElement).value.trim()
  if (val !== '') {
    // get entities
    entities.value = await domainStore.getEntities(val);
  } 
  validate()
}


function validate () {
  if ((input_name.value as unknown as HTMLInputElement).value.trim() === '') {
    input_name_invalid.value = true;
    return false;
  } else {
    input_name_invalid.value = false;
  }
  
  if ((input_domain_id.value as unknown as HTMLSelectElement).value.trim() === '') {
    input_domain_id_invalid.value = true;
    return false;
  } else {
    input_domain_id_invalid.value = false;
  }

  if ((input_entity_id.value as unknown as HTMLSelectElement).value.trim() === '') {
    input_entity_id_invalid.value = true;
    return false;
  } else {
    input_entity_id_invalid.value = false;
  }

  return true;
}

function getHash() {
  let name: string = '';
  let description: string = '';
  let domain_id: string = '';
  let entity_id: string = '';

  if(input_name.value != null) {
    name = (input_name.value as HTMLInputElement).value || ''
  }

  if(input_description.value != null) {
    description = (input_description.value as HTMLInputElement).value || ''
  }

  if(input_domain_id.value != null) {
    domain_id = (input_domain_id.value as unknown as HTMLSelectElement).value || ''
  }

  if(input_entity_id.value != null) {
    entity_id = (input_entity_id.value as unknown as HTMLSelectElement).value || ''
  }
  
  if(name === '') {
    input_name_invalid.value = true;
    throw new Error('name is mandatory')
  }

  if(domain_id === '') {
    input_domain_id_invalid.value = true;
    throw new Error('domain is mandatory')
  }

  if(entity_id === '') {
    input_entity_id_invalid.value = true;
    throw new Error('entity is mandatory')
  }

  input_name_invalid.value = false;
  input_description_invalid.value = false;
  input_domain_id_invalid.value = false;
  input_entity_id_invalid.value = false;

  return {
    name,
    domain_id,
    entity_id,
    description,
  }
}

async function save() {
  const data = getHash();
  const record = await propertyStore.create(data as IPropertyCreateDTO);
  alertStore.success(`The new property ${record?.name} is saved.`);
}

async function update() {
  const id = route.params.id;
  const data = getHash();
  const record = await propertyStore.update(id as string, data as IPropertyCreateDTO);
  alertStore.success(`The property ${record?.name} is updated.`);
}

async function submit(event: Event, close?: boolean) {
  event.preventDefault();
  try {
    if (isUpdate) {
      await update();
    } else {
      await save();
      reset();
    }
    
    if(close) {
      goToMainView();
    }
  } catch (error: any) {
    alertStore.error(error.message);
  }
}

function reset() {
  if(input_name.value != null) {
    (input_name.value as HTMLInputElement).value = '';
  }

  if(input_description.value != null) {
    (input_description.value as HTMLInputElement).value = ''
  }

  if(input_domain_id.value != null) {
    (input_domain_id.value as unknown as HTMLSelectElement).value = ''
  }

  if(input_entity_id.value != null) {
    (input_entity_id.value as unknown as HTMLSelectElement).value = ''
  }
  
  input_name_invalid.value = false;
  input_description_invalid.value = false;
  input_domain_id_invalid.value = false;
  input_entity_id_invalid.value = false;
}
</script>

<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="icon"><i :class="'mdi ' + icon"></i></span>
        {{ childName  }}
      </p>
    </header>
    <div class="card-content">
      <form method="get"><div class="columns">
        <div class="column">
        <!-- start input -->
        <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label" for="input_domain_id">Domain</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <div class="select is-fullwidth">
                  <select
                    :class="'select is-small ' + (input_domain_id_invalid ? 'is-danger' : '')"
                    name="input_domain_id" 
                    ref="input_domain_id"
                    id="input_domain_id"
                    @change="changeDomain()"
                    @blur="changeDomain()"
                  >
                    <option value="">please select one domain</option>
                    <option v-for="document in domains" :key="document.id" :value="document.id" :selected=" document.id === id ? true : document.id === route.query?.onDomain ? true : false">{{ document.name }}</option>
                  </select>
                </div>
                <p v-if="input_domain_id_invalid" class="help is-danger">
                  This field is required
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- end input is-small -->
        </div>
        <div class="column">
          <!-- start input is-small -->
        <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label" for="input_entity_id">Entity</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <div class="select is-fullwidth">
                  <select
                    :class="'select is-small ' + (input_entity_id_invalid ? 'is-danger' : '')"
                    name="input_entity_id" 
                    ref="input_entity_id"
                    id="input_entity_id"
                    @change="validate()"
                    @blur="validate()"
                  >
                    <option value="">please select one entity</option>
                    <option v-for="document in entities" :key="document.id" :value="document.id" :selected=" document.id === propertyStore.record.id ? true : document.id === route.query?.onEntity ? true : false">{{ document.name }} - {{document.description}}</option>
                  </select>
                </div>
                <p v-if="input_entity_id_invalid" class="help is-danger">
                  This field is required
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- end input is-small -->
        </div>
      </div>
        
        
        <hr />
        <div class="columns">
          <div class="column">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_name">Property name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      :class="'input is-small ' + (input_name_invalid ? 'is-danger' : '')" 
                      name="input_name" 
                      ref="input_name" 
                      id="input_name" 
                      type="text" 
                      placeholder="Type a name for this property"
                      @change="validate()"
                      @blur="validate()"
                    >
                  </div>
                  <p v-if="input_name_invalid" class="help is-danger">
                    This field is required
                  </p>
                </div>
              </div>
            </div>
            <!-- end input is-small -->
          </div>
          <div class="column">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_description">Description</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="text" 
                      :class="'input is-small ' + (input_description_invalid ? 'is-danger' : '')"
                      name="input_description"
                      id="input_description" 
                      ref="input_description" 
                      placeholder="Type a description for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
        </div>
        
        

        <!-- start input -->
        <!-- <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label">Entity</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select
                    name="input_type" 
                    ref="input_type"
                  >
                    <option value="">please select one type</option>
                    <option v-for="type in OASDataTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
                <p v-if="input_entity_id_invalid" class="help is-danger">
                  This field is required
                </p>
              </div>
            </div>
          </div>
        </div> -->
        <!-- end input -->

        
        <hr>
        <div class="field is-horizontal">
          <div class="field-label">
            <!-- Left empty for spacing -->
          </div>
          <div class="field-body">
            <div class="field">
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button 
                    type="submit" 
                    class="button is-primary"
                    @click="submit($event, true)"
                  >
                    <span>Save and close</span>
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="submit" 
                    class="button is-primary"
                    @click="submit($event)"
                  >
                    <span>Save</span>
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="button" 
                    class="button is-primary is-outlined"
                    @click="reset()"
                  >
                    <span>Reset</span>
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="button" 
                    class="button is-danger is-outlined"
                    @click="goToMainView()"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
