<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import router from '@/router'
import { AlertMessage } from '@/components/Application/';
import { useDomainsStore } from '@/stores';
import type { IDomainCreateDTO } from '@/models/IDomainCreateDTO';
import { useAlertStore } from '@/stores';

// const routeRef = ref(router.currentRoute);
const route = useRoute();

const alertStore = useAlertStore();
const domainStore = useDomainsStore();
const input_name = ref(null);
const input_name_invalid = ref(false);
const input_description = ref(null);
const input_description_invalid = ref(false);
let isUpdate = false;

const id = route.params.id ? route.params.id.toString() : undefined;


defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()

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
  input_name.value.focus();
  if (id) {
    const record = await domainStore.getRecord(id as string);
    if(record) {
      input_name.value.value = record?.name;  
      input_description.value.value = record?.description;
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
  await router.push('/domains/list');
}

function validate (event) {
  const field = event.target;
  if (field.value.trim() === '') {
    if(field.name === 'input_name') {
      input_name_invalid.value = true;
    } else if(field.name === 'input_description') {
      input_description_invalid.value = true;
    }
    return false;
  } else {
    if(field.name === 'input_name') {
      input_name_invalid.value = false;
    } else if(field.name === 'input_description') {
      input_description_invalid.value = false;
    }
  }

  return true;
}

function getHash() {
  const name = input_name.value.value;
  const description = input_description.value.value || '';
  if(name === '') {
    input_name_invalid.value = true;
    throw new Error('name is mandatory')
  }

  input_name_invalid.value = false;
  input_description_invalid.value = false;
  return {
    name,
    description,
  }
}

async function save() {
  const data = getHash();
  const record = await domainStore.create(data as IDomainCreateDTO);
  alertStore.success(`The new domain ${record?.name} is saved.`);
}

async function update() {
  const id = route.params.id;
  const data = getHash();
  const record = await domainStore.update(id as string, data as IDomainCreateDTO);
  alertStore.success(`The domain ${record?.name} is updated.`);
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
  input_name.value.value = '';
  input_name_invalid.value = false;
  input_description.value.value = '';
  input_description_invalid.value = false;
}
</script>

<template>
  <AlertMessage />
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
                  placeholder="Type a name for this domain"
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
            <label class="label">Description</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <textarea 
                  :class="'textarea ' + (input_description_invalid ? 'is-danger' : '')"
                  name="input_description" 
                  ref="input_description" 
                  placeholder="Type a description for this domain"
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
