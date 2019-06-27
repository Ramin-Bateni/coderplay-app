<template>
	<div class="cp-container-wrapper">
		<div class="cp-container">
			<v-toolbar class="cp-win-toolbar" :clipped-left="mainNav.clipped" app flat absolute>
				<v-toolbar-side-icon @click.stop="toggleMainNav"></v-toolbar-side-icon>
				<v-toolbar-title>
					<img class="logotype" src="../assets/CoderPlay_Logotype_01.svg" alt="CoderPlay">
				</v-toolbar-title>
				<v-tabs class="text-xs-left ml-5" color="transparent" show-arrows style="width:83%">
					<v-tabs-slider color="cyan"></v-tabs-slider>

					<!-- <v-menu v-if="allSolution.length>1" bottom class="v-tabs__div" left nudge-bottom="false">
						<template v-slot:activator="{ on }">
							<a class="v-tabs__item" v-on="on">
								{{ currentSolution.title }}
								<v-icon>arrow_drop_down</v-icon>
							</a>
						</template>
						<v-list class="grey darken-3">
							<v-list-tile v-for="s in allSolution" :key="s" @click="addItem(s)">{{ s.title }}</v-list-tile>
						</v-list>
					</v-menu>
					<v-tab v-else>{{ currentSolution.title }}</v-tab>-->

					<v-tab
						v-for="sol in allSolution"
						:key="sol.meta.loadId"
						:href="'#tab-' + sol.meta.loadId"
					>{{ sol.title }}</v-tab>
				</v-tabs>

				<v-flex class="text-xs-right">
					<v-btn v-if="isAnyOpenSolution" @click="closeAllSolutions" icon small depressed>
						<v-icon small>close</v-icon>
					</v-btn>
				</v-flex>
			</v-toolbar>

			<!-- <v-system-bar window class="cp-win-toolbar" color="#00000033">
				<v-btn icon @click.stop="drawer = !drawer">
					<v-icon>menu</v-icon>
				</v-btn>
				
				<img class="logotype" src="../assets/CoderPlay_Logotype_01.svg" alt="CoderPlay" />
				<v-spacer></v-spacer>
				<v-icon>remove</v-icon>
				<v-icon>check_box_outline_blank</v-icon>
				<v-icon>close</v-icon>
			</v-system-bar>-->

			<CpSideNav/>

			<v-content class="fill-height">
				<CpSettings/>
				<CpStart v-if="!isAnyOpenSolution"/>

				<v-tabs-items v-else>
					<v-tab-item
						v-for="sol in allSolution"
						:key="sol.meta.loadId"
						:value="'tab-' + sol.meta.loadId"
					>
						<CpSolution/>
						<!-- <v-card flat>
							<v-card-text>
								
							</v-card-text>
						</v-card>-->
					</v-tab-item>
				</v-tabs-items>
			</v-content>

			<CpStatusBar/>

			<!-- <img id="im" src="http://chittagongit.com/images/file-icon/file-icon-13.jpg" alt="Trulli" width="50" height="50" style="user-select: none;position:absolute;top:-25000px;"> -->
		</div>
	</div>
</template>



<script lang="ts">
	import { ipcRenderer } from 'electron';
	import Vue from 'vue';
	import { mapActions, mapGetters } from 'Vuex';
	import {
		ILoadedSolution,
		IPrimaryDrawer,
	} from '../components/CoderplaySolutionTypes';
	import CpSettings from '../components/Settings.vue';
	import CpSideNav from '../components/SideNav.vue';
	import CpSolution from '../components/Solution.vue';
	import CpStart from '../components/Start.vue';
	import CpStatusBar from '../components/StatusBar.vue';
	import { settingsTypes, solutionTypes } from '../store/types';

	export default Vue.extend({
		components: {
			CpSideNav,
			CpStatusBar,
			CpStart,
			CpSolution,
			CpSettings,
		},
		props: {},
		computed: {
			currentSolution(): ILoadedSolution | undefined {
				// debugger;
				return this.$store.getters[
					solutionTypes.GetterTypes.currentSolution
				];
			},
			isAnyOpenSolution(): boolean {
				return this.$store.getters[
					solutionTypes.GetterTypes.isAnyOpenSolution
				];
			},
			allSolution(): ILoadedSolution[] {
				// debugger;
				return this.$store.getters[solutionTypes.GetterTypes.allSolutions];
			},
			mainNav: {
				get(): IPrimaryDrawer {
					return this.$store.state.setting.model.ui.mainNav;
				},
				set(value: any) {
					this.$store.commit(
						settingsTypes.MutationTypes.setMainNav,
						value
					);
				},
			},
		},
		data: () => ({
			// solutions: [
			// 'News', 'Maps', 'Books', 'Flights', 'Apps'
			// ],
			text:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			// solutions:[] as ILoadedSolution[],
			// firstSolution: undefined as ILoadedSolution | undefined,
			// primaryDrawer:{
			// 	model: false,
			// 	type: 'temporary',
			// 	clipped: false,
			// 	floating: false,
			// 	mini: false
			// } as IPrimaryDrawer,
			// shouldOpenSolution:true as boolean,
		}),
		created() {
			// We use setTimeout here to cause an animation (first state of navigation will be hide then it will be shown)
			setTimeout(this.initTypeOfPrimaryDrawer, 0);
		},
		watch: {
			// solutions(items){
			// 	this.firstSolution=this.solutions.length>0
			// 				?this.solutions[0]
			// 				:undefined;
			// 	if(this.firstSolution==undefined){
			// 		this.shouldOpenSolution= true;
			// 		this.primaryDrawer.type='';
			// 	}
			// 	else{
			// 		this.shouldOpenSolution= false;
			// 		this.primaryDrawer.type='permanent';
			// 	}
			// },
			// primaryDrawer: function(val:any){
			// 	console.log(this.primaryDrawer);
			// },
			// firstSolution:function(val:ILoadedSolution){
			// 	this.shouldOpenSolution= val==null;
			// 	if(this.shouldOpenSolution)
			// 	{
			// 		this.primaryDrawer.type='';
			// 	}else{
			// 		this.primaryDrawer.type='permanent';
			// 	}
			// }
			// firstSolution:function(val:ILoadedSolution){
			// }
		},
		methods: {
			closeAllSolutions() {
				this.$store.dispatch(solutionTypes.ActionTypes.closeAllSolutions);
			},
			toggleMainNav() {
				this.$store.commit(settingsTypes.MutationTypes.toggleMainNav);
			},
			showMinimalWin() {
				ipcRenderer.send('toggle-image');
			},
			initTypeOfPrimaryDrawer() {
				// debugger;
				return;
				// this.primaryDrawer.type='permanent'
			},
		},
	});
</script>



<style scoped>
	* {
		-webkit-user-select: none;
	}
	.logotype {
		height: 20px;
		margin: 7px 0px 0;
		/* -webkit-filter: drop-shadow( 3px 3px 1px rgba(0, 0, 0, .5)); */
		filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.7));
		opacity: 1;
	}
	.theme--dark .logotype {
		filter: none;
	}

	.cp-win-toolbar {
		-webkit-app-region: drag;
		/* prevent text selction */
		-webkit-user-select: none;
		/* zoom:0.88; */
		box-shadow: 0 2px 0 #00000055;
	}
	.theme--dark .cp-win-toolbar {
		box-shadow: 0 2px 0 #00000055;
	}
	.cp-win-toolbar * {
		-webkit-app-region: no-drag;
	}
	.cp-win-toolbar .v-tabs {
		-webkit-app-region: drag;
	}

	.cp-container-wrapper {
		/* overflow: hidden; */
		height: 100%;
		/* background: #22222266; */
		/* We make sure the position is "absolute" to height of our main wrapper be exactlly equal to the viewport height size */
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		box-shadow: 0 0 2px rgb(0, 0, 0);
	}

	.cp-container {
		background: #f9f9f9;
		border-radius: 0px;
		color: #fff;
		height: 100vh;
		height: calc(100vh - 3px);
		margin: 2px;
		overflow: hidden;
		/* border-bottom: 1px solid rgb(70, 186, 240); */
		box-shadow: 0 0 0 1px rgba(20, 20, 20, 0.2),
			/* 0 0px 1px 0px #79797966,  */ 0 0 2px 1px #00000033,
			0 2px 0 0 #04dfff inset;
		position: relative;
	}

	.theme--dark .cp-container {
		background: rgb(57, 57, 58);
		box-shadow: 0 0 0 1px rgba(20, 20, 20, 0.8),
			/* 0 0px 1px 0px #79797966,  */ 0 0 2px 0px #000000ff,
			0 -2px 0 0 #04dfff inset;
	}

	.cp-container-back {
		top: 0;
		left: 0;
		position: absolute;
		height: 100%;
		width: 100%;
		overflow: hidden;
		z-index: -1;
	}
	.v-tabs__bar {
		position: relative;
		bottom: 0;
	}
	/* .v-tabs__div {
			zoom: 0.8;
		} */
</style>

