<template>
	<v-container fluid fill-height grid-list-md style="overflow: scroll;">
		<v-layout align-start justify-center row fill-height>
			<v-flex d-flex xs12 md6>
				<CpVideoPlayer v-if="assetIsSelected" />
				<CpVideoRecorder v-else />
			</v-flex>
			<v-flex d-flex xs12 md6>
				<CpRefAssets />
			</v-flex>
		</v-layout>
	</v-container>
</template>


<script <script lang="ts">
	// import { ipcRenderer } from 'electron';
	import fs from 'fs'; // const fs = require('fs');
	import Vue from 'vue';
	import {
		IAssetItem,
		ILoadedSolution,
	} from '../components/CoderplaySolutionTypes';
	import CpRefAssets from '../components/RefAssets.vue';
	import CpVideoPlayer from '../components/VideoPlayer.vue';
	import CpVideoRecorder from '../components/VideoRecorder.vue';
	import t from '../store/types';

	export default Vue.extend({
		components: {
			CpRefAssets,
			CpVideoPlayer,
			CpVideoRecorder,
		},
		props: {
			// isDark:any ,
			// solution:LoadedCpSolution
		},
		data: () => ({
			lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
			shouldOpenSolution: true,
		}),
		watch: {},
		methods: {},
		computed: {
			solution(): ILoadedSolution {
				return this.$store.getters.currentSolution;
			},
			assetIsSelected(): boolean {
				// debugger;
				const assetItem = this.$store.getters[
					t.solution.GetterTypes.currentAssetItem
				];
				// debugger;
				return assetItem !== null && assetItem !== undefined;
			},
		},
	});
</script>
