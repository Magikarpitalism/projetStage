<template>
    <div class="tables-basic">
      <b-breadcrumb>
        <b-breadcrumb-item>YOU ARE HERE</b-breadcrumb-item>
        <b-breadcrumb-item active>Tables Basic</b-breadcrumb-item>
      </b-breadcrumb>
      <h2 class="page-title">Tables - <span class="fw-semi-bold">Static</span></h2>
      <b-row>
        <b-col>
          <Widget
            title="<h5>Table <span class='fw-semi-bold'>Styles</span></h5>"
            customHeader settings close
          >
            <div class="table-resposive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Siret</th>
                    <th>Email</th>
                    <th class="hidden-sm-down">Phone</th>
                    <th class="hidden-sm-down">Date</th>
                    <th class="hidden-sm-down">Size</th>
                    <th class="hidden-sm-down">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in tableStyles" :key="row.id">
                    <td>{{row.id}}</td>
                    <td>
                      <img class="img-rounded" :src="row.picture" alt="" height="50" />
                    </td>
                    <td>
                      {{row.description}}
                      <div v-if="row.label">
                        <b-badge :variant="row.label.colorClass">{{row.label.text}}</b-badge>
                      </div>
                    </td>
                    <td>
                      <p class="mb-0">
                        <small>
                          <span class="fw-semi-bold">Type:</span>
                          <span class="text-muted">&nbsp; {{row.info.type}}</span>
                        </small>
                      </p>
                      <p>
                        <small>
                          <span class="fw-semi-bold">Dimensions:</span>
                          <span class="text-muted">&nbsp; {{row.info.dimensions}}</span>
                        </small>
                      </p>
                    </td>
                    <td class="text-muted">
                      {{parseDate(row.date)}}
                    </td>
                    <td class="text-muted">
                      {{row.size}}
                    </td>
                    <td class="width-150">
                      <b-progress
                        :variant="row.progress.colorClass" :value="row.progress.percent" :max="100"
                        class="progress-sm mb-xs"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="clearfix">
              <div class="float-right">
                <b-button variant="default" class="mr-3" size="sm">Send to...</b-button>
                <b-dropdown variant="inverse" class="mr-xs" size="sm" text="Clear" right>
                  <b-dropdown-item>Clear</b-dropdown-item>
                  <b-dropdown-item>Move ...</b-dropdown-item>
                  <b-dropdown-item>Something else here</b-dropdown-item>
                  <b-dropdown-divider />
                  <b-dropdown-item>Separated link</b-dropdown-item>
                </b-dropdown>
              </div>
              <p>Basic table with styled content</p>
            </div>
          </Widget>
        </b-col>
      </b-row>
    </div>
  </template>
  
  <script>
  import Vue from 'vue';
  import Widget from '@/components/Widget/Widget';
  
  
  export default {
    name: 'Tables',
    components: { Widget},
    data() {
      return {
        tableStyles: [
          {
            id: 1,
            description: 'Palo Alto',
            info: {
              type: 'JPEG',
              dimensions: '200x150',
            },
            date: new Date('September 14, 2018'),
            size: '45.6 KB',
            progress: {
              percent: 29,
              colorClass: 'success',
            },
          },
          {
            id: 2,
            description: 'The Sky',
            info: {
              type: 'PSD',
              dimensions: '2400x1455',
            },
            date: new Date('November 14, 2018'),
            size: '15.3 MB',
            progress: {
              percent: 33,
              colorClass: 'warning',
            },
          },
          {
            id: 3,
            description: 'Down the road',
            label: {
              colorClass: 'danger',
              text: 'INFO!',
            },
            info: {
              type: 'JPEG',
              dimensions: '200x150',
            },
            date: new Date('September 14, 2018'),
            size: '49.0 KB',
            progress: {
              percent: 38,
              colorClass: 'inverse',
            },
          },
          {
            id: 4,
            description: 'The Edge',
            info: {
              type: 'PNG',
              dimensions: '210x160',
            },
            date: new Date('September 15, 2018'),
            size: '69.1 KB',
            progress: {
              percent: 17,
              colorClass: 'danger',
            },
          },
          {
            id: 5,
            description: 'Fortress',
            info: {
              type: 'JPEG',
              dimensions: '1452x1320',
            },
            date: new Date('October 1, 2018'),
            size: '2.3 MB',
            progress: {
              percent: 41,
              colorClass: 'primary',
            },
          },
        ],
      };
    },
    methods: {
      parseDate(date) {
        const dateSet = date.toDateString().split(' ');
        return `${date.toLocaleString('en-us', { month: 'long' })} ${dateSet[2]}, ${dateSet[3]}`;
      },
    },
  };
  </script>
  
  <style lang="scss" scoped />
  