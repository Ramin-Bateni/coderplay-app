<template>
  <div class="container-wrapper">
    <div class="container container-rounded">
      <div class="container-content container-rounded">
        <img class="logotype" src="../assets/CoderPlay_Logotype_01.svg" alt="CoderPlay">
        <button class="win-handel advanced-mode-switch" @click="switchAdvancedWindow()">X</button>

        <div class="layout row" style="margin-left: 130px; width:40px;">
          <div class="flex xs12 sm3">
            <button type="button" class="v-btn v-btn--flat v-btn--icon theme--light pink--text">
              <div class="v-btn__content">
                <i aria-hidden="true" class="v-icon material-icons theme--light">camera</i>
              </div>
            </button>
          </div>
          <div class="flex xs12 sm3">
            <button type="button" class="v-btn v-btn--flat v-btn--icon theme--light grey--text">
              <div class="v-btn__content">
                <i aria-hidden="true" class="v-icon material-icons theme--light">pause_circle_filled</i>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="container-back container-rounded">
        <div class="shape1"></div>
        <div class="shape2"></div>
        <div class="cp-drag-handel"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import Vue from 'vue';
// import {mapState} from  "Vuex"

export default Vue.extend({
    created() {
        // console.log('Image!!!!!!!!!!!!!!!!!!!!')
        ipcRenderer.on('image', (event: any, arg: any) => {
            // console.log('Image!!!!!!!!!!!!!!!!!!!!',arg)
            this.imageUrl = arg;
        });
    },
    data() {
        return {
            imageUrl: '',
        };
    },
    methods: {
        switchAdvancedWindow() {
            // remote.getCurrentWindow().hide();
            // remote.getGlobal().

            const app = require('electron').remote.app;
            // console.log(app)
            ipcRenderer.send('switch-2-advanced-window');
        },
    },
});
</script>

<style scoped>
.logotype {
    height: 22px;
    position: absolute;
    top: 13px;
    left: 4px;
    -webkit-filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7));
    filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7));
}

.container-wrapper {
    padding: 7px;
    /* height: 80px;
		width: 350px; */
}
.container-content {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 20;
}
.container-back {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: -1px;
}
.container-rounded {
    border-radius: 25px 10px 10px 25px;
}
.container {
    background: rgba(33, 33, 36, 0.95);
    height: 50px;
    color: #fff;
    /* overflow: hidden; */
    /* border-bottom: 1px solid rgb(70, 186, 240); */
    box-shadow: 0 0 0 1px rgb(0, 0, 0), 0 0px 7px 0px #79797922,
        0 4px 5px 0px #0000009a, 0 3px 0 0 rgb(23, 197, 250);
    position: relative;
}
button.win-handel {
    /* prevent drag */
    -webkit-app-region: no-drag;
    position: absolute;
    right: 0;
    top: 0;
    background-color: #ffffff11;
    border-radius: 0;
    border: 0;
    color: rgba(255, 255, 255, 0.6);
    padding: 2px 0;
    width: 25px;
    font-size: 9px;
    font-weight: 900;
    cursor: pointer;
    transition: all 0.5s;
    outline: none;
}
button.win-handel:hover {
    background-color: #ffffff1f;
    color: rgba(255, 255, 255, 0.8);
}
button.win-handel.advanced-mode-switch {
    border-radius: 0 10px 0 10px;
}
.shape1 {
    position: absolute;
    width: 300px;
    height: 200px;
    background-color: #0000001d;
    border-radius: 50%;
    top: -160px;
    left: -50px;
}
.shape2 {
    position: absolute;
    width: 80px;
    height: 80px;
    background-color: #2773c91a;
    border-radius: 50%;
    top: 30px;
    right: -20px;
}
.cp-drag-handel {
    -webkit-app-region: drag;
    /* prevent text selction */
    -webkit-user-select: none;
    position: absolute;
    width: 30px;
    height: 120%;
    top: -5px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0 40% 40% 0;
}
</style>