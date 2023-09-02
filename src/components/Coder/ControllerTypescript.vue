<script setup lang="ts">
import {
    onMounted,
    ref
} from 'vue';
import type {
    EntitySchema
} from '@/database/EntitySchema';
import {
    controllerLiteral
} from './controllerLiteral';

const template = ref(controllerLiteral);

const props = defineProps < {
    entity: EntitySchema;
    properties: any[]
} > ()

onMounted(() => {
    if(document.getElementById('editorControllerTypescript')) {
        let templateString = controllerLiteral
            .replace(/_entityname_/g, '' + props.entity.name.toLowerCase())
            .replace(/_ENTITYNAME_/g, '' + props.entity.name);
        const lines = ['{'];
        console.log(props.properties)
        props.properties.forEach(property => {
            lines.push(`            ${property.name}: params.${property.name},`);
        });
        lines.push('        }');

        templateString = templateString.toString().replace(/__createpayload__/gi, lines.join('\n'));


        (document.getElementById('editorControllerTypescript') as HTMLElement).textContent = templateString;
        ace.require("ace/ext/language_tools");
        const editor = ace.edit('editorControllerTypescript');
        editor.setTheme("ace/theme/dracula");
        editor.session.setMode("ace/mode/typescript");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });


        let provider = LanguageProvider.fromCdn("https://cdn.jsdelivr.net/npm/ace-linters/build");

        // Register the editor with the language provider
        provider.registerEditor(editor);
        // document.getElementById('editorControllerTypescript').style.display = 'block'
    }
});
</script>
<template>
    <div id="editorControllerTypescript">
        <progress class="progress is-small is-light" max="100">30%</progress>
    </div>
</template>
<style scoped>
#editorControllerTypescript { 
    height: 95%;
    left: 3px;
    right: 5px;
    top: -10px;
}
</style>