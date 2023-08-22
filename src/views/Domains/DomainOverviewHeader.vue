<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';
import { EntitySchema } from '../../database/EntitySchema';
import { useDomainOverviewStore } from '@/stores';

const domainOverviewStore = useDomainOverviewStore();

defineProps<{
  appName: RouteRecordName | null | undefined,
  icon: string,
  store: any,
  entities: EntitySchema[],
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
                <small>The</small> <strong>{{ store.record.name }}</strong> <small>Domain</small>. <br />
                <small>Data Entities:</small> <strong>{{ entities.map(r => r.name).join(', ') }}</strong><!-- <small>Domain</small> <small>31m</small> -->
                <br>
                {{ store.record.description }}
              </p>
            </div>
          </div>
        </article>
      </div>
</template>