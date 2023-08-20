<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDomainOverviewStore } from '@/stores';
import { OASDataTypes, OASFormats } from '@/components/OAS';

const domainOverViewStore = useDomainOverviewStore();
const input_name = ref(null);
const input_name_invalid = ref(false);
const input_description = ref(null);
const input_description_invalid = ref(false);
const input_type = ref(null);
const input_type_invalid = ref(false);


function selectDataType (event: Event) {
  const type = (event.target as HTMLSelectElement).value;
  console.log(type);
  domainOverViewStore.selectedDataType = type
  domainOverViewStore.selectedFormats = OASFormats[type];
  validate();
  // input_type.value = type;
}

function validate () {
  if ((input_name.value as unknown as HTMLInputElement).value.trim() === '') {
    input_name_invalid.value = true;
    return false;
  } else {
    input_name_invalid.value = false;
  }

  if ((input_type.value as unknown as HTMLSelectElement).value.trim() === '') {
    input_type_invalid.value = true;
    return false;
  } else {
    input_type_invalid.value = false;
  }

  return true;
}


onMounted(() => {
    
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
                        name="input_type" 
                        id="input_type" 
                        ref="input_type"
                        @change="selectDataType($event)"
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
                        ref="input_format"
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
                ref="input_nullable"
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
                      ref="input_pattern" 
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
                      ref="input_example" 
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
                      ref="input_default" 
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
                ref="input_readOnly"
              >
              It is read only
            </label>
          </div>
          <div class="column">
            
            <label class="checkbox field-label is-small" >
              <input 
                type="checkbox"
                name="input_writeOnly" 
                ref="input_writeOnly"
              >
              It is write only
            </label>
          </div>
        </div>
        <div class="columns" v-if="domainOverViewStore.selectedDataType !== ''">
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'string'">
            enum
          </div>
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'string'">
            minLength
          </div>
          <div class="column" v-if="domainOverViewStore.selectedDataType === 'string'">
            maxLength
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
                      ref="input_default" 
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
                      ref="input_default" 
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
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label" for="input_default">Exclusive min.</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="number" 
                      class="input is-small"
                      name="input_exclusiveMinimum"
                      id="input_exclusiveMinimum" 
                      ref="input_default" 
                      placeholder="Type a exclusive minimum value for this property"
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
                <label class="label" for="input_default">Exclusive max.</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input 
                      type="number" 
                      class="input is-small"
                      name="input_exclusiveMaximum"
                      id="input_exclusiveMaximum" 
                      ref="input_default" 
                      placeholder="Type a exclusive exclusive maximum value for this property"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end input -->
          </div>
          <div class="column">
            multipleOf
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
      </form>
</template>