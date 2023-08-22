<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDomainOverviewStore } from '@/stores';
import type { IEntityCreateDTO } from '@/models/IEntityCreateDTO';


const domainOverViewStore = useDomainOverviewStore();
const { selectedDataEntity } = storeToRefs(domainOverViewStore)
let input_name = ref('');
let input_name_invalid = ref(false);
let input_description = ref('');


async function save (event: Event) {
 try {
  event.preventDefault();
  const hash = getHash();
  await domainOverViewStore.saveOrUpdateEntity(hash);
  reset();
 } catch(e) {
  console.log(e);
 }
}

function reset() {
    input_name.value = '';
    input_name_invalid.value = false;
    input_description.value = '';
    domainOverViewStore.entityFormMode = 'create';
    domainOverViewStore.panelEntitySelected = 'listing';
    domainOverViewStore.entityFormTitle = 'New data entity';
}

function setFormData(hash: any) {
    input_name.value = hash.name;
    input_description.value = hash.description;
}

function getHash(): IEntityCreateDTO {
  if ( validate () ) {
    const hash: Record<string, any> = {
      domain_id: domainOverViewStore.selectedDomain,
      entity_id: domainOverViewStore.selectedDataEntity.id,
      name: input_name.value,
      description: input_description.value,
    }
    console.log(hash);
    return hash as IEntityCreateDTO;
  }
  throw 'invalid data'
}

function validate () {
  if (input_name.value === '') {
    input_name_invalid.value = true;
    return false;
  } else {
    input_name_invalid.value = false;
  }
  return true;
}


defineProps<{
  store: any,
}>()


watch(selectedDataEntity, () => {
    
    if(domainOverViewStore.entityFormMode === 'create') return;
    setFormData({
        name: selectedDataEntity.value.name,
        description: selectedDataEntity.value.description || '',
    })
});


onUnmounted(() => {
   reset();
});
</script>
<template>
    <div class="box" v-if="store.panelEntitySelected === 'form'">
        <form method="get">
            <!-- start input -->
            <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label">Name</label></div>
                <div class="field-body">
                    <div class="field">
                        <div class="control">
                            <input 
                                :class="'input is-small' + (input_name_invalid ? ' is-danger': '') " 
                                name="input_name"
                                v-model.trim="input_name" 
                                type="text"
                                placeholder="Type a name for this entity" 
                            />
                        </div>
                        <p class="help is-danger" v-if="input_name_invalid">
                            This field is required
                        </p>
                    </div>
                </div>
            </div><!-- end input -->
            <!-- start input -->
            <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label">Description</label></div>
                <div class="field-body">
                    <div class="field">
                        <div class="control">
                            <input
                                class="input is-small" 
                                name="input_description"
                                placeholder="Type a description for this entity"
                                v-model.trim="input_description"
                            />
                        </div>
                        <!--v-if-->
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
                                    class="button is-primary is-small"
                                    @click="save($event)"
                                >
                                    <span>Save</span>
                                </button>
                            </div>
                            <div class="control">
                                <button 
                                    type="button"
                                    class="button is-danger  is-small"
                                    @click="reset()"
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
</template>