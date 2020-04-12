<template>
	<div>
		<template v-if="playInfo.assetIsSelected">
			<v-card class="cp-light-1">
				<!-- <v-card-actions>
					<v-btn>Share</v-btn>
					<v-spacer></v-spacer>
					<v-btn>Explore</v-btn>
				</v-card-actions>-->
				<v-card-title primary class="pt-2" style="height:52px;">
					<v-icon class="mr-2" small>movie_filter</v-icon>
					{{playInfo.title}}
					<v-spacer></v-spacer>
					<v-btn small flat icon @click="closeAsset()">
						<v-icon small>close</v-icon>
					</v-btn>
				</v-card-title>
				<video
					v-if="playInfo.assetIsMedia"
					width="100%"
					style="min-height:240px;min-width:280px;width:100%;background: black;"
					:autoplay="playInfo.player.autoplay"
					:controls="playInfo.player.controlesVisibility"
					:src="playInfo.player.url"
				>
					<!-- <source :src="playInfo.player.url" :type="playInfo.player.fileType"> -->
					<!-- <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4">
					<source src="https://www.w3schools.com/tags/movie.ogg" type="video/ogg">-->
					Your browser does not support the video tag.
				</video>
				<v-card-text
					class="pt-1 pb-0"
					style="opacity:.5;font-size:.8em;"
				>{{currentAssetItem.updatedOn | formatDate}}</v-card-text>
				<v-card-text class="pt-1">{{playInfo.description}}</v-card-text>
			</v-card>
		</template>
		<!-- ------------------------------------------------------------------------------------------ -->
		<CpVideoRecorder v-else />
		<!-- <template v-else>
			<v-card class="cp-light-1">
				<v-card-title primary class style="height:52px;">{{recordInfo.title}}</v-card-title>
				<video
					width="100%"
					style="min-height:240px;min-width:280px; width:100%;"
					:autoplay="recordInfo.player.autoplay"
					:controls="recordInfo.player.controlesVisibility"
					src="https://www.w3schools.com/tags/movie.mp4"
				>
					Your browser does not support the video tag.
				</video>
				<v-card-text>{{recordInfo.description}}</v-card-text>
			</v-card>
		</template>-->
	</div>
</template>


<script lang="ts">
	import path from 'path';
	import url from 'url';
	import Vue from 'vue';
	import t from '../store/types';
	import { Utility } from '../utility';

	import {
		IAssetFlow,
		IAssetItem,
		ILoadedSolution,
		IPlayer,
		IPlayInfo,
		IRecordInfo,
	} from './CoderplaySolutionTypes';

	import CpVideoRecorder from './VideoRecorder.vue';

	export default Vue.extend({
		data: () => ({
			player: {
				fullscreen: false,
				picInPic: false,
				autoplay: false,
				controlesVisibility: true,
			} as IPlayer,
		}),
		components: {
			CpVideoRecorder,
		},
		computed: {
			recordInfo(): IRecordInfo {
				const defaults: IRecordInfo = {
					title: 'Recorder Preview',
					description:
						'The preview of the sources that will be records if you press the REC button!',
					player: {
						...this.$data.player,
						fileType: '',
						url: '',
						poster: '',
					},
				};
				return defaults;
			},
			playInfo(): IPlayInfo {
				// --------------------------------------------------------------------------------------
				// make default play info
				const defaults: IPlayInfo = {
					assetIsSelected: false,
					assetIsMedia: false,
					title: 'Asset Title',
					description: 'Description',
					player: {
						...this.$data.player,
						fileType: '',
						url: '',
						poster: '',
						autoplay: true,
					},
				};

				if (
					this.currentAssetItem === undefined ||
					!this.isMedia ||
					this.assetItemFlow === undefined
				) {
					return defaults;
				}
				// --------------------------------------------------------------------------------------
				// make custom play info from asset
				const asset: IAssetItem = this.currentAssetItem;
				const assetItemFlow = (this.assetItemFlow as unknown) as IAssetFlow;

				const result: IPlayInfo = {
					...defaults,
					assetIsSelected: true,
					assetIsMedia: true,
					title: Utility.limitText(asset.asset().title, 30),
					description: asset.asset().desc,
					player: {
						...defaults.player,
						fileType: asset.asset().file.type,
						url: Utility.AssetFlow2Url(assetItemFlow),
					},
				};
				// debugger
				return result;
			},
			currentAssetItem(): IAssetItem | undefined {
				// debugger;
				const asset = this.$store.getters[
					t.solution.GetterTypes.currentAssetItem
				];
				// debugger;
				return asset;
			},
			assetItemFlow(): IAssetFlow | undefined {
				// debugger;
				if (this.currentAssetItem) {
					return this.$store.getters[
						t.solution.GetterTypes.assetItemFlow
					](this.currentAssetItem.id);
				} else {
					return undefined;
				}
			},
			isMedia(): boolean {
				// debugger;
				return (
					this.currentAssetItem !== undefined &&
					(this.currentAssetItem.asset().file.type.indexOf('video') >
						-1 ||
						this.currentAssetItem.asset().file.type.indexOf('audio') >
							-1)
				);
			},

			// currentProject():ILoadedSolution{
			// 	return this.$store.getters.currentSolution
			// },
			// currentReference():ILoadedSolution{
			// 	return this.$store.getters.currentReference
			// },
			// currentSolution():ILoadedSolution{
			// 	return this.$store.getters.currentSolution
			// }
			// get: function():IAsset {return this.$store.getters.selectedAsset},
			// set: function(value: any) {this.$store.dispatch(MutationTypes.setMainNav,value)}
		},
		methods: {
			closeAsset(): void {
				// debugger;
				this.$store.dispatch(
					t.solution.ActionTypes.deselectAssetItem,
					(this.currentAssetItem as IAssetItem).id
				);
			},
		},
	});
</script>
