<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useDomainOverviewStore } from '@/stores';
import { OASDataTypes, OASFormats } from '@/components/OAS';
import type { IPropertyCreateDTO } from '@/models/IPropertyCreateDTO';

let domainOverViewStore = useDomainOverviewStore();
let input_name = ref('');
let input_name_invalid = ref(false);
let input_description = ref('');
let input_type = ref('');
let input_type_invalid = ref(false);


let input_format = ref('');
let input_pattern = ref('');
let input_minLength = ref('');
let input_maxLength = ref('');
let input_enum = ref('');

let input_example = ref('');
let input_default = ref('');

let input_readOnly = ref(false);
let input_writeOnly = ref(false);
let input_nullable = ref(false);

let input_minimum = ref('');
let input_maximum = ref('');
let input_exclusiveMinimum = ref(false);
let input_exclusiveMaximum = ref(false);
let input_multipleOf = ref('');


async function save (event: Event) {
 try {
  event.preventDefault();
  const hash = getHash(domainOverViewStore.selectedDataType);
  // console.log('domainOverViewStore.selectedProperty', domainOverViewStore.selectedProperty)
  domainOverViewStore.saveOrUpdateProperty(hash);
  await goToMainView();
 } catch(e) {
  console.log(e);
 }
}

function reset() {
    input_name.value = '';
    input_name_invalid.value = false;
    input_description.value = '';

    input_type.value = '';
    input_type_invalid.value = false;


    input_format.value = '';
    input_pattern.value = '';
    input_minLength.value = '';
    input_maxLength.value = '';
    input_enum.value = '';

    input_example.value = '';
    input_default.value = '';

    input_readOnly.value = false;
    input_writeOnly.value = false;
    input_nullable.value = false;

    input_minimum.value = '';
    input_maximum.value = '';
    input_exclusiveMinimum.value = false;
    input_exclusiveMaximum.value = false;
    input_multipleOf.value = ''


    domainOverViewStore.setPropertyFormMode('create');
    domainOverViewStore.setpropertyFormTitle('New property');
    domainOverViewStore.selectPanelPropertyTab('listing');
}

function getHash(type: string): IPropertyCreateDTO {
  if ( validate () ) {
    const hash: Record<string, any> = {
      domain_id: domainOverViewStore.selectedDomain,
      entity_id: domainOverViewStore.selectedDataEntity.id,
      name: input_name.value,
      description: input_description.value,
      spec: {
        ...getHashSpec.common(),
        ...getHashSpec[type](),
      }
    }
    // console.log(hash);
    const clearHash: Record<string, any> = {};
    Object.keys(hash.spec).forEach(key => {
      if(hash.spec[key] !== '' && hash.spec[key] != false) {
        clearHash[key] = hash.spec[key];
      }
    })
    hash.spec = { ...clearHash }
    return hash as IPropertyCreateDTO;
  }
  throw 'invalid data'
}

const getHashSpec: Record<string, any> = {
  'common': () => {
    return {
      type: input_type.value,
      example: input_example.value,
      default: input_default.value,
      readOnly: input_readOnly.value,
      writeOnly: input_writeOnly.value,
      nullable: input_nullable.value,
    }
  },
  'string': () => {
    return {
      format: input_format.value,
      pattern: input_pattern.value,
      minLength: input_minLength.value,
      maxLength: input_maxLength.value,
      enum: input_enum.value.split(',').map(el => el.trim()),
    }
  },
  'number': () => {
    return {
      format: input_format.value,
      minimum: input_minimum.value,
      maximum: input_maximum.value,
      exclusiveMinimum: input_exclusiveMinimum.value,
      exclusiveMaximum: input_exclusiveMaximum.value,
      multipleOf: input_multipleOf.value,
    }
  },
  'integer': () => {
    return {
      format: input_format.value,
      minimum: input_minimum.value,
      maximum: input_maximum.value,
      exclusiveMinimum: input_exclusiveMinimum.value,
      exclusiveMaximum: input_exclusiveMaximum.value,
      multipleOf: input_multipleOf.value,
    }
  }
}



function selectDataType () {
  // console.log(input_type.value)
  domainOverViewStore.selectedDataType = input_type.value;
  domainOverViewStore.selectedFormats = OASFormats[input_type.value];
  validate();
}

function validate () {
  if (input_name.value === '') {
    input_name_invalid.value = true;
    return false;
  } else {
    input_name_invalid.value = false;
  }

  if (input_type.value === '') {
    input_type_invalid.value = true;
    return false;
  } else {
    input_type_invalid.value = false;
  }

  return true;
}

async function goToMainView () {

  // await domainOverViewStore.getPropertiesByDataEntityId(domainOverViewStore.selectedDataEntity.id);
}

onMounted(() => {
    // console.log(domainOverViewStore.propertyFormMode)
    if(domainOverViewStore.selectedProperty?.id && domainOverViewStore.propertyFormMode === 'update') {
      const property = domainOverViewStore.selectedProperty;

      // console.log('property >>>>>>', property);

      input_name.value = property.name;
      input_description.value = property.description || '';
      if (!property.spec) return;

      input_type.value = property.spec.type || '';

      selectDataType();

      if (property.spec.format) input_format.value = property.spec.format;
      if (property.spec.pattern) input_pattern.value = property.spec.pattern;
      if (property.spec.minLength) input_minLength.value = property.spec.minLength as unknown as string;
      if (property.spec.maxLength) input_maxLength.value = property.spec.maxLength as unknown as string;
      if (property.spec.enum) input_enum.value = property.spec.enum.join(', ') as unknown as string;

      if (property.spec.example) input_example.value = property.spec.example;
      if (property.spec.default) input_default.value = property.spec.default;

      if (property.spec.readOnly) input_readOnly.value = property.spec.readOnly;
      if (property.spec.writeOnly) input_writeOnly.value = property.spec.writeOnly;
      if (property.spec.nullable) input_nullable.value = property.spec.nullable;

      if (property.spec.minimum) input_minimum.value = property.spec.minimum as unknown as string;
      if (property.spec.maximum) input_maximum.value = property.spec.maximum as unknown as string;
      if (property.spec.exclusiveMinimum) input_exclusiveMinimum.value = property.spec.exclusiveMinimum;
      if (property.spec.exclusiveMaximum) input_exclusiveMaximum.value = property.spec.exclusiveMaximum;
      if (property.spec.multipleOf) input_multipleOf.value = property.spec.multipleOf as unknown as string;
    }
});

onUnmounted(() => {
   reset();
});
</script>
<template>
    <form method="get">
        <div class="columns">
          <div class="column">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_name">Name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      :class="'input is-small ' + (input_name_invalid ? 'is-danger' : '')" 
                      v-model.trim="input_name" 
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
                      class="input is-small"
                      id="input_description" 
                      v-model.trim="input_description" 
                      placeholder="Type a description for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <!-- start input -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_type">Type</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select
                        :class="'select input is-small ' + (input_type_invalid ? 'is-danger' : '')"
                        id="input_type" 
                        v-model="input_type"
                        @change="selectDataType()"
                      >
                        <option value="">please select one data type</option>
                        <option v-for="type in OASDataTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>
                    <p v-if="input_type_invalid" class="help is-danger">
                      This field is required
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column">
            <!-- start input -->
            <div class="field is-horizontal" v-if="domainOverViewStore.selectedDataType === 'string' || domainOverViewStore.selectedDataType === 'number' || domainOverViewStore.selectedDataType === 'integer'">
              <div class="field-label is-small">
                <label class="label" for="">Format</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select
                        class="select is-small"
                        name="input_format" 
                        id="input_format" 
                        v-model.trim="input_format"
                      >
                        <option v-for="format in domainOverViewStore.selectedFormats" :key="format" :value="format">{{ format }}</option>
                      </select>
                    </div>
    
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column" v-if="domainOverViewStore.selectedDataType !== ''">
            <label class="checkbox field-label is-small" >
              <input 
                type="checkbox"
                name="input_nullable" 
                v-model="input_nullable"
              >
              It is Nullable
            </label>
          </div>
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'string'">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_pattern">Pattern</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      class="input is-small" 
                      name="input_pattern" 
                      id="input_pattern" 
                      v-model.trim="input_pattern" 
                      type="text" 
                      placeholder="Type a pattern for this property"
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- end input is-small -->
          </div>
        </div>
        <div class="columns" v-if="domainOverViewStore.selectedDataType !== ''">
          <div class="column">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_example">Example</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="text" 
                      class="input is-small"
                      name="input_example"
                      id="input_example" 
                      v-model.trim="input_example" 
                      placeholder="Type a example value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Default</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="text" 
                      class="input is-small"
                      name="input_default"
                      id="input_default" 
                      v-model.trim="input_default" 
                      placeholder="Type a default value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column">
            
            <label class="checkbox field-label is-small" >
              <input 
                type="checkbox"
                name="input_readOnly" 
                v-model="input_readOnly"
              >
              It is read only
            </label>
          </div>
          <div class="column">
            
            <label class="checkbox field-label is-small" >
              <input 
                type="checkbox"
                name="input_writeOnly" 
                v-model="input_writeOnly"
              >
              It is write only
            </label>
          </div>
        </div>
        <div class="columns" v-if="domainOverViewStore.selectedDataType !== ''">
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'string'">
            
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Enum</label>
              </div>
              <div class="field-body">
                <div class="field">
                  
                  <div class="control">
                    <input 
                      type="text" 
                      class="input is-small"
                      name="input_enum"
                      id="input_enum" 
                      v-model.trim="input_enum" 
                      placeholder="Type a comma separated list of enums"
                    />
                    <template v-for="val in input_enum.toString().split(',')" :key="val.trim()">
                      <span v-if="val.trim() !== ''" class="tag is-link">{{ val.trim() }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'string'">
            
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Min length</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="number" 
                      class="input is-small"
                      name="input_minLength"
                      id="input_minLength" 
                      v-model.number="input_minLength" 
                      placeholder="Type a minimum length value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'string'">
            
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Max length</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="number" 
                      class="input is-small"
                      name="input_maxLength"
                      id="input_maxLength" 
                      v-model.number="input_maxLength" 
                      placeholder="Type a max length value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'object'">
            required
          </div>
        </div>
        
        <div class="columns" v-if="domainOverViewStore.selectedDataType === 'number' || domainOverViewStore.selectedDataType === 'integer'">
          <div class="column">
            
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Min. number</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="number" 
                      class="input is-small"
                      name="input_minimum"
                      id="input_minimum" 
                      v-model.number="input_minimum" 
                      placeholder="Type a minimum value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column">
            
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Max. number</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="number" 
                      class="input is-small"
                      name="input_maximum"
                      id="input_maximum" 
                      v-model.number="input_maximum" 
                      placeholder="Type a maximum value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column">
            
            <!-- start input is-small -->
            <div class="control">                    
              <label class="checkbox field-label is-small" >
                <input 
                  type="checkbox"
                  name="input_exclusiveMinimum" 
                  v-model="input_exclusiveMinimum"
                >
                exclusive Minimum
              </label>
            </div>
            <!-- end input -->
          </div>
          <div class="column">
            
            <!-- start input is-small -->
              <label class="checkbox field-label is-small" >
                <input 
                  type="checkbox"
                  name="input_exclusiveMaximum" 
                  v-model="input_exclusiveMaximum"
                >
                exclusive Maximum
              </label>
            <!-- end input -->
          </div>
          <div class="column">
            <!-- start input is-small -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Multiple of</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="number" 
                      class="input is-small"
                      name="input_multipleOf"
                      id="input_multipleOf" 
                      v-model.number="input_multipleOf" 
                      placeholder="Type a multiple Of value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
            
          </div>
        </div>

        <div class="columns" v-if="domainOverViewStore.selectedDataType === 'array'">
          <div class="column">
            minItems
          </div>
          <div class="column">
            maxItems
          </div>
          <div class="column">
            uniqueItems
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
                    class="button is-small is-primary is-small"
                    @click="save($event)"
                  >
                    <span>Save</span>
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="button" 
                    class="button is-small is-danger is-small"
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
</template>