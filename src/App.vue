<template>
    <v-app :dark="isDarkTheme">
        <!-- <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>CoderPLay</span>
        <span class="font-weight-light"> beta</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
		</v-toolbar>-->

        <router-view />
        <!-- <v-content>
      <HelloWorld/>
		</v-content>-->
    </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld'
import {
    appConfigStore,
    Defaults,
    IAppConf,
    ReadyAppConfig,
} from './appConfig';
import t from './store/types';

export default {
    name: 'App',
    components: {
        //  HelloWorld
    },
    data() {
        return {
            //
        };
    },
    created() {
        //	debugger;
        this.$store.dispatch(
            t.settings.ActionTypes.switchTheme,
            appConfigStore.get('darkTheme')
        );

        // debugger
    },
    methods: {},
    computed: {
        isDarkTheme() {
            return this.$store.state.setting.model.ui.isDarkTheme;
        },
    },
};
</script>
<style type="text/css">
.v-label {
    font-size: 12px !important;
}
.v-treeview-node__root {
    transition: all 0.15s ease;
}
.v-treeview-node__label {
    font-size: 0.75rem !important;
    /* margin-left: 0px !important; */
}
.v-treeview-node--active {
    border-radius: 4px;
}
.v-treeview-node__root {
    min-height: 20px !important;
}
.v-treeview-node {
    margin-left: 15px !important;
}
.theme--dark.v-treeview--hoverable .v-treeview-node__root:hover,
.theme--dark.v-treeview .v-treeview-node--active {
    background: rgba(2, 2, 2, 0.24);
    border-radius: 3px;
}
</style>

<style>
body {
    font-size: 11px;
}
.title {
    font-size: 14px !important;
}
/* Remove the scrollbar of the pages */
body::-webkit-scrollbar,
.cp-container-wrapper::-webkit-scrollbar {
    display: none;
}

/* width */
::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

/* Track */
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner,
::-webkit-scrollbar-button {
    background: rgba(37, 37, 37, 0);
}
::-webkit-scrollbar-button {
    height: 0;
}
/* Handle */
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
}

.theme--light.application,
.theme--dark.application {
    background: transparent;
}
.theme--dark .cp-light-1 {
    background-color: #ffffff0e !important;
}
.theme--dark.v-sheet,
.theme--dark.v-card,
.theme--dark.v-table,
.theme--dark.v-icon,
.theme--dark.v-toolbar,
.theme--dark.v-btn .v-btn__content .v-icon {
    color: #e1e1e1;
}
.theme--dark.v-toolbar {
    background-color: #2a2a2aaa;
}
.v-card__title,
.v-toolbar__title {
    font-size: 17px !important;
}
.v-icon {
    font-size: 20px;
}
.v-card,
.elevation-1 {
    -webkit-box-shadow: 0px 3px 0px -2px rgba(0, 0, 0, 0.1),
        0px 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 2px 5px 1px rgba(0, 0, 0, 0.05) !important;
    box-shadow: 0px 3px 0px -2px rgba(0, 0, 0, 0.1),
        0px 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 2px 5px 1px rgba(0, 0, 0, 0.05) !important;
}

video {
    outline: none;
}
.theme--dark.v-toolbar {
    background-color: #333333 !important;
}
.theme--dark.v-navigation-drawer {
    background-color: rgba(0, 0, 0, 0.1) !important;
}
/* .theme--dark aside.v-navigation-drawer{
																																														background-color:transparent;
																																													} */
.theme--dark.v-navigation-drawer .v-divider {
    border-color: rgba(255, 255, 255, 0.05) !important;
}
.theme--dark.v-navigation-drawer:not(.v-navigation-drawer--floating)
    div.v-navigation-drawer__border {
    background-color: #333333 !important;
}
#app {
    /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
    text-align: left !important;
}
.theme--dark.v-toolbar.bg-0,
.bg-0 {
    background-color: transparent !important;
}
</style>

<style lang="stylus">
// #app {
// 	font-family: 'Avenir', Helvetica, Arial, sans-serif;
// 	-webkit-font-smoothing: antialiased;
// 	-moz-osx-font-smoothing: grayscale;
// 	text-align: center;
// 	color: #2c3e50;
// }

// #nav {
// 	padding: 30px;

// 	a {
// 		font-weight: bold;
// 		color: #2c3e50;

// 		&.router-link-exact-active {
// 			color: #42b983;
// 		}
// 	}
// }
</style>
