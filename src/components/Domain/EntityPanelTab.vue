<script setup lang="ts">

const props = defineProps<{
  store: any,
}>()


async function selectTab(panelType: String) {
    await props.store.setPanelEntitySelected(panelType);
}
</script>
<template>
    <div class="tabs is-toggle is-fullwidth">
        <ul>
            <li 
                @click="selectTab('listing')" 
                :class="store.panelEntitySelected === 'listing' ? 'is-active' : ''"
            >
                <a>
                    <span class="icon is-small"><i class="mdi mdi-ballot" aria-hidden="true"></i></span>
                    <span>Data Entities</span>
                </a>
            </li>
            <li
                @click="selectTab('form')" 
                :class="store.panelEntitySelected === 'form' ? 'is-active' : ''"
            >
                <a>
                    <span class="icon is-small"><i class="mdi mdi-plus-circle" aria-hidden="true"></i></span>
                    <span>{{ store.entityFormTitle }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>