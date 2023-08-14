<script setup lang="ts">

import { onMounted } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { BreadCrumbMain } from '@/components/Application/index';
import { formatCurrency } from '@/components/CRUD/utils';
import { useLanguageStore } from '@/stores';
import { useDomainsStore } from '@/stores/domains.store';

const languageStore: any = useLanguageStore();

defineProps<{
  moduleName: RouteRecordName | null | undefined,
  icon: string,
}>()

onMounted(async() => {

  const domainStore = useDomainsStore();
  await domainStore.sync();

  const randomChartData = function randomChartData(n: number) {
      const data = [];

      for (let i = 0; i < n; i++) {
        data.push(Math.round(Math.random() * 200));
      }

      return data;
    };

    const chartColors = {
      "default": {
        primary: '#00D1B2',
        info: '#209CEE',
        danger: '#FF3860'
      }
    };
    const hEl: HTMLElement | null = document?.getElementById('big-line-chart')
    const canvas: HTMLCanvasElement | null = hEl ? hEl as HTMLCanvasElement : null;
    const ctx: CanvasRenderingContext2D | null | undefined = canvas?.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          fill: false,
          borderColor: chartColors["default"].primary,
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: chartColors["default"].primary,
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: chartColors["default"].primary,
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: randomChartData(9)
        }, {
          fill: false,
          borderColor: chartColors["default"].info,
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: chartColors["default"].info,
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: chartColors["default"].info,
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: randomChartData(9)
        }, {
          fill: false,
          borderColor: chartColors["default"].danger,
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: chartColors["default"].danger,
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: chartColors["default"].danger,
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: randomChartData(9)
        }],
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09']
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        responsive: true,
        tooltips: {
          backgroundColor: '#f5f5f5',
          titleFontColor: '#333',
          bodyFontColor: '#666',
          bodySpacing: 4,
          xPadding: 12,
          mode: 'nearest',
          intersect: 0,
          position: 'nearest'
        },
        scales: {
          yAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(29,140,248,0.0)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              padding: 20,
              fontColor: '#9a9a9a'
            }
          }],
          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(225,78,202,0.1)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              padding: 20,
              fontColor: '#9a9a9a'
            }
          }]
        }
      }
    });
});
</script>

<template>
      <BreadCrumbMain v-bind:moduleName="moduleName" childName="" />
      <section class="section is-main-section">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="card tile is-child">
              <div class="card-content">
                <div class="level is-mobile">
                  <div class="level-item">
                    <div class="is-widget-label"><h3 class="subtitle is-spaced">
                      {{ languageStore.default.dashboard.Customers }}
                    </h3>
                      <h1 class="title">
                        512
                      </h1>
                    </div>
                  </div>
                  <div class="level-item has-widget-icon">
                    <div class="is-widget-icon"><span class="icon has-text-primary is-large"><i
                        class="mdi mdi-account-multiple mdi-48px"></i></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="card tile is-child">
              <div class="card-content">
                <div class="level is-mobile">
                  <div class="level-item">
                    <div class="is-widget-label"><h3 class="subtitle is-spaced">
                      {{ languageStore.default.dashboard.Sales }}
                    </h3>
                      <h1 class="title">
                        
                        {{ formatCurrency(7770) }}
                      </h1>
                    </div>
                  </div>
                  <div class="level-item has-widget-icon">
                    <div class="is-widget-icon"><span class="icon has-text-info is-large"><i
                        class="mdi mdi-cart-outline mdi-48px"></i></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="card tile is-child">
              <div class="card-content">
                <div class="level is-mobile">
                  <div class="level-item">
                    <div class="is-widget-label"><h3 class="subtitle is-spaced">
                      {{ languageStore.default.dashboard.Performance }}
                    </h3>
                      <h1 class="title">
                        256%
                      </h1>
                    </div>
                  </div>
                  <div class="level-item has-widget-icon">
                    <div class="is-widget-icon"><span class="icon has-text-success is-large"><i
                        class="mdi mdi-finance mdi-48px"></i></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="card tile is-child">
              <div class="card-content">
                <div class="level is-mobile">
                  <div class="level-item">
                    <div class="is-widget-label"><h3 class="subtitle is-spaced">
                      {{ languageStore.default.dashboard.Customers }}
                    </h3>
                      <h1 class="title">
                        512
                      </h1>
                    </div>
                  </div>
                  <div class="level-item has-widget-icon">
                    <div class="is-widget-icon"><span class="icon has-text-primary is-large"><i
                        class="mdi mdi-account-multiple mdi-48px"></i></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="card tile is-child">
              <div class="card-content">
                <div class="level is-mobile">
                  <div class="level-item">
                    <div class="is-widget-label"><h3 class="subtitle is-spaced">
                      {{ languageStore.default.dashboard.Sales }}
                    </h3>
                      <h1 class="title">
                        {{ formatCurrency(8609) }}
                      </h1>
                    </div>
                  </div>
                  <div class="level-item has-widget-icon">
                    <div class="is-widget-icon"><span class="icon has-text-info is-large"><i
                        class="mdi mdi-cart-outline mdi-48px"></i></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="card tile is-child">
              <div class="card-content">
                <div class="level is-mobile">
                  <div class="level-item">
                    <div class="is-widget-label"><h3 class="subtitle is-spaced">
                      {{ languageStore.default.dashboard.Performance }}
                    </h3>
                      <h1 class="title">
                        256%
                      </h1>
                    </div>
                  </div>
                  <div class="level-item has-widget-icon">
                    <div class="is-widget-icon"><span class="icon has-text-success is-large"><i
                        class="mdi mdi-finance mdi-48px"></i></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              <span class="icon"><i class="mdi mdi-finance"></i></span>
              {{ languageStore.default.dashboard.Performance }}
            </p>
            <a href="#" class="card-header-icon">
              <span class="icon"><i class="mdi mdi-reload"></i></span>
            </a>
          </header>
          <div class="card-content">
            <div class="chart-area">
              <div style="height: 100%;">
                <div class="chartjs-size-monitor">
                  <div class="chartjs-size-monitor-expand">
                    <div></div>
                  </div>
                  <div class="chartjs-size-monitor-shrink">
                    <div></div>
                  </div>
                </div>
                <canvas id="big-line-chart" width="2992" height="1000" class="chartjs-render-monitor" style="display: block; height: 400px; width: 1197px;"></canvas>
              </div>
            </div>
          </div>
        </div>
        <!--
        <div class="card has-table has-mobile-sort-spaced">
          <header class="card-header">
            <p class="card-header-title">
              <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
              {{ languageStore.default.dashboard.Customers }}
            </p>
            <a href="#" class="card-header-icon">
              <span class="icon"><i class="mdi mdi-reload"></i></span>
            </a>
          </header>
          <div class="card-content">
            <div class="b-table has-pagination">
              <div class="table-wrapper has-mobile-cards">
                <table class="table is-fullwidth is-striped is-hoverable is-sortable is-fullwidth">
                  <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>City</th>
                    <th>Progress</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/rebecca-bauch.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Rebecca Bauch</td>
                    <td data-label="Company">Daugherty-Daniel</td>
                    <td data-label="City">South Cory</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="79">79</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Oct 25, 2020">Oct 25, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/felicita-yundt.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Felicita Yundt</td>
                    <td data-label="Company">Johns-Weissnat</td>
                    <td data-label="City">East Ariel</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="67">67</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Jan 8, 2020">Jan 8, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/mr-larry-satterfield-v.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Mr. Larry Satterfield V</td>
                    <td data-label="Company">Hyatt Ltd</td>
                    <td data-label="City">Windlerburgh</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="16">16</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Dec 18, 2020">Dec 18, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/mr-broderick-kub.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Mr. Broderick Kub</td>
                    <td data-label="Company">Kshlerin, Bauch and Ernser</td>
                    <td data-label="City">New Kirstenport</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="71">71</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Sep 13, 2020">Sep 13, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/barry-weber.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Barry Weber</td>
                    <td data-label="Company">Schulist, Mosciski and Heidenreich</td>
                    <td data-label="City">East Violettestad</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="80">80</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Jul 24, 2020">Jul 24, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/bert-kautzer-md.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Bert Kautzer MD</td>
                    <td data-label="Company">Gerhold and Sons</td>
                    <td data-label="City">Mayeport</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="62">62</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Mar 30, 2020">Mar 30, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/lonzo-steuber.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Lonzo Steuber</td>
                    <td data-label="Company">Skiles Ltd</td>
                    <td data-label="City">Marilouville</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="17">17</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Feb 12, 2020">Feb 12, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/jonathon-hahn.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Jonathon Hahn</td>
                    <td data-label="Company">Flatley Ltd</td>
                    <td data-label="City">Billiemouth</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="74">74</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Dec 30, 2020">Dec 30, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/ryley-wuckert.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Ryley Wuckert</td>
                    <td data-label="Company">Heller-Little</td>
                    <td data-label="City">Emeraldtown</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="54">54</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Jun 28, 2020">Jun 28, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="is-image-cell">
                      <div class="image">
                        <img src="https://avatars.dicebear.com/v2/initials/sienna-hayes.svg" class="is-rounded">
                      </div>
                    </td>
                    <td data-label="Name">Sienna Hayes</td>
                    <td data-label="Company">Conn, Jerde and Douglas</td>
                    <td data-label="City">Jonathanfort</td>
                    <td data-label="Progress" class="is-progress-cell">
                      <progress max="100" class="progress is-small is-primary" value="55">55</progress>
                    </td>
                    <td data-label="Created">
                      <small class="has-text-grey is-abbr-like" title="Mar 7, 2020">Mar 7, 2020</small>
                    </td>
                    <td class="is-actions-cell">
                      <div class="buttons is-right">
                        <button class="button is-small is-primary" type="button">
                          <span class="icon"><i class="mdi mdi-eye"></i></span>
                        </button>
                        <button class="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                          <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="notification">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <div class="buttons has-addons">
                        <button type="button" class="button is-active">1</button>
                        <button type="button" class="button">2</button>
                        <button type="button" class="button">3</button>
                      </div>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <small>Page 1 of 3</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        -->
      </section>
</template>