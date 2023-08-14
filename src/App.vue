<script setup lang="ts">
import { onMounted } from 'vue';
// import router from '@/router';
import { RouterView } from 'vue-router'
import { NavBarMain, AsideMenuMain, FooterMain } from '@/components/Application/index';


// const route = ref(router.currentRoute)

onMounted(async () => {

/* Aside: submenus toggle */
  Array.from(document.getElementsByClassName('menu is-menu-main')).forEach(function (el) {
    Array.from(el.getElementsByClassName('has-dropdown-icon')).forEach(function (elA) {
      elA.addEventListener('click', function (e) {
        const dropdownIcon = (e.currentTarget as HTMLElement)?.getElementsByClassName('dropdown-icon')[0].getElementsByClassName('mdi')[0];
        (e.currentTarget as HTMLElement).parentNode.classList.toggle('is-active');
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
  /* Modal: open */

  Array.from(document.getElementsByClassName('jb-modal')).forEach(function (el) {
    el.addEventListener('click', function (e) {
      const modalTarget = (e.currentTarget as HTMLElement).getAttribute('data-target') || '';
      const el = document.getElementById(modalTarget);
      if(el != null) {
        el.classList.add('is-active');
      }
      document.documentElement.classList.add('is-clipped');
    });
  });
  /* Modal: close */

  Array.from(document.getElementsByClassName('jb-modal-close')).forEach(function (el) {
    el.addEventListener('click', function (e) {
      (e.currentTarget as HTMLElement).closest('.modal').classList.remove('is-active');
      document.documentElement.classList.remove('is-clipped');
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
@/database/IDX