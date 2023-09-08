<script setup lang="ts">
import { ref, onMounted,  watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useAlertStore, useSchemasStore } from '@/stores';
import type { ISchemaCreateDTO } from '@/models/ISchemaCreateDTO';

const route = useRoute();

const alertStore = useAlertStore();
const schemaStore = useSchemasStore();

const input_name = ref(null);
const input_name_invalid = ref(false);
const input_description = ref(null);
const input_description_invalid = ref(false);



let isUpdate = false;

const id = route.params.id ? route.params.id.toString() : undefined;



async function goToMainView() {
  await router.push('/infrastructure/schemas/list');
}


function validate () {
  if ((input_name.value as unknown as HTMLInputElement).value.trim() === '') {
    input_name_invalid.value = true;
    return false;
  } else {
    input_name_invalid.value = false;
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
    spec: {
      description,
    }
  }
}

async function save() {
  const data = getHash();
  console.log('data', data)
  const record = await schemaStore.create(data as ISchemaCreateDTO);
  alertStore.success(`The new schema ${record?.name} is saved.`);
}

async function update() {
  const id = route.params.id;
  const data = getHash();
  const record = await schemaStore.update(id as string, data as ISchemaCreateDTO);
  alertStore.success(`The schema ${record?.name} is updated.`);
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
  
  if (id) {
    const record = await schemaStore.getRecord(id as string);
    console.log(record)
    if(record) {
      if(input_name.value) {
        (input_name.value as HTMLInputElement).value = record?.name;
      }
      if(input_description.value) {
        (input_description.value as HTMLInputElement).value = record.spec?.description || '';
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
        
        
        <hr />
        <div class="columns">
          <div class="column">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_name">Schema name</label>
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
                      placeholder="Type a name for this schema"
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
                      placeholder="Type a description for this schema"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
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
