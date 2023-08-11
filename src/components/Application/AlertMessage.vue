<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAlertStore } from '@/stores';

const alertStore = useAlertStore();
const { alert, show } = storeToRefs(alertStore);
</script>

<template>
    <div v-if="show" :class="alert.type">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <span class="icon"><i class="mdi mdi-buffer default"></i></span>
                <b>{{alert.message}}</b>
              </div>
            </div>
          </div>
          <div class="level-right">
            <button type="button"  @click="alertStore.clear()" class="button is-small is-white jb-notification-dismiss">Dismiss</button>
          </div>
        </div>
      </div>
</template>
