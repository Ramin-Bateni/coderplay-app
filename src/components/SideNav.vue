<template>
	<v-navigation-drawer
		v-model="mainNav.model"
		:permanent="mainNav.type === 'permanent'"
		:temporary="mainNav.type === 'temporary'"
		:clipped="mainNav.clipped"
		:floating="mainNav.floating"
		:mini-variant="mainNav.mini"
		absolute
		overflow
		app
	>
		<v-list class="pa-1">
			<v-list-tile avatar>
				<v-list-tile-avatar>
					<img src="https://randomuser.me/api/portraits/men/85.jpg">
				</v-list-tile-avatar>

				<v-list-tile-content>
					<v-list-tile-title>John Leider</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<v-list-tile>
				<v-list-tile-title class="title">Sample Solution</v-list-tile-title>
			</v-list-tile>
		</v-list>

		<v-list class="pt-0" dense>
			<v-divider></v-divider>

			<v-list-tile v-for="item in items" :key="item.title">
				<v-list-tile-action>
					<v-icon>{{ item.icon }}</v-icon>
				</v-list-tile-action>

				<v-list-tile-content>
					<v-list-tile-title>{{ item.title }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>

		<v-btn icon small @click.stop="openSettings()">
			<v-icon>settings</v-icon>
		</v-btn>
	</v-navigation-drawer>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { mapGetters } from 'vuex';
	import t from '../store/types';
	import { IPrimaryDrawer } from './CoderplaySolutionTypes';

	export default Vue.extend({
		props: {
			// mainNav: Object
		},
		watch: {
			// drawer: function(val){
			//   this.mainNav.model=drawer;
			// }
		},
		computed: {
			mainNav: {
				get(): IPrimaryDrawer {
					//   debugger;
					return this.$store.state.setting.model.ui.mainNav;
				},
				set(value: any) {
					this.$store.commit(t.settings.MutationTypes.setMainNav, value);
				},
			},
			// ...mapGetters({
			//   'mainNav':'mainNav'
			// })
			// mainNav:{
			//    get: function():IPrimaryDrawer {return this.$store.state.setting.model.ui.mainNav}
			// //  return {
			// // 		model: false,
			// // 		type: '',
			// // 		clipped: false,
			// // 		floating: false,
			// // 		mini: false,
			// // 	} as IPrimaryDrawer
			// }
			// return this.$store.state.setting.model.ui.mainNav;
		},
		data() {
			return {
				//   mainNav: null,
				items: [
					{ title: 'Home', icon: 'dashboard' },
					{ title: 'About', icon: 'question_answer' },
				],
			};
		},
		created() {
			//   this.mainNav = {...this.$store.getters.mainNav}
		},
		methods: {
			openSettings() {
				this.$store.commit(t.settings.MutationTypes.openSettings);
			},
		},
	});
</script>