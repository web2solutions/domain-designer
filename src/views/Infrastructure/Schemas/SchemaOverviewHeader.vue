<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';

defineProps<{
  appName: RouteRecordName | null | undefined,
  icon: string,
  store: any,
}>();
</script>
<template>
    <div class="box">
        <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img :src="'https://avatars.dicebear.com/v2/initials/'+store.record.name+'.svg'" :alt="store.record.name">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <small>The</small> <strong>{{ store.record.name }}</strong> <small>Schema Component</small>.
                <br>
                {{ store.record.spec?.description || '' }}
              </p>
            </div>
            <nav class="level">
              <div class="level-left">
                <a class="level-item" aria-label="reply">
                  <span class="icon is-small">
                    <i class="mdi mdi-counter" aria-hidden="true"></i>
                  </span>
                   version {{ store.record.version }}
                </a>
                <a class="level-item" aria-label="retweet">
                  <span class="icon is-small">
                    <i class="mdi mdi-cog" aria-hidden="true"></i>
                  </span>
                   {{ store.record.spec ? Object.keys(store.record.spec.properties).length : '' }} properties
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
</template>