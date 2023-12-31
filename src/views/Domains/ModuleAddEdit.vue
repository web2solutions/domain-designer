<script setup lang="ts">
import { ref, onMounted,  watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import router from '@/router'
import { useDomainsStore, useAlertStore } from '@/stores';
import type { IDomainCreateDTO } from '@/models/IDomainCreateDTO';

const route = useRoute();

const alertStore = useAlertStore();
const domainStore = useDomainsStore();
const input_name = ref(null);
const input_name_invalid = ref(false);
const input_description = ref(null);
const input_description_invalid = ref(false);
let isUpdate = false;

const id = route.params.id ? route.params.id.toString() : undefined;

const parentPath = route.matched[0].path;

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
    (input_name.value as HTMLInputElement).focus();
  }
  if (id) {
    const record = await domainStore.getRecord(id as string);
    if(record) {
      if(input_name.value) {
        (input_name.value as HTMLInputElement).value = record?.name;
      }
      if(input_description.value) {
        (input_description.value as HTMLInputElement).value = record?.description;
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
  await router.push(`${parentPath}/list`);
}

function validate (event: any) {
  const field = event.target;
  if (field.value.trim() === '') {
    if(field.name === 'input_name') {
      input_name_invalid.value = true;
    } else if(field.name === 'input_description') {
      // input_description_invalid.value = true;
    }
    return false;
  } else {
    if(field.name === 'input_name') {
      input_name_invalid.value = false;
    } else if(field.name === 'input_description') {
      // input_description_invalid.value = false;
    }
  }

  return true;
}

function getHash() {
  let name: string = '';
  let description: string = '';

  if(input_name.value != null) {
    name = (input_name.value as HTMLInputElement).value || ''
  }

  if(input_description.value != null) {
    description = (input_description.value as HTMLInputElement).value || ''
  }
  
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
  if(input_name.value != null) {
    (input_name.value as HTMLInputElement).value = '';
  }

  if(input_description.value != null) {
    (input_description.value as HTMLInputElement).value = ''
  }
  
  input_name_invalid.value = false;
  input_description_invalid.value = false;
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
