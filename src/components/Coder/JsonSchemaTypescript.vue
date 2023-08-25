<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { openapiSchemaToJsonSchema }  from '@openapi-contrib/openapi-schema-to-json-schema';
import type { EntitySchema } from '@/database/EntitySchema';
import { buildEntitySpec } from '../utils';

console.log(openapiSchemaToJsonSchema)
const props = defineProps<{ 
    entity: EntitySchema;
    properties: any[]
}>()

onMounted(() => {

    const schema = buildEntitySpec(props.entity.name, props.properties);
    
    console.log(schema[props.entity.name]);

    (document.getElementById('editorControllerTypescript') as HTMLElement).textContent = JSON.stringify(openapiSchemaToJsonSchema(schema), null, '\t');
    ace.require("ace/ext/language_tools");
    const editor = ace.edit('editorControllerTypescript');
    editor.setTheme("ace/theme/tomorrow");
    editor.session.setMode("ace/mode/json");
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
    position: absolute;
    top: 40px;
    right: 5px;
    left: 5px;
    height: 78vh;
}
</style>