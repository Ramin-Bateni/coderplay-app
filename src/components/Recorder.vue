<template>
	<v-card class="cp-light-1">
		<v-card-title primary class style="height:52px;">{{recordInfo.title}}</v-card-title>
		<video
			width="100%"
			style="min-height:240px;min-width:280px; width:100%;"
			:autoplay="recordInfo.player.autoplay"
			:controls="recordInfo.player.controlesVisibility"
			src="https://www.w3schools.com/tags/movie.mp4"
		>
			<!-- <source :src="recordInfo.player.url" :type="recordInfo.player.fileType"> -->
			<!-- <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"> -->
			<!-- <source src="https://www.w3schools.com/tags/movie.ogg" type="video/ogg"> -->
			Your browser does not support the video tag.
		</video>
		<v-card-text>{{recordInfo.description}}</v-card-text>
	</v-card>
</template>



<script lang="ts">
	import path from 'path';
	import url from 'url';
	import Vue from 'vue';
	import t from '../store/types';
	import { Utility } from '../utility';
	import { IPlayer, IRecordInfo } from './CoderplaySolutionTypes';

	export default Vue.extend({
		data: () => ({
			player: {
				fullscreen: false,
				picInPic: false,
				autoplay: false,
				controlesVisibility: true,
			} as IPlayer,
		}),
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
			}
		},
		methods: {
			
		},
	});
</script>
