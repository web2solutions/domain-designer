<script setup lang="ts">
import { onMounted } from 'vue';
import { useDomainOverviewStore } from '@/stores';

const domainOverViewStore = useDomainOverviewStore();

async function selectMainTab () {
    await domainOverViewStore.setSelectedProperty('');  
    domainOverViewStore.setpropertyFormTitle('New property');
    domainOverViewStore.selectPanelPropertyTab('listing')
}

async function selectFormTab () {
    // await domainOverViewStore.setSelectedProperty('');  
    // domainOverViewStore.setpropertyFormTitle('New property');
    domainOverViewStore.selectPanelPropertyTab('form')
}

defineProps<{
  icon: string,
}>()

onMounted(() => {
    
});
</script>
<template>
    <div class="tabs is-toggle is-fullwidth">
        <ul>
          <li 
            :class="domainOverViewStore.panelPropertySelected === 'listing' ? 'is-active' : ''"
            @click="selectMainTab()"
          >
            <a>
              <span class="icon is-small"><i :class="'mdi ' + icon" aria-hidden="true"></i></span>
              <span>Entity properties</span>
            </a>
          </li>
          <li 
            :class="domainOverViewStore.panelPropertySelected === 'form' ? 'is-active' : ''"
            @click="selectFormTab()"
          >
            <a>
              <span class="icon is-small"><i class="mdi mdi-plus-circle" aria-hidden="true"></i></span>
              <span>{{ domainOverViewStore.propertyFormTitle}}</span>
            </a>
          </li>
        </ul>
      </div>
</template>
