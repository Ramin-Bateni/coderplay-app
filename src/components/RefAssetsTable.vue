<template>
	<div class="cp-assets-table">
		<v-toolbar flat>
			<v-toolbar-title>
				<v-icon class="mr-2">video_library</v-icon>Assets
			</v-toolbar-title>

			<v-divider class="mx-2" inset vertical></v-divider>

			<v-spacer></v-spacer>
			<v-dialog v-model="dialog" max-width="500px">
				<template v-slot:activator="{ on }">
					<div v-if="currentReference">
						<v-btn fab small color="#4a4a4a">
							<v-icon>add</v-icon>
						</v-btn>
						<v-btn fab small color="#de112e">REC</v-btn>
					</div>
					<!-- <button type="button" class="v-btn v-btn--flat v-btn--icon theme--light pink--text">
              <div class="v-btn__content">
                <i aria-hidden="true" class="v-icon material-icons theme--light">camera</i>
              </div>
					</button>-->
				</template>
				<v-card>
					<v-card-title>
						<span class="headline">{{ formTitle }}</span>
					</v-card-title>

					<v-card-text>
						<v-container grid-list-md>
							<v-layout wrap>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.title" label="Dessert title"></v-text-field>
								</v-flex>
								<!-- <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
								</v-flex>-->
							</v-layout>
						</v-container>
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
						<v-btn color="blue darken-1" flat @click="save">Save</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-toolbar>

		<v-data-table
			:headers="headers"
			:items="desserts"
			:expand="expand"
			class="elevation-1"
			hide-headers
		>
			<template v-slot:items="props">
				<tr @click="props.expanded = !props.expanded">
					<td class="pl-3 pr-0" style="max-width: 20px;">
						<v-icon class="mr-0 pr-0 ml-0 pl-0" small @click="playItem(props.item)">{{ props.item.icon }}</v-icon>
					</td>
					<td class="pl-2">{{ props.item.title }}</td>
					<!-- <td class="text-xs-right">{{ props.item.calories }}</td>
          <td class="text-xs-right">{{ props.item.fat }}</td>
          <td class="text-xs-right">{{ props.item.carbs }}</td>
					<td class="text-xs-right">{{ props.item.protein }}</td>-->
					<td class="right layout px-0 mr-2">
						<v-btn flat icon @click.stop="playItem(props.item)" class="mx-0">
							<v-icon small>play_arrow</v-icon>
						</v-btn>
						<v-btn flat icon @click.stop="editItem(props.item)" class="mx-0">
							<v-icon small>edit</v-icon>
						</v-btn>
						<v-btn flat icon @click.stop="deleteItem(props.item)" class="mx-0">
							<v-icon small>delete</v-icon>
						</v-btn>
					</td>
				</tr>
			</template>
			<template v-slot:no-data>
				<td class="px-0">
					<v-card class="px-2" flat full-width v-if="currentReference">
						<v-card-text>
							The selected reference has no assets yet!
							<br />To add an asset here please use the
							<v-btn fab small color="#4a4a4a">
								<v-icon>add</v-icon>
							</v-btn>or
							<v-btn fab small color="#de112e">REC</v-btn>buttons.
						</v-card-text>
					</v-card>
					<v-card flat full-width v-else>
						<v-card-text>Please select a reference from the Project Tree in the sidebar to show its assets here.</v-card-text>
					</v-card>
					<!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
				</td>
			</template>
			<template v-slot:expand="props">
				<v-card flat>
					<v-card-text>{{props.item}}</v-card-text>
				</v-card>
			</template>
			<!-- <template v-if="true">aaaaaaaaa</template> -->
		</v-data-table>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue';
	import t from '../store/types';
	import { Utility } from '../utility';
	import {
		IAssetItem,
		ILoadedSolution,
		IReference,
		ISolution,
	} from './CoderplaySolutionTypes';

	export default Vue.extend({
		data: () => ({
			expand: null,
			dialog: false,
			headers: [
				{ text: 'Icon', value: 'icon', sortable: false },
				{
					text: 'Dessert (100g serving)',
					align: 'left',
					sortable: false,
					value: 'title',
				},
				//   { text: 'Calories', value: 'calories' },
				//   { text: 'Fat (g)', value: 'fat' },
				//   { text: 'Carbs (g)', value: 'carbs' },
				//   { text: 'Protein (g)', value: 'protein' },
				{ text: 'Actions', value: 'title', sortable: false },
			],
			editedIndex: -1,
			editedItem: {
				icon: 'local_movies',
				title: '',
				description: 'Toziiiiiiiiih',
			},
			defaultItem: {
				icon: 'local_movies',
				title: '',
				description: 'Toziiiiiiiiih',
			},
		}),

		computed: {
			currentReference(): IReference {
				// debugger;
				const ref = this.$store.getters[
					t.solution.GetterTypes.currentReference
				];
				return ref;
			},
			formTitle(): any {
				return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
			},
			solution(): ILoadedSolution {
				// debugger;
				// var xxx = t.solution.GetterTypesPure.currentSolution;
				const sol = this.$store.getters[
					t.solution.GetterTypes.currentSolution
				];
				return sol;
			},
			desserts(): any[] {
				const desserts: any[] = [];
				const ref = this.currentReference;
				if (ref) {
					ref.assetItems.forEach((assetItem: IAssetItem) => {
						const asset = assetItem.asset();
						const item = {
							id: assetItem.id,
							icon: Utility.GetIconClassFromFileType(asset.file.type),
							title: asset.title,
							description: asset.desc,
							file: asset.file,
						};
						console.log('item', item);
						desserts.push(item);
					});
				}
				return desserts;
			},
		},

		// watch: {
		//     dialog(val) {
		//         val || this.close();
		//     },
		// },

		// created() {
		//     // debugger;
		//     console.log(this.$data.solution);
		//     this.methods.initialize(this.solution);
		// },

		methods: {
			// initialize(solution: ILoadedSolution) {
			// 	// debugger;

			// 	const ref = solution.projects[0].references[0];
			// 	ref.assets.forEach((asset: IAsset) => {
			// 		this.$data.desserts.push({
			// 			id: asset.id,
			// 			icon:
			// 				asset.file.type === 'video'
			// 					? 'local_movies'
			// 					: 'audio'
			// 					? 'music_note'
			// 					: 'insert_drive_file',
			// 			title: asset.title,
			// 			description: asset.desc,
			// 			file: asset.file,
			// 		});
			// 	});

			// 	// this.desserts = [
			// 	//   {
			// 	//     id:"fb79aca7-3935-4e7a-ac91-bc077d0876d0",
			// 	//     icon:'music_note',
			// 	//     title: 'Frozen Yogurt',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"527e5e42-5938-4f54-a00a-4912663abacc",
			// 	//     icon:'local_movies',
			// 	//     title: 'Ice cream sandwich',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"64c2fcd3-4113-4370-b899-5dd853f61f8f",
			// 	//     icon:'music_note',
			// 	//     title: 'Eclair',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"e3d218e8-f60d-41f5-b0b2-e702378a8ec6",
			// 	//     icon:'music_note',
			// 	//     title: 'Cupcake',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"1842ba2d-4218-4550-87ff-40526d7e55bf",
			// 	//     icon:'music_note',
			// 	//     title: 'Gingerbread',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"52d3a224-6025-4d28-a878-4b8df2c49db5",
			// 	//     icon:'music_note',
			// 	//     title: 'Jelly bean',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"8a76cde3-b0f8-44d1-962e-e953f6a91c45",
			// 	//     icon:'local_movies',
			// 	//     title: 'Lollipop',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"7844412b-861f-454d-9711-d389a95fafd5",
			// 	//     icon:'local_movies',
			// 	//     title: 'Honeycomb',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"ecb90839-3975-4f01-bdaf-a8daa7546f4c",
			// 	//     icon:'local_movies',
			// 	//     title: 'Donut',
			// 	//     description:'Description'
			// 	//   },
			// 	//   {
			// 	//     id:"38837309-5a4f-4eea-9d36-06c56f9e75c2",
			// 	//     icon:'local_movies',
			// 	//     title: 'KitKat',
			// 	//     description:'Description'
			// 	//   }
			// 	// ]
			// },

			playItem(item: any) {
				// debugger;
				const assetId = item.id;
				// debugger
				this.$store.dispatch(
					t.solution.ActionTypes.selectAssetItem,
					assetId
				);
				// let xxxxx = this.$store.getters.currentAsset;
				//  editedIndex = this.desserts.indexOf(item)
				// this.editedItem = Object.assign({}, item)
				// this.dialog = true
			},
			editItem(item: any) {
				this.$data.editedIndex = this.$data.desserts.indexOf(item);
				this.$data.editedItem = Object.assign({}, item);
				this.$data.dialog = true;
			},

			deleteItem(item: any) {
				const index = this.$data.desserts.indexOf(item);
				const ok = confirm('Are you sure you want to delete this item?');
				if (ok) {
					this.$data.desserts.splice(index, 1);
				}
			},

			close() {
				close(this);
			},

			save() {
				if (this.$data.editedIndex > -1) {
					Object.assign(
						this.$data.desserts[this.$data.editedIndex],
						this.$data.editedItem
					);
				} else {
					this.$data.desserts.push(this.$data.editedItem);
				}
				close(this);
			},
		},
	});

	function close(vue: Vue) {
		vue.$data.dialog = false;
		setTimeout(() => {
			vue.$data.editedItem = Object.assign({}, vue.$data.defaultItem);
			vue.$data.editedIndex = -1;
		}, 300);
	}
</script>

<style>
	.cp-assets-table .v-table__overflow {
		overflow: hidden;
	}
</style>
