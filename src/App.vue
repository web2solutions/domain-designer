<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { NavBarMain, AsideMenuMain, FooterMain } from '@/components/Application/index';

onMounted(async () => {

/* Aside: submenus toggle */
  Array.from(document.getElementsByClassName('menu is-menu-main')).forEach(function (el) {
    Array.from(el.getElementsByClassName('has-dropdown-icon')).forEach(function (elA) {
      elA.addEventListener('click', function (e) {
        const dropdownIcon = (e.currentTarget as HTMLElement)?.getElementsByClassName('dropdown-icon')[0].getElementsByClassName('mdi')[0];
        const el = (e.currentTarget as HTMLElement);
        const parent = el.parentNode as HTMLElement;
        if(parent) {
          parent.classList.toggle('is-active');
        }
        
        dropdownIcon.classList.toggle('mdi-plus');
        dropdownIcon.classList.toggle('mdi-minus');
      });
    });
  });
  /* Aside Mobile toggle */

  Array.from(document.getElementsByClassName('jb-aside-mobile-toggle')).forEach(function (el) {
    el.addEventListener('click', function (e) {
      const dropdownIcon = (e.currentTarget as HTMLElement).getElementsByClassName('icon')[0].getElementsByClassName('mdi')[0];
      document.documentElement.classList.toggle('has-aside-mobile-expanded');
      dropdownIcon.classList.toggle('mdi-forwardburger');
      dropdownIcon.classList.toggle('mdi-backburger');
    });
  });
  /* NavBar menu mobile toggle */

  Array.from(document.getElementsByClassName('jb-navbar-menu-toggle')).forEach(function (el) {
    el.addEventListener('click', function (e) {
      const dropdownIcon = (e.currentTarget as HTMLElement).getElementsByClassName('icon')[0].getElementsByClassName('mdi')[0];
      const el = (e.currentTarget as HTMLElement);
      const dt = el.getAttribute('data-target') || '';
      const elTarget = document.getElementById(dt);
      if(elTarget != null) {
        elTarget.classList.toggle('is-active');
      }
      
      dropdownIcon.classList.toggle('mdi-dots-vertical');
      dropdownIcon.classList.toggle('mdi-close');
    });
  });
});

</script>
<template>
  <NavBarMain />
  <AsideMenuMain />  
  <RouterView />
  <FooterMain />
</template>