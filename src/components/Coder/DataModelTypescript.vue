<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { EntitySchema } from '@/database/EntitySchema';
import { modelLiteral } from './modelLiteral';


const props = defineProps<{ 
    entity: EntitySchema;
    properties: any[]
}>()

onMounted(() => {
    
    let templateString = modelLiteral
        .replace(/_entityname_/g, '' + props.entity.name.toLowerCase())
        .replace(/_ENTITYNAME_/g, '' + props.entity.name);
    const lines: string[] = [];
    props.properties.forEach(property => {
        lines.push(`    ${property.name}: ${property.spec.type};`);
    });

    templateString = templateString.toString().replace(/_modelProperties_/gi, lines.join('\n'));


    (document.getElementById('editorControllerTypescript') as HTMLElement).textContent = templateString;
    ace.require("ace/ext/language_tools");
    const editor = ace.edit('editorControllerTypescript');
    editor.setTheme("ace/theme/dracula");
    editor.session.setMode("ace/mode/typescript");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        useWorker: true
    });


    let provider = LanguageProvider.fromCdn("https://cdn.jsdelivr.net/npm/ace-linters/build", {
            functionality: {
                hover: true,
                completion: {
                    overwriteCompleters: true
                },
                completionResolve: true,
                format: true,
                documentHighlights: true,
                signatureHelp: false
            }
        });

    // Register the editor with the language provider
    provider.registerEditor(editor);
    // document.getElementById('editorControllerTypescript').style.display = 'block'
    
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