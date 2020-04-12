<template>
  <v-layout row justify-center>
    <v-dialog v-model="visibility" transition="dialog-bottom-transition">
      <!-- <template v-slot:activator="{ on }">
        <v-btn color="primary" small v-on="on">Settings</v-btn>
      </template>-->

      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="visibility = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>About</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-toolbar-items>
            <v-btn dark flat @click="visibility = false">Save</v-btn>
          </v-toolbar-items> -->
        </v-toolbar>

        <div class="about">
          <h1>CoderPlay</h1>
          <h3>Designed and developed by Ramin Bateni Parvar</h3>
        </div>

      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script <script lang="ts">
import Vue from 'vue';
// import { mapState } from 'vuex';
// import {
//     appConfigStore,
//     Defaults,
//     IAppConf,
//     ReadyAppConfig,
// } from '../appConfig';
import { aboutTypes } from '../store/types';

export default Vue.extend({
    components: {},
    props: {},
    created() {
        // debugger
    },
    watch: {
       
    },
    computed: {
        visibility: {
            get(): boolean {
                return this.$store.state.about.dialog.visibility;
            },
            set(val: boolean) {
                this.$store.commit(aboutTypes.MutationTypes.closeAbout);
            },
        },
    },
    methods: {},
});
</script>
