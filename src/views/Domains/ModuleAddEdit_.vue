<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';
import { AlertMessage } from '@/components/Application/';
// import { useAlertStore } from '@/stores';
// const alertStore = useAlertStore();
// alertStore.error('Test');

defineProps<{
  childName: RouteRecordName | null | undefined,
  icon: string,
}>()
</script>

<template>
  <AlertMessage />
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <span class="icon"><i :class="'mdi ' + icon"></i></span>
        {{ childName  }}
      </p>
    </header>
    <div class="card-content">
      <form method="get">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">From</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input class="input" type="text" placeholder="Name">
                <span class="icon is-small is-left"><i class="mdi mdi-account"></i></span>
              </p>
            </div>
            <div class="field">
              <p class="control is-expanded has-icons-left has-icons-right">
                <input class="input is-success" type="email" placeholder="Email" value="alex@smith.com">
                <span class="icon is-small is-left"><i class="mdi mdi-mail"></i></span>
                <span class="icon is-small is-right"><i class="mdi mdi-check"></i></span>
              </p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label"></div>
          <div class="field-body">
            <div class="field is-expanded">
              <div class="field has-addons">
                <p class="control">
                  <a class="button is-static">
                    +44
                  </a>
                </p>
                <p class="control is-expanded">
                  <input class="input" type="tel" placeholder="Your phone number">
                </p>
              </div>
              <p class="help">Do not enter the first zero</p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Department</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select>
                    <option>Business development</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Subject</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input is-danger" type="text" placeholder="e.g. Partnership opportunity">
              </div>
              <p class="help is-danger">
                This field is required
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Question</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <textarea class="textarea" placeholder="Explain how we can help you"></textarea>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="field is-horizontal">
          <div class="field-label">
            <!-- Left empty for spacing -->
          </div>
          <div class="field-body">
            <div class="field">
              <div class="field is-grouped">
                <div class="control">
                  <button type="submit" class="button is-primary">
                    <span>Submit</span>
                  </button>
                </div>
                <div class="control">
                  <button type="button" class="button is-primary is-outlined">
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
