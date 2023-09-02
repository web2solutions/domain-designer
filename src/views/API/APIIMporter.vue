<script setup lang="ts">
import { ref, onMounted,  watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useRoute } from 'vue-router';
import YAML from 'yaml'
import { OpenAPIV3 } from "openapi-types";
import router from '@/router';
import { useEntitiesStore, useDomainsStore, useAlertStore, usePropertiesStore } from '@/stores';
import { validateAPIInfo, validateAPITag } from '../../components/OAS';

const route = useRoute();
const alertStore = useAlertStore();
const entityStore = useEntitiesStore();
const uploaderInput = ref({} as HTMLInputElement);
const displayProgress = ref(false)

let editor: any;

function save () {
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

      const { schemas } = components || {};
      console.log(schemas)
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

      const { schemas } = components || {};
      console.log(schemas)
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

  if(entityStore.goTo === '') {
    entityStore.goTo = `${route.matched[0].path}/list`;
  }

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
  await router.push(entityStore.goTo);
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
                  Schemas
                </p>
                <a href="#" class="card-header-icon">
                  <span class="icon"><i class="mdi mdi-reload"></i></span>
                </a>
              </header>
              <div class="card-content">
                <div class="b-table has-pagination">
                  <div class="table-wrapper has-mobile-cards">
                    <table class="table is-fullwidth is-striped is-hoverable is-fullwidth">
                      <thead>
                      <tr>
                        <th class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </th>
                        <th></th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>City</th>
                        <th>Progress</th>
                        <th>Created</th>
                        <th></th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/rebecca-bauch.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Rebecca Bauch</td>
                        <td data-label="Company">Daugherty-Daniel</td>
                        <td data-label="City">South Cory</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="79">79</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Oct 25, 2020">Oct 25, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/felicita-yundt.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Felicita Yundt</td>
                        <td data-label="Company">Johns-Weissnat</td>
                        <td data-label="City">East Ariel</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="67">67</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Jan 8, 2020">Jan 8, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/mr-larry-satterfield-v.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Mr. Larry Satterfield V</td>
                        <td data-label="Company">Hyatt Ltd</td>
                        <td data-label="City">Windlerburgh</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="16">16</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Dec 18, 2020">Dec 18, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/mr-broderick-kub.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Mr. Broderick Kub</td>
                        <td data-label="Company">Kshlerin, Bauch and Ernser</td>
                        <td data-label="City">New Kirstenport</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="71">71</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Sep 13, 2020">Sep 13, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/barry-weber.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Barry Weber</td>
                        <td data-label="Company">Schulist, Mosciski and Heidenreich</td>
                        <td data-label="City">East Violettestad</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="80">80</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Jul 24, 2020">Jul 24, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/bert-kautzer-md.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Bert Kautzer MD</td>
                        <td data-label="Company">Gerhold and Sons</td>
                        <td data-label="City">Mayeport</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="62">62</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Mar 30, 2020">Mar 30, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/lonzo-steuber.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Lonzo Steuber</td>
                        <td data-label="Company">Skiles Ltd</td>
                        <td data-label="City">Marilouville</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="17">17</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Feb 12, 2020">Feb 12, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/jonathon-hahn.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Jonathon Hahn</td>
                        <td data-label="Company">Flatley Ltd</td>
                        <td data-label="City">Billiemouth</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="74">74</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Dec 30, 2020">Dec 30, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/ryley-wuckert.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Ryley Wuckert</td>
                        <td data-label="Company">Heller-Little</td>
                        <td data-label="City">Emeraldtown</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="54">54</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Jun 28, 2020">Jun 28, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="is-checkbox-cell">
                          <label class="b-checkbox checkbox">
                            <input type="checkbox" value="false">
                            <span class="check"></span>
                          </label>
                        </td>
                        <td class="is-image-cell">
                          <div class="image">
                            <img src="https://avatars.dicebear.com/v2/initials/sienna-hayes.svg" class="is-rounded">
                          </div>
                        </td>
                        <td data-label="Name">Sienna Hayes</td>
                        <td data-label="Company">Conn, Jerde and Douglas</td>
                        <td data-label="City">Jonathanfort</td>
                        <td data-label="Progress" class="is-progress-cell">
                          <progress max="100" class="progress is-small is-primary" value="55">55</progress>
                        </td>
                        <td data-label="Created">
                          <small class="has-text-grey is-abbr-like" title="Mar 7, 2020">Mar 7, 2020</small>
                        </td>
                        <td class="is-actions-cell">
                          <div class="buttons is-right">
                            <button class="button is-small is-primary" type="button">
                              <span class="icon"><i class="mdi mdi-eye"></i></span>
                            </button>
                            <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                              <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="notification">
                    <div class="level">
                      <div class="level-left">
                        <div class="level-item">
                          <div class="buttons has-addons">
                            <button type="button" class="button is-active">1</button>
                            <button type="button" class="button">2</button>
                            <button type="button" class="button">3</button>
                          </div>
                        </div>
                      </div>
                      <div class="level-right">
                        <div class="level-item">
                          <small>Page 1 of 3</small>
                        </div>
                      </div>
                    </div>
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