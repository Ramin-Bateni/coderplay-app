<template>
    <v-container fluid fill-height grid-list-xl>
        <v-layout align-space-between justify-space-around row fill-height>
            <!-- <v-btn>aaaaaaaaaaaaaaaaa</v-btn> -->
            <v-flex d-flex xs12>
                <v-sheet elevation="4" d-flex justify-center align-center>
                    <v-toolbar flat>
                        <v-toolbar-title>Open Recent</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    <v-list>
                        <v-list-group
                            v-for="(item, groupIndex) in items"
                            :key="item.title"
                            v-model="item.active"
                            :prepend-icon="item.action"
                            no-action
                        >
                            <template v-slot:activator>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        <v-list-tile-title
                                            class="cp-list-group-title"
                                            >{{ item.title }}</v-list-tile-title
                                        >
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>

                            <v-list-tile
                                v-for="(subItem, index) in item.items"
                                :key="subItem.title"
                                @click="openSolutionItem(groupIndex, index)"
                                style="cursor:pointer;"
                            >
                                <v-list-tile-content>
                                    <v-list-tile-title>{{
                                        subItem.title
                                    }}</v-list-tile-title>
                                    <v-list-tile-sub-title
                                        style="opacity:.5;font-size: 75%;"
                                        >{{
                                            subItem.path
                                        }}</v-list-tile-sub-title
                                    >
                                </v-list-tile-content>

                                <v-list-tile-action>
                                    <v-icon>{{ subItem.action }}</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list-group>
                    </v-list>
                </v-sheet>
            </v-flex>

            <v-flex d-flex xs12 ripple>
                <!-- This v-sheet give us a colored box -->
                <v-sheet id="drag-file" elevation="4" :class="dragFileClass">
                    <!-- This v-layout give us abitity to put the content in the center (both horizontall && verticall) -->
                    <v-layout
                        style="margin:0px 50px;"
                        align-center
                        justify-center
                        fill-height
                    >
                        <div style="text-align:center; opacity:.3;">
                            <h2>
                                Drag your Coderplay Solution file here to open
                                it!
                            </h2>
                        </div>
                        <div
                            style="position:absolute; height:90%;width:90%;"
                            v-on:drop="fileDragAreaDrop($event)"
                            v-on:dragover="fileDragAreaOver($event)"
                            v-on:dragenter="fileDragAreaEnter($event)"
                            v-on:dragleave="fileDragAreaLeave($event)"
                        ></div>
                    </v-layout>
                </v-sheet>
            </v-flex>

            <v-flex v-if="false">
                <div
                    id="div1"
                    v-on:drop="drop($event)"
                    v-on:dragover="allowDrop($event)"
                ></div>
                <br />
                <img
                    id="drag1"
                    src="https://www.w3schools.com/html/img_logo.gif"
                    draggable="true"
                    v-on:dragstart="drag($event)"
                    width="336"
                    height="69"
                />

                <hr />
                <div
                    id="div1"
                    v-on:ondrop="drop($event)"
                    v-on:ondragover="allowDrop($event)"
                    style="width: 350px; height: 70px; padding: 10px; border: 1px solid #aaaaaa;"
                ></div>
                <br />
                <i
                    id="dragIcon"
                    class="material-icons md-48"
                    style="position:absolute; z-index:-100; font-size:100px; width: 100px;height: 100px;"
                    >add_to_queue</i
                >
                <br />

                <div
                    id="vb"
                    class="grabbable"
                    align="start"
                    draggable="true"
                    v-on:dragstart="drag($event)"
                >
                    Drag Me
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import fs from 'fs';
import Vue from 'vue';
import {
    ILoadedSolution,
    ISolutionMeta,
} from '../components/CoderplaySolutionTypes';
// tslint:disable-next-line:no-var-requires
const uuidV4 = require('uuid/v4');
import { mapActions } from 'Vuex';
import Types from '../store/types';
// require('jquery')

export default Vue.extend({
    created() {
        // var dragFile= document.getElementById("drag-file");
        // dragFile.addEventListener('drop', function (e) {

        // });
        // dragFile.addEventListener('dragover', function (e) {

        // });
        ipcRenderer.on('fileData', (event: any, data: any) => {
            // $('#txtarea').text(data);
        });
    },
    data: () => ({
        items: [
            {
                action: 'local_activity',
                title: 'Solutions',
                active: true,
                items: [
                    {
                        title: 'Sample Solution',
                        path:
                            'C:\\MyFiles\\Coding\\CoderPlay\\SampleProject\\.coderplay\\index.coderplay',
                    },
                ],
            },
        ],
        dragFileClass: 'cp-drag-area cp-drag-area-normal',
    }),
    methods: {
        //     ...mapActions({
        // 	    'loadSolutionFromFile':ActionTypes.loadSolutionFromFile
        //     }),
        openSolutionItem(groupIndex: number, itemIndex: number) {
            // debugger
            if (groupIndex > 0) {
                alert('The selected item is not inside solution folder');
            }
            const selectedItem = this.items[groupIndex].items[itemIndex];
            this.loadSolutionFromFile(selectedItem.path);
        },
        loadSolutionFromFile(filePath: string) {
            this.$store.dispatch(
                Types.solution.ActionTypes.loadSolutionFromFile,
                filePath
            );
        },

        // loadSolutionFromFile(filePath:string){
        // 	//debugger
        // 	let rawdata = fs.readFileSync(filePath).toString();
        // 	let solution = JSON.parse(rawdata) as ILoadedSolution;
        // 	console.log(solution);

        // 	// fill load/save properties

        // 	try {
        // 		solution.meta={ } as ISolutionMeta;
        // 		solution.meta.loadId= uuidV4();
        // 		solution.meta.lastSavedOn= new Date();
        // 		solution.meta.filePath=filePath;
        // 		solution.meta.isModified=false;
        // 	} finally {

        // 		solution.meta.lastSavedSnapshot =Object.assign({}, solution);
        // 	}

        // 	this.$emit("openSolution",solution);
        // },
        //     openSolutionFile(index){
        // 	    debugger;
        //   		const selectedItem = this.items[0].items[index];
        // 	    this.$emit("openSolutionFile",selectedItem.path);
        //     }
        fileDragAreaDrop(e: DragEvent) {
            //    console.log('fileDragAreaDrop', e);
            e.preventDefault();
            e.stopPropagation();

            if (e.dataTransfer) {
                for (const f of e.dataTransfer.files) {
                    if (f.type === 'text/plain') {
                        // console.log('The file(s) you dragged: ', f);
                        ipcRenderer.send('ondragstart', f.path);
                    }
                }
            }
        },
        fileDragAreaOver(e: DragEvent) {
            // console.log('fileDragAreaOver',e)
            e.preventDefault();
            e.stopPropagation();
        },
        fileDragAreaEnter(e: DragEvent) {
            //  console.log('fileDragAreaEnter', e);
            this.dragFileClass = 'cp-drag-area cp-drag-area-active';
            e.preventDefault();
            e.stopPropagation();
        },
        fileDragAreaLeave(e: DragEvent) {
            // console.log('fileDragAreaLeave', e);
            this.dragFileClass = 'cp-drag-area cp-drag-area-normal';
            e.preventDefault();
            e.stopPropagation();
        },
        // --------------------------------------------------------------------------
        startDrag(event: DragEvent) {
            if (!event || !event.dataTransfer) {
                //  console.log('Event or... is null!');
                return;
            }
            event.dataTransfer.setData('text/plain', '<strong>Body</strong>');
            event.dataTransfer.setDragImage(
                document.getElementById('dragIcon') as Element,
                25,
                60
            );
        },
        allowDrop(ev: DragEvent) {
            // debugger
            // console.log('allowDrop', ev);
            ev.preventDefault();
        },
        drag(ev: DragEvent) {
            // debugger
            if (!ev || !ev.dataTransfer || !ev.target) {
                //  console.log('Event or... is null!');
                return;
            }
            //   console.log('drag', ev);
            ev.dataTransfer.setData('text', (ev.target as Element).id);
            ev.dataTransfer.setDragImage(
                document.getElementById('dragIcon') as Element,
                25,
                60
            );
        },
        drop(ev: DragEvent) {
            if (!ev || !ev.dataTransfer || !ev.target) {
                //   console.log('Event or... is null!');
                return;
            }
            // console.log('drop', ev);
            ev.preventDefault();
            const data = ev.dataTransfer.getData('text');
            (ev.target as Element).appendChild(
                document.getElementById(data) as Element
            );
        },
        // --------------------------------------------------------------------------
    },
});
</script>

<style>
.cp-list-group-title {
    opacity: 0.3;
}
.cp-drag-area {
    border-radius: 5px;
}
.cp-drag-area-normal {
    border: 3px dashed #ffffff30 !important;
}
.cp-drag-area-active {
    border: 3px dashed #04dfff !important;
}

.grabbable {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
    user-select: none;
}
/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
    cursor: grabbing !important;
    cursor: -moz-grabbing !important;
    cursor: -webkit-grabbing !important;
}
#div1 {
    width: 350px;
    height: 70px;
    padding: 10px;
    border: 1px solid #aaaaaa;
}
</style>
