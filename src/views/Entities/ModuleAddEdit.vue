<script setup lang="ts">
import { ref, onMounted,  watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useEntitiesStore, useDomainsStore, useAlertStore } from '@/stores';
import type { IEntityCreateDTO } from '@/models/IEntityCreateDTO';
import { DomainSchema } from '../../database/DomainSchema';

const route = useRoute();

const alertStore = useAlertStore();
const entityStore = useEntitiesStore();
const domainstore = useDomainsStore();

const input_name = ref(null);
const input_name_invalid = ref(false);
const input_description = ref(null);
const input_description_invalid = ref(false);

const input_domain_id = ref('');
const input_domain_id_invalid = ref(false);

let isUpdate = false;

const id = route.params.id ? route.params.id.toString() : undefined;

console.log(Object.keys(route))
console.log(route.redirectedFrom)
console.log(router.currentRoute)


// const parentPath = ;

const emptydomains: DomainSchema[] = [];
const domains = ref(emptydomains)

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
  
  domains.value = await domainstore.getAll();
  
  if (id) {
    const record = await entityStore.getRecord(id as string);
    
    if(record) {
      if(input_name.value) {
        (input_name.value as HTMLInputElement).value = record?.name;
      }
      if(input_description.value) {
        (input_description.value as HTMLInputElement).value = record?.description;
      }
      if(input_domain_id.value) {
        (input_domain_id.value as unknown as HTMLSelectElement).value = record.domain_id || '';
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

function validate (event: any) {
  // const field = event.target;
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
  

  return true;
}

function getHash() {
  let name: string = '';
  let domain_id: string = '';
  let description: string = '';

  if(input_name.value != null) {
    name = (input_name.value as HTMLInputElement).value || ''
  }

  if(input_domain_id.value != null) {
    domain_id = (input_domain_id.value as unknown as HTMLSelectElement).value || ''
  }

  if(input_description.value != null) {
    description = (input_description.value as HTMLInputElement).value || ''
  }
  
  if(name === '') {
    input_name_invalid.value = true;
    throw new Error('name is mandatory')
  }

  if(domain_id === '') {
    input_domain_id_invalid.value = true;
    throw new Error('domain is mandatory')
  }

  input_name_invalid.value = false;
  input_description_invalid.value = false;
  input_domain_id_invalid.value = false;
  
  return {
    name,
    domain_id,
    description,
  }
}

async function save() {
  const data = getHash();
  const record = await entityStore.create(data as IEntityCreateDTO);
  alertStore.success(`The new entity ${record?.name} is saved.`);
}

async function update() {
  const id = route.params.id;
  const data = getHash();
  console.log(data)
  const record = await entityStore.update(id as string, data as IEntityCreateDTO);
  alertStore.success(`The entity ${record?.name} is updated.`);
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
  
  input_name_invalid.value = false;
  input_description_invalid.value = false;
  input_domain_id_invalid.value = false;
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
      <form method="get">
        <!-- start input -->
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input 
                  :class="'input ' + (input_name_invalid ? 'is-danger' : '')" 
                  name="input_name" 
                  ref="input_name" 
                  type="text" 
                  placeholder="Type a name for this entity"
                  @change="validate($event)"
                  @blur="validate($event)"
                >
              </div>
              <p v-if="input_name_invalid" class="help is-danger">
                This field is required
              </p>
            </div>
          </div>
        </div>
        <!-- end input -->
        <!-- start input -->
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Domain</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select
                    :class="(input_domain_id_invalid ? 'is-danger' : '')"
                    name="input_domain_id" 
                    ref="input_domain_id"
                    @change="validate($event)"
                    @blur="validate($event)"
                  >
                    <option value="">please select one domain</option>
                    <option v-for="document in domains" :key="document.id" :value="document.id" :selected=" document.id === id ? true : document.id === route.query?.onDomain ? true : false">{{ document.name }} - {{document.description}}</option>
                  </select>
                </div>
                <p v-if="input_domain_id_invalid" class="help is-danger">
                  This field is required
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- end input -->
        <!-- start input -->
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Description</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <textarea 
                  :class="'textarea ' + (input_description_invalid ? 'is-danger' : '')"
                  name="input_description" 
                  ref="input_description" 
                  placeholder="Type a description for this entity"
                  @change="validate($event)"
                  @blur="validate($event)"
                ></textarea>
              </div>
              <p v-if="input_description_invalid" class="help is-danger">
                This field is required
              </p>
            </div>
          </div>
        </div>
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
                    class="button is-small is-primary"
                    @click="submit($event, true)"
                  >
                    <span>Save and close</span>
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="submit" 
                    class="button is-small is-primary"
                    @click="submit($event)"
                  >
                    <span>Save</span>
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="button" 
                    class="button is-small is-primary is-outlined"
                    @click="reset()"
                  >
                    <span>Reset</span>
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="button" 
                    class="button is-small is-danger is-outlined"
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
