<template>
	<v-layout row wrap>
		<v-flex d-flex style="height:60px;">
			<v-card class="cp-light-1" style=" padding:0px 5px;">
				<v-breadcrumbs :items="items">
					<template v-slot:item="props">
						<a
							:href="props.item.href"
							:class="[props.item.disabled && 'disabled']"
							style="cursor:default;text-decoration:none;font-size:120%;"
						>{{ props.item.text }}</a>
					</template>
					<template v-slot:divider>
						<v-icon>chevron_right</v-icon>
					</template>
				</v-breadcrumbs>
			</v-card>
		</v-flex>
		<v-flex d-flex>
			<CpRefAssetsTable />
		</v-flex>
	</v-layout>
</template>

<script lang="ts">
	import Vue from 'vue';
	// import { mapGetters } from 'vuex';
	import {
		ILoadedSolution,
		IReference,
	} from '../components/CoderplaySolutionTypes';
	import t from '../store/types';
	import CpRefAssetsTable from './RefAssetsTable.vue';

	export default Vue.extend({
		// data: () => ({
		// 	// cpSolution:null,
		// 	// lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
		// 	items: [] as any[],
		// 	// solutionJson: Object,
		// }),
		components: {
			CpRefAssetsTable,
		},
		computed: {
			currentReference(): IReference {
				//debugger;
				const ref = this.$store.getters[
					t.solution.GetterTypes.currentReference
				];
				return ref;
			},
			items() {
				const ref = this.currentReference as IReference | undefined;
				if (ref) {
					const pathParts = ref.filePaths[0].split('/');
					const result = pathParts.map(p => {
						return {
							text: p,
							disabled: false,
							href: '#', // ref.filePaths[0],
						};
					});
					return result;
				}
				return [];
			},
			// currentReference(): IReference {
			// 	debugger;
			// 	const ref = this.$store.getters[
			// 		t.solution.GetterTypes.currentReference
			// 	];

			// 	if (!ref) {
			// 		return ref;
			// 	}

			// 	this.items = [
			// 		{
			// 			text: ref.filePaths.toString(),
			// 			disabled: true,
			// 			href: 'breadcrumbs_dashboard',
			// 		},
			// 		{
			// 			text: ref.title,
			// 			disabled: true,
			// 			href: 'breadcrumbs_link_1',
			// 		},
			// 	];

			// 	return ref;
			// },
			// ...mapGetters(t.namespaces.solution, {
			// 	solution: t.solution.GetterTypesPure.currentSolution,
			// }),
			solution(): ILoadedSolution {
				debugger;
				// var xxx = t.solution.GetterTypesPure.currentSolution;
				const sol = this.$store.getters[
					t.solution.GetterTypes.currentSolution
				];
				return sol;
			},
		},
	});
</script>
<style>
	.v-breadcrumbs li:nth-child(even) {
		padding: 0;
	}
</style>
