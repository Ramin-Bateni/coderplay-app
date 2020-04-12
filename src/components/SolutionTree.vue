<template>
	<v-card class="mx-auto tree-sheet" max-width="500" color="transparent">
		<v-sheet>
			<v-text-field
				v-model="search"
				label="Search"
				dark
				flat
				solo-inverted
				hide-details
				clearable
				clear-icon="mdi-close-circle-outline"
			></v-text-field>
			<!-- <v-checkbox
        v-model="caseSensitive"
        dark
        hide-details
        label="Case sensitive search"
			></v-checkbox>-->
		</v-sheet>
		<v-card-text>
			<v-treeview
				v-model="tree"
				:open="open"
				:items="solTree"
				:filter="filter"
				class="tree-sheet"
				activatable
				hoverable
				open-all
				item-key="id"
				open-on-click
			>
				<template v-slot:prepend="{ item, open}">
					<div
						@click="item.type=='reference'?selectSolReference(item.id):''"
						:style="item.type=='reference'?'margin-left:27px;width: 100%;':'width: 100%;'"
					>
						<v-icon
							v-if="item.type=='reference'"
							style="font-size:14px;font-weight:bold;"
							class="mr-1"
							color="primary"
						>code</v-icon>
						<v-icon
							v-if="item.type=='file'"
							style="font-size:14px;font-weight:bold;"
							class="mr-1"
							color="success"
						>insert_drive_file</v-icon>
						<v-icon
							v-if="item.type=='directory'"
							style="font-size:14px;font-weight:bold;"
							class="mr-1"
							color="#d2b859"
						>folder</v-icon>
						<v-icon
							v-if="item.type=='project'"
							style="font-size:14px;font-weight:bold;"
							class="mr-1"
							color="#bd7529"
						>attractions</v-icon>

						<span :style="item.type!='reference'?'opacity:.7':''">{{item.title}}</span>
					</div>
					<v-badge v-if="item.type=='reference'" color="green" style="opacity:0.7">{{item.childrenCount}}</v-badge>
					<v-icon v-if="!item.type">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
					<v-icon v-else>{{ files[item.type] }}</v-icon>
				</template>
			</v-treeview>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { settingsTypes, solutionTypes } from '../store/types';
	import { Utility } from '../utility';
	import { ILoadedSolution, ISolutionTree } from './CoderplaySolutionTypes';

	export default Vue.extend({
		created() {
			// console.log('SolutionTree');
			const sol: ILoadedSolution = this.$store.getters[
				solutionTypes.GetterTypes.currentSolution
			];

			this.$data.solTree = Utility.GenerateSolTree(sol);
		},
		data: () => ({
			solTree: [] as ISolutionTree,
			search: null,
			caseSensitive: false,
			open: ['public'],
			files: {
				html: 'mdi-language-html5',
				js: 'mdi-nodejs',
				json: 'mdi-json',
				md: 'mdi-markdown',
				pdf: 'mdi-file-pdf',
				png: 'mdi-file-image',
				txt: 'mdi-file-document-outline',
				xls: 'mdi-file-excel',
			},
			tree: [],
			items: [
				{
					id: '.git',
				},
				{
					id: 'node_modules',
				},
				{
					id: 'public',
					children: [
						{
							id: 'static',
							children: [
								{
									id: 'logo.png',
									file: 'png',
								},
							],
						},
						{
							id: 'favicon.ico',
							file: 'png',
						},
						{
							id: 'index.html',
							file: 'html',
						},
					],
				},
				{
					id: '.gitignore',
					file: 'txt',
				},
				{
					id: 'babel.config.js',
					file: 'js',
				},
				{
					id: 'package.json',
					file: 'json',
				},
				{
					id: 'README.md',
					file: 'md',
				},
				{
					id: 'vue.config.js',
					file: 'js',
				},
				{
					id: 'yarn.lock',
					file: 'txt',
				},
			],
		}),
		computed: {
			filter() {
				return this.caseSensitive
					? (item: any, search: any, textKey: any) =>
							item[textKey].indexOf(search) > -1
					: undefined;
			},
			currentSolution(): ILoadedSolution | undefined {
				const sol: ILoadedSolution = this.$store.getters[
					solutionTypes.GetterTypes.currentSolution
				];

				this.solTree = Utility.GenerateSolTree(sol);

				return sol;
			},
		},
		methods: {
			selectSolReference(refId: string): void {
				this.$store.dispatch(
					solutionTypes.ActionTypes.selectReference,
					refId
				);
			},
		},
	});
</script>

<style>
	.tree-sheet {
		box-shadow: none !important;
	}
</style>


