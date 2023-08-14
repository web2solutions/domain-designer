<script setup lang="ts">
import { useLanguageStore } from '@/stores';
import router from '@/router';
const languageStore = useLanguageStore();
</script>

<template>
    <aside class="aside is-placed-left is-expanded">
        <div class="aside-tools has-icon">          
          <div class="aside-tools-label">
            <router-link to="/">
              <img src="/img/quix.svg" alt="QuiXSales" height="30" />
            </router-link>
          </div>
        </div>
        <div class="menu is-menu-main">
          <p class="menu-label">{{ languageStore.default.application.Applications }}</p>
          
          <ul class="menu-list">
            <template v-for="route in router.options.routes" :key="route.path">
              <template v-if="route.name !== 'wildcard'">
                <li v-if="route.children">
                  <!-- <p class="menu-label">{{ route.name }}</p> -->
                  <a class="has-icon has-dropdown-icon">
                    <span class="icon"><i :class="'mdi ' + (route.props as any).icon"></i></span>
                    <span class="menu-item-label">{{ route.name }}</span>
                    <div class="dropdown-icon">
                      <span class="icon"><i class="mdi mdi-plus"></i></span>
                    </div>
                  </a>
                  <ul>
                    <template v-for="cCoute in route.children" :key="cCoute.name">
                      <li v-if="cCoute.path.indexOf(':id') < 0">
                        <router-link :to="route.path + '/' + cCoute.path" class="has-icon">
                          <span class="icon"><i :class="'mdi ' + (cCoute.props as any).icon"></i></span>
                          <span class="menu-item-label">{{ cCoute.name }}</span>
                        </router-link>
                      </li>
                    </template>
                  </ul>
                </li>
                <li v-else>
                  <router-link :to="route.path" class="has-icon">
                    <span class="icon"><i :class="'mdi ' + (route.props as any).icon"></i></span>
                    <span class="menu-item-label">{{ route.name }}</span>
                  </router-link>
                </li>
              </template>
            </template>
          </ul>
          
          <!-- <p class="menu-label">Examples</p>
          <ul class="menu-list">
            <li>
              <a href="tables.html" class="has-icon">
                <span class="icon has-update-mark"><i class="mdi mdi-table"></i></span>
                <span class="menu-item-label">Tables</span>
              </a>
            </li>
            <li>
              <a href="forms.html" class="has-icon">
                <span class="icon"><i class="mdi mdi-square-edit-outline"></i></span>
                <span class="menu-item-label">Forms</span>
              </a>
            </li>
            <li>
              <a href="profile.html" class="has-icon">
                <span class="icon"><i class="mdi mdi-account-circle"></i></span>
                <span class="menu-item-label">Profile</span>
              </a>
            </li>
            <li>
              <a class="has-icon has-dropdown-icon">
                <span class="icon"><i class="mdi mdi-view-list"></i></span>
                <span class="menu-item-label">Submenus</span>
                <div class="dropdown-icon">
                  <span class="icon"><i class="mdi mdi-plus"></i></span>
                </div>
              </a>
              <ul>
                <li>
                  <a href="#void">
                    <span>Sub-item One</span>
                  </a>
                </li>
                <li>
                  <a href="#void">
                    <span>Sub-item Two</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <p class="menu-label">About</p>
          <ul class="menu-list">
            <li>
              <a href="https://github.com/vikdiesel/admin-one-bulma-dashboard" target="_blank" class="has-icon">
                <span class="icon"><i class="mdi mdi-github-circle"></i></span>
                <span class="menu-item-label">GitHub</span>
              </a>
            </li>
            <li>
              <a href="https://justboil.me/bulma-admin-template/free-html-dashboard/" class="has-icon">
                <span class="icon"><i class="mdi mdi-help-circle"></i></span>
                <span class="menu-item-label">About</span>
              </a>
            </li>
          </ul> -->
        </div>
      </aside>
</template>
