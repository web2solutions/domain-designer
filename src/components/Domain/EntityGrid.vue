<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CrudListCell } from '../CRUD';

const props = defineProps<{
  data: any[],
  columns: any[],
  actions: any[],
  store: any,
}>()


onMounted(() => {
    
});

const entitySpec = ref({});
const showSpec = ref(false)

function buildEntitySpec() {
    const name = props.store.selectedDataEntity.name
    console.log(name)
    console.log(props.store.properties)
    const spec: Record<string, any> = {};
    spec[name] = {
        required: [],
        properties: {
            
        }
    }
    for(const property of props.store.properties) {
        spec[name].properties[property.name] = { ...property.spec, description: property.description || '' }
    }
    return spec
}

async function preview(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    await props.store.setSelectedDataEntity(id);
    entitySpec.value = buildEntitySpec();
    showSpec.value = !showSpec.value;
}

async function selectMainId(id: string) {
  await props.store.setSelectedDataEntity(id);
  showSpec.value = false;
}
</script>
<template>
    <div class="card has-table" v-if="store.panelEntitySelected === 'listing'">
        <div class="card-content" v-if="data.length === 0">
            <section class="section">
                <div class="content has-text-grey has-text-centered">
                    <p>
                        <span class="icon is-large"><i class="mdi mdi-emoticon-sad mdi-48px"></i></span>
                    </p>
                    <p>Nothing's here…</p>
                </div>
            </section>
        </div>
        <div class="card-content" v-else>
            <div class="b-table has-pagination">
                <div class="table-wrapper has-mobile-cards">
                    <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th></th>
                                <th v-for="col in columns" :key="col.name">

                                    <span class="icon-text">

                                        <span>{{ col.label }}</span>
                                        <span class="icon">
                                            <i class="mdi mdi-home"></i>
                                        </span>
                                        <span class="icon">
                                            <i class="mdi mdi-home"></i>
                                        </span>
                                    </span>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="record in data" :key="record.id" >
                                <tr 
                                    @click="selectMainId(record.id)"
                                    :class="'clickable' + (record.id === props.store.selectedDataEntity.id ? ' is-selected' : '')">
                                    <td class="is-image-cell">
                                        <div class="image">
                                            <img :src="`https://avatars.dicebear.com/v2/initials/${record.name}.svg`"
                                                class="is-rounded">
                                        </div>
                                    </td>
                                    <CrudListCell v-for="col in columns" :key="col.name" :name="col.name"
                                        :label="col.label" :type="col.type" :foreignKey="col.foreignKey || {}"
                                        :value="record[col.name]" :col="col" :store="{}">
                                    </CrudListCell>
                                    <th class="is-actions-cell">
                                        <div class="buttons is-right">
                                            <button class="button is-small is-light" type="button"
                                                @click="preview(record.id, $event)">
                                                <span class="icon"><i class="mdi mdi-eye"></i></span>
                                            </button>
                                            <button class="button is-small is-light" type="button"
                                                v-for="action in actions" :key="action.name"
                                                @click="action.handler(record.id, $event)">
                                                <span class="icon"><i :class="`mdi ${action.icon}`"></i></span>
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                                <tr v-if="record.id === props.store.selectedDataEntity.id && showSpec">
                                    <td colspan="4">
                                        <json-viewer :value="entitySpec" :boxed="true" :copyable="true" :expanded="true" :expand-depth="4"></json-viewer>
                                    </td>
                                </tr>
                            </template>
                            
                        </tbody>
                    </table>
                </div>
                <div class="notification">

                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.clickable {
  cursor: pointer;
}
</style>