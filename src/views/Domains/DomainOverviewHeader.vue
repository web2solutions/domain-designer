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
                <strong>{{ store.record.name }}</strong> <small>Domain</small> <!-- <small>Domain</small> <small>31m</small> -->
                <br>
                {{ store.record.description }}
              </p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a class="level-item" aria-label="reply">
                  <span class="icon is-small">
                    <i class="fas fa-reply" aria-hidden="true"></i>
                  </span>
                </a>
                <a class="level-item" aria-label="retweet">
                  <span class="icon is-small">
                    <i class="fas fa-retweet" aria-hidden="true"></i>
                  </span>
                </a>
                <a class="level-item" aria-label="like">
                  <span class="icon is-small">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
</template>