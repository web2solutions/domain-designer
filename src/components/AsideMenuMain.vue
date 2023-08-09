<script setup lang="ts">

</script>

<template>
    <aside class="aside is-placed-left is-expanded">
        <div class="aside-tools">
          <div class="aside-tools-label">
            <span><b>QuiX</b> ERP</span>
          </div>
        </div>
        <div class="menu is-menu-main">
          <p class="menu-label">General</p>
          <ul class="menu-list">
            <li>
              <router-link to="/" class="has-icon">
                <span class="icon"><i class="mdi mdi-desktop-mac"></i></span>
                <span class="menu-item-label">Dashboard</span>
              </router-link>
            </li>
            <li>
              <a class="has-icon has-dropdown-icon">
                <span class="icon"><i class="mdi mdi-view-list"></i></span>
                <span class="menu-item-label">Domain Designer</span>
                <div class="dropdown-icon">
                  <span class="icon"><i class="mdi mdi-plus"></i></span>
                </div>
              </a>
              <ul>
                <li>
                  <router-link to="/domain-new" class="has-icon">
                    <span class="icon"><i class="mdi mdi-table"></i></span>
                    <span class="menu-item-label">New Domain</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/domains" class="has-icon">
                    <span class="icon"><i class="mdi mdi-table"></i></span>
                    <span class="menu-item-label">List Domains</span>
                  </router-link>
                </li>
              </ul>
            </li>
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
