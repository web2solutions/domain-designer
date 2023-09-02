<script setup lang="ts">
import {
    onMounted,
    ref,
} from 'vue';
import {
    EntitySchema
} from '@/database/EntitySchema';
import {
    serviceLiteral
} from './serviceLiteral';


const props = defineProps < {
    entity: EntitySchema;
    properties: any[];
} > ()


onMounted(() => {
    let templateString = serviceLiteral
        .replace(/_entityname_/g, '' + props.entity.name.toLowerCase())
        .replace(/_ENTITYNAME_/g, '' + props.entity.name);
    const lines: string[] = ['{'];
    console.log(props.properties)
    props.properties.forEach(property => {
        lines.push(`            ${property.name}: params.${property.name},`);
    });
    lines.push('        }');

    templateString = templateString.toString().replace(/__createpayload__/gi, lines.join('\n'));

    (document.getElementById('editorServiceTypescript') as HTMLElement).textContent = templateString;



    ace.require("ace/ext/language_tools");
    const editor = ace.edit('editorServiceTypescript');
    editor.setTheme("ace/theme/dracula");
    editor.session.setMode("ace/mode/typescript");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });


    let provider = LanguageProvider.fromCdn("https://cdn.jsdelivr.net/npm/ace-linters/build");

    // Register the editor with the language provider
    provider.registerEditor(editor);
    // document.getElementById('editorServiceTypescript').style.display = 'block'

});
</script>
<template>
    <div id="editorServiceTypescript">
        <progress class="progress is-small is-light" max="100">30%</progress>
    </div>
</template>
<style scoped>
#editorServiceTypescript { 
    height: 95%;
    left: 3px;
    right: 5px;
    top: -10px;
}
</style>