<script setup lang="ts">
import { useLanguageStore, useSessionStore, session } from '@/stores';
const languageStore: any = useLanguageStore();
const sessionStore: any = useSessionStore()
// console.log(languageStore.default.application, languageStore.language)

function onClickLanguage (e: Event) {
  e.stopPropagation();
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  console.log(target.innerText);
  languageStore.change(target.innerText);
  sessionStore.setLanguage(target.innerText)
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
                <span class="icon has-update-mark"><i class="mdi mdi-menu"></i></span>
                <span>{{ languageStore.default.application.Notifications }}</span>
                <span class="icon">
                <i class="mdi mdi-chevron-down"></i>
              </span>
              </a>
              <div class="navbar-dropdown">
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
            <div class="navbar-item has-dropdown has-dropdown-with-icons has-divider has-user-avatar is-hoverable">
              <a class="navbar-link is-arrowless">
                <div class="is-user-avatar">
                  <img src="https://avatars.dicebear.com/v2/initials/jose-eduardo.svg" :alt="session.user.name">
                </div>
                <div class="is-user-name"><span>{{ session.user.name }}</span></div>
                <span class="icon"><i class="mdi mdi-chevron-down"></i></span>
              </a>
              <div class="navbar-dropdown">
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