<script setup lang="ts">
import { faker } from '@faker-js/faker';
import { useLanguageStore, useSessionStore, session } from '@/stores';
const languageStore: any = useLanguageStore();
const sessionStore: any = useSessionStore();
import { domainsData } from'@/stores/domains';
import { entitiesData } from'@/stores/entities';
import type { IDomainCreateDTO } from '@/models/IDomainCreateDTO';
import { useDomainsStore } from '@/stores';
import { useEntitiesStore } from '@/stores';



const domainStore = useDomainsStore();

const entityStore = useEntitiesStore();


function createRandomDomain(): IDomainCreateDTO {
  return {
    name: faker.commerce.department(),
    description: faker.lorem.lines(2),
  };
}


function onClickLanguage (e: Event) {
  e.stopPropagation();
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  console.log(target.innerText);
  languageStore.change(target.innerText);
  sessionStore.setLanguage(target.innerText)
}

async function AddInitialData(e: any) {
  e.stopPropagation();
  e.preventDefault();
  for(const domain of domainsData) {
    await domainStore.create(domain);
  }
  for(const entity of entitiesData as any) {
    entity.domain_id = domainStore.records[0].id
    await entityStore.create(entity);
  }
}

</script>

<template>
    <nav id="navbar-main" class="navbar is-fixed-top is-dark">
        <div class="navbar-brand">
          <a class="navbar-item is-hidden-desktop jb-aside-mobile-toggle">
            <span class="icon"><i class="mdi mdi-forwardburger mdi-24px"></i></span>
          </a>
          <div class="navbar-item has-control">
            <div class="control"><input :placeholder="languageStore.default.application.searchEverywhere" class="input"></div>
          </div>
        </div>
        <div class="navbar-brand is-right">
          <a class="navbar-item is-hidden-desktop jb-navbar-menu-toggle" data-target="navbar-menu">
            <span class="icon"><i class="mdi mdi-dots-vertical"></i></span>
          </a>
        </div>
        <div class="navbar-menu fadeIn animated faster" id="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item has-dropdown has-dropdown-with-icons has-divider is-hoverable">
              <a class="navbar-link is-arrowless has-icon">
                <span class="icon has-update-mark"><i class="mdi mdi-bell"></i></span>
                <span>{{ languageStore.default.application.Notifications }}</span>
                <span class="icon">
                <i class="mdi mdi-chevron-down"></i>
              </span>
              </a>
              <div class="navbar-dropdown">
                <p class="navbar-item is-flex">
                  Notification 1 text goes here. Yesterday was another days ...
                </p>
                <hr class="navbar-divider">
                <p class="navbar-item is-flex">
                  Notification 3 text goes here. <br /> Yesterday was another days ...
                </p>
                <hr class="navbar-divider">
                <p class="navbar-item is-flex">
                  Notification 3 text goes here. <br /> Yesterday was another days ...
                </p>
                <hr class="navbar-divider">
                <p class="navbar-item is-flex">
                  Notification 4 text goes here. <br /> Yesterday was another days ...
                </p>
              </div>
            </div>
            <div class="navbar-item has-dropdown has-dropdown-with-icons has-divider has-user-avatar is-hoverable">
              <a class="navbar-link is-arrowless">
                <div class="is-user-avatar">
                  <img src="https://avatars.dicebear.com/v2/initials/jose-eduardo.svg" :alt="sessionStore.name">
                </div>
                <div class="is-user-name"><span>{{ sessionStore.name }}</span></div>
                <span class="icon"><i class="mdi mdi-chevron-down"></i></span>
              </a>
              <div class="navbar-dropdown">
                <a @click="AddInitialData($event)" 
                  class="navbar-item">
                  <span class="icon"><i class="mdi mdi-email"></i></span>
                  <span>{{ languageStore.default.application.AddInitialData }}</span>
                </a>
                <hr class="navbar-divider">
                <router-link to="/profile" class="navbar-item">
                  <span class="icon"><i class="mdi mdi-account"></i></span>
                  <span>{{ languageStore.default.application.MyProfile }}</span>
                </router-link>
                <a class="navbar-item">
                  <span class="icon"><i class="mdi mdi-settings"></i></span>
                  <span>{{ languageStore.default.application.Settings }}</span>
                </a>
                <a class="navbar-item">
                  <span class="icon"><i class="mdi mdi-email"></i></span>
                  <span>{{ languageStore.default.application.Messages }}</span>
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item">
                  <span class="icon"><i class="mdi mdi-logout"></i></span>
                  <span>{{ languageStore.default.application.LogOut }}</span>
                </a>
              </div>
            </div>
            <div class="navbar-item has-dropdown has-dropdown-with-icons has-divider is-hoverable">
              <a class="navbar-link is-arrowless has-icon">
                <span class="icon"><i class="mdi mdi-translate"></i></span>
                <span>{{ languageStore.language }}</span>
                <span class="icon">
                <i class="mdi mdi-chevron-down"></i>
              </span>
              </a>
              <div class="navbar-dropdown">
                <a @click="onClickLanguage($event)" v-for="language in languageStore.languages" :key="language" class="navbar-item">
                  <span class="icon"><i class="mdi mdi-settings"></i></span>
                  <span>{{ language }}</span>
                </a>
              </div>
            </div>
            <a href="#" title="About" class="navbar-item has-divider is-desktop-icon-only">
              <span class="icon"><i class="mdi mdi-help-circle-outline"></i></span>
              <span>About</span>
            </a>
            <a title="Log out" class="navbar-item is-desktop-icon-only">
              <span class="icon"><i class="mdi mdi-logout"></i></span>
              <span>Log out</span>
            </a>
          </div>
        </div>
      </nav>
</template>
