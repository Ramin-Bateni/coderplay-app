<template>
	<v-layout row wrap>
		<v-flex d-flex style="height:60px;">
			<v-card class="cp-light-1" style=" padding:0px 5px;">
				<v-breadcrumbs :items="items">
					<template v-slot:divider>
						<v-icon>chevron_right</v-icon>
					</template>
				</v-breadcrumbs>
			</v-card>
		</v-flex>
		<v-flex d-flex>
			<RefAssetsTable :breadcrumbsItems="items" :solution="solution"/>
		</v-flex>
	</v-layout>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { mapGetters } from 'vuex';
	import { ILoadedSolution } from '../components/CoderplaySolutionTypes';
	import t from '../store/types';
	import RefAssetsTable from './RefAssetsTable.vue';

	export default Vue.extend({
		props: {
			// solution:ISolution
		},
		data: () => ({
			// cpSolution:null,
			lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
			items: [] as any[],
			solutionJson: Object,
		}),
		components: {
			//  HelloWorld
			RefAssetsTable,
		},
		computed: {
			// ...mapGetters(t.namespaces.solution, {
			// 	solution: t.solution.GetterTypesPure.currentSolution,
			// }),
			solution(): ILoadedSolution {
				// debugger;
				// var xxx = t.solution.GetterTypesPure.currentSolution;
				const sol = this.$store.getters[
					t.solution.GetterTypes.currentSolution
				];
				const ref = sol.projects[0].references[0];
				this.items = [
					{
						text: ref.filePath,
						disabled: true,
						href: 'breadcrumbs_dashboard',
					},
					{
						text: ref.title,
						disabled: true,
						href: 'breadcrumbs_link_1',
					},
				];

				return sol;
			},
		},
		methods: {},
	});
</script>
