<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { default as PropertyPanelTab } from './PropertyPanelTab.vue';
import { default as PropertyGrid } from './PropertyGrid.vue';
import { default as PropertyForm } from './PropertyForm.vue'
import { /* useDomainsStore, useEntitiesStore,*/ useDomainOverviewStore, usePropertiesStore } from '@/stores';
import type { IGridColumn } from '@/components/IGridColumn';

const route = useRoute();
const domainOverViewStore = useDomainOverviewStore();
const propertyStore = usePropertiesStore();
const emptyColumns: IGridColumn[] = [];
const propertiesColumns = ref(emptyColumns);

const propertyBeingEdited = ref(null)

const actionsProperty = ref([
  {
    name: 'edit property',
    icon: 'mdi-pencil',
    handler: async (id: string) => {
        await domainOverViewStore.setSelectedProperty(id);
        domainOverViewStore.setPropertyFormMode('update');
        domainOverViewStore.setpropertyFormTitle('Edit property');
        domainOverViewStore.selectPanelPropertyTab('form');
    },
  }, 
  {
    name: 'duplicate property',
    icon: 'mdi-content-duplicate',
    handler: async (id: string) => {
        await domainOverViewStore.duplicateProperty(id);
        // domainOverViewStore.setPropertyFormMode('update');
        // domainOverViewStore.setpropertyFormTitle('Edit property');
        // domainOverViewStore.selectPanelPropertyTab('form');
    },
  }, 
  {
    name: 'delete property',
    icon: 'mdi-trash-can',
    handler: (id: string) => {
      // remove from database
      // remove from properties list
      domainOverViewStore.removeProperty(id);
    },
  }
]);

const toolbarActionsProperty = ref([
  {
    name: 'add property',
    icon: 'mdi-plus-circle',
    handler: () => {
      router.push({
        path: `/properties/create`,
        query: { onDomain: route.params.id, onEntity: domainOverViewStore.selectedDataEntity.id }
      });
    },
  },
]);


onMounted(() => {
    propertiesColumns.value = propertyStore.columns.filter((c:IGridColumn) => {
        if(!c.foreignKey && c.name !== 'createdAt' && c.name !== 'updatedAt') return c;
    }) as IGridColumn[];
});

defineProps<{
  icon: string,
}>()
</script>
<template>
    <div class="block" v-if="domainOverViewStore.selectedDataEntity.id !== ''">
          <PropertyPanelTab :icon="icon" />
          <div class="box" v-if="domainOverViewStore.panelPropertySelected === 'form'">
            <PropertyForm />
          </div>
          <PropertyGrid
            v-if="domainOverViewStore.selectedDataEntity.id !== '' && domainOverViewStore.panelPropertySelected === 'listing'"
            key="properties" 
            title="Properties"
            :store="domainOverViewStore"
            :columns="propertiesColumns" 
            :data="domainOverViewStore.properties" 
            :icon="'mdi-alpha-e-box'" 
            :actions="actionsProperty"
          />
    </div>
</template>