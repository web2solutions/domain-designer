<script setup lang="ts">
import { ref, onMounted,  watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import YAML from 'yaml'
import { OpenAPIV3 } from "openapi-types";
import router from '@/router';
import {
  useEntitiesStore,
  useAlertStore,
  useSchemasStore
} from '@/stores';
import { validateAPIInfo, validateAPITag } from '../../components/OAS';

const route = useRoute();
const alertStore = useAlertStore();

const schemaStore = useSchemasStore();
const uploaderInput = ref({} as HTMLInputElement);
const displayProgress = ref(false);

const schemas = ref({} as OpenAPIV3.SchemaObject)

let editor: any;

async function save () {
  try {
    const spec: string = editor.session.getValue();
    const document: OpenAPIV3.Document = YAML.parse(spec);
    
    if (document == null) {
      return;
    }
    if (isValid(document)) {
      const { 
        info, 
        externalDocs, 
        servers,
        tags, 
        paths,
        components,
      } = document;
      
      
      console.log({ 
        info, 
        externalDocs, 
        servers,
        tags, 
        paths,
        components,
      })

      //const { schemas } = components || {};
      console.log(components?.schemas)
      if(components?.schemas) {
        
        for(const schemaName of Object.keys(components.schemas)) {
          const schema = components.schemas[schemaName];
          console.log(schemaName, schema)
          await schemaStore.create({
            name: schemaName,
            spec: schema,
          })
        }

        goToMainView();
      }
      
      // schemas.value = components?.schemas || {};
      // console.log(schemas.value)
    }
  } catch (error) {
    console.log(error)
  }
}

function checkSemVersion(versionString: string): boolean {
  const versionNumbers: string[] = versionString.toString().split('.');
  for(const num of versionNumbers) {
    // console.log(num, Number.isNaN(+num))
    if(Number.isNaN(+num)) {
      throw new Error('Version string must be composed by numbers');
    }
  }
  return true;
}

function isSupportedVersion (openapi: string): boolean {
  const versionNumbers: string[] = openapi.toString().split('.');
  for(const num of versionNumbers) {
    console.log(num, Number.isNaN(+num))
    if(Number.isNaN(+num)) {
      throw new Error('Version string must be composed by numbers');
    }
  }
  const major: number = +(versionNumbers[0] || 0);
  if( major < 3) {
    throw new Error('Currently we only support the version 3 of the specification.');
  }
  return true
}

function checkAPIInfo(document: OpenAPIV3.Document): void {
  const info: OpenAPIV3.InfoObject = document.info;
  if(!validateAPIInfo(info)) {
    console.log(validateAPIInfo.errors)
    if(validateAPIInfo.errors) {
      throw new Error('Invalid Info Object: ' + validateAPIInfo.errors?.map((e: any) => e.message).join(', '));
    }
  }
  checkSemVersion(info.version);
}

function checkAPITags(document: OpenAPIV3.Document): void {
  if(document.tags?.length) {
    for(const tag of document.tags) {
      if (!validateAPITag(tag)) {
        if (validateAPITag.errors) {
          throw new Error('Invalid Tag Object: ' + validateAPITag.errors?.map((e: any) => e.message).join(', '));
        }
      }
    }
  }
}

function checkAPIPaths(document: OpenAPIV3.Document): void {
  if(!document.paths) {
    throw new Error('The API Paths Object is required');
  }
  if(typeof document.paths === 'object') {
    for (const url in document.paths) {
      console.log(url)
      for(const verb in document.paths[url]) {
        if(document.paths[url]) {
          const endPoint = (document.paths[url] || {})[verb as OpenAPIV3.HttpMethods];
          console.log(endPoint)
        }
      }
    }
  }
}

function isValid (document: OpenAPIV3.Document): boolean {
  const openapi: string = document.openapi;
  checkSemVersion(openapi);
  isSupportedVersion(openapi);
  checkAPIInfo(document);
  checkAPITags(document);
  checkAPIPaths(document);
  return true;
}

function editorOnChange () {
  try {
    const spec: string = editor.session.getValue();
    const document: OpenAPIV3.Document<{}> = YAML.parse(spec);
    console.log(document)
    if (document == null) {
      schemas.value = {};
      return;
    }
    if (isValid(document)) {
      const { 
        info, 
        externalDocs, 
        servers,
        tags, 
        paths,
        components,
      } = document;
      
      
      console.log({ 
        info, 
        externalDocs, 
        servers,
        tags, 
        paths,
        components,
      })


      console.log(components?.schemas)
      schemas.value = components?.schemas || {};
      console.log(schemas.value)
    }
    
  } catch (error: any) {
    alertStore.error(error.message);
  }
}

function triggerUploader () {
  console.log(uploaderInput.value);
  if(uploaderInput.value) {
    uploaderInput.value.click();
    
  }
  // (document.getElementById('oas_uploader') as HTMLInputElement).click();
}


function selectFile(event: Event) {
  editor.session.setValue('');
  displayProgress.value = true;
  const input = event.target as HTMLInputElement;
  console.log(input.files);
  const file = (input.files as FileList)[0];
  console.log(file);
  if(file) {
    
    alertStore.info(`Reading the content of the file ${file.name}`);
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = () => { 
      editor.session.setValue(reader.result as string);
      input.value = '';
      displayProgress.value = false;
    };
    reader.onerror = (evt) => {
      console.log("error reading file", evt);
      input.value = '';
      displayProgress.value = false;
    };
  } else {
    displayProgress.value = true;
  }
  // input.files
}

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>();

watch(
  () => route.params.id,
  async id => {    
    if(!id) {
        // 
    }
  }
)

onMounted(async () => {

  if(document.getElementById('editorImporter')) {
        
        (document.getElementById('editorImporter') as HTMLElement).textContent = '# paste your OAS code here or upload your file clicking at the upload button in the right top bar.';
        ace.require("ace/ext/language_tools");
        editor = ace.edit('editorImporter');
        editor.setTheme("ace/theme/textmate");
        editor.session.setMode("ace/mode/yaml");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });

        editor.on("change", function(e: Event) {
          if (editor.curOp && editor.curOp.command.name) { 
            console.log("user change");
          }
          else {
            console.log("other change");
          }
          editorOnChange();
        })


        let provider = LanguageProvider.fromCdn("https://cdn.jsdelivr.net/npm/ace-linters/build");

        // Register the editor with the language provider
        provider.registerEditor(editor);
        // document.getElementById('editorImporter').style.display = 'block'
    }

});

async function goToMainView() {
  await router.push('/infrastructure/schemas/list');
}


</script>

<template>
  <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <span class="icon"><i class="mdi mdi-xml"></i></span>
          Code Editor - Import OAS API
        </p>
        <p class="card-header-icon">
          <input 
            type="file" 
            ref="uploaderInput" 
            class="hide" 
            accept=".yaml,.yml" 
            @change="selectFile($event)"
          />
          <button 
            @click="triggerUploader()"
            class="button is-small">
            <span class="icon"><i class="mdi mdi-upload"></i></span>
          </button>
          <span class="icon"></span>
          <a 
            class="button is-small is-primary"
            @click="save()"
          >
          <span class="icon"><i class="mdi mdi-content-save-all"></i></span>
          </a>
          
          <a 
            class="button is-small is-danger"
            @click="goToMainView()"
          >
            <span class="icon"><i class="mdi mdi-close-circle"></i></span>
          </a>
        </p>
      </header>
      <div class="card-content">
        <progress v-if="displayProgress" class="progress is-small is-light" max="100">30%</progress>
        <div class="columns">
          <div class="column ide">
            <div id="editorImporter">
              
            </div>
          </div>
          <div class="column">
            <!-- -->
            <div class="card has-table">
              <header class="card-header">
                <p class="card-header-title">
                  <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                  Schema Components
                </p>
                <!-- <a href="#" class="card-header-icon">
                  <span class="icon"><i class="mdi mdi-reload"></i></span>
                </a> -->
              </header>
              <div class="card-content">
                <div class="b-table has-pagination">
                  <div class="table-wrapper has-mobile-cards">
                    <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
                      <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="schemaName in Object.keys(schemas).sort()" :key="schemaName">
                        <td class="is-image-cell">
                          <div class="image">
                            <img :src="`https://avatars.dicebear.com/v2/initials/${schemaName}.svg`" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">{{ schemaName }}</td>
                      </tr>
                      
                      </tbody>
                    </table>
                  </div>
                  <div class="notification">
                    
                  </div>
                </div>
              </div>
            </div>
            <!-- -->
          </div>
        </div>
        
      </div>
  </div>
</template>
<style scoped>
.hide {display: none;}
.ide{
  height: 68vh; 
  overflow: hidden;
  z-index: 1;
}

#editorImporter { 
  height: 100%;
  left: 3px;
  right: 5px;
  top: -10px;
}
</style>