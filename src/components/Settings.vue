<template>
  <v-layout row justify-center>
    <v-dialog v-model="visibility" fullscreen hide-overlay transition="dialog-bottom-transition">
      <!-- <template v-slot:activator="{ on }">
        <v-btn color="primary" small v-on="on">Settings</v-btn>
      </template>-->

      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="visibility = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="visibility = false">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-list three-line subheader>
          <v-subheader>User Controls</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Content filtering</v-list-tile-title>
              <v-list-tile-sub-title>Set the content filtering level to restrict apps that can be downloaded</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Password</v-list-tile-title>
              <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-switch v-model="model.ui.isDarkTheme"></v-switch>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Light/Dark Theme</v-list-tile-title>
              <v-list-tile-sub-title>Switch betweeb light and dark theme.</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Notifications</v-list-tile-title>
              <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sound</v-list-tile-title>
              <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Auto-add widgets</v-list-tile-title>
              <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script <script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import {
    appConfigStore,
    Defaults,
    IAppConf,
    ReadyAppConfig,
} from '../appConfig';
import { settingsTypes } from '../store/types';
import { ISettings } from './CoderplaySolutionTypes';
// import { ipcRenderer } from 'electron';
// import fs from 'fs'

export default Vue.extend({
    components: {},
    props: {},
    created() {
        // debugger
    },
    data: () => ({
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
    }),
    watch: {
        // isDark(val:boolean){
        //     debugger
        //    this.$store.dispatch(actions.switchTheme,val);
        // 	//this.$emit("switchTheme",beDark);

        // },
        model(settingsModel: ISettings) {
            //    debugger;
            this.$store.dispatch(
                settingsTypes.ActionTypes.saveSettings,
                settingsModel
            );
        },
    },
    computed: {
        // visibility():boolean{
        //   return this.$store.state.settings.dialog.visibility;
        // },
        //  ...mapState({
        //   'isDark': (state:any) => state.settings.model.ui.isDarkTheme
        //   })
        // isDark: {
        //     get: function():boolean {return this.$store.state.settings.model.ui.isDarkTheme},
        //     set: function(value: any) {this.$store.dispatch(ActionTypes.switchTheme,value)}
        // },
        visibility: {
            get(): boolean {
                return this.$store.state.setting.dialog.visibility;
            },
            set(val: boolean) {
                this.$store.commit(
                    settingsTypes.MutationTypes.closeSettings,
                    val
                );
            },
        },
        model: {
            get(): ISettings {
                return this.$store.state.setting.model;
            },
            set(settingsModel: ISettings) {
                this.$store.dispatch(
                    settingsTypes.ActionTypes.saveSettings,
                    settingsModel
                );
            },
        },
    },
    methods: {},
});
</script>