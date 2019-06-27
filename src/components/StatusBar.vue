<template>
	<!-- <v-system-bar inset status color="primary" lights-out>
		<v-spacer></v-spacer>
		<v-icon>network_wifi</v-icon>
		<v-icon>signal_cellular_null</v-icon>
		<v-icon>battery_full</v-icon>
		<span>12:30</span>
	</v-system-bar> -->
	<v-footer app style="position:absolute;margin-bottom:2px;">
      	<span class="cp-footer-item"> CoderPlay &copy; {{copyrightYears}}</span>
    </v-footer>
</template>

<script>
export default {
	data:()=>({
		//copyrightYears:'2019'
	}),
	computed:{
		copyrightYears(){
			//debugger;
			let 	firstYear= 2019,
				curYear=new Date().getFullYear();
			if(curYear<=firstYear){
				return firstYear;
			}
			return firstYear +' - '+curYear;
		},
	},
}
</script>


<style>
.theme--dark.v-footer{
	background-color:#2D2D2E;
}
.cp-footer-item {
	font-size:.75em;
	padding:15px;
	color: #909090;
}
.theme--dark .cp-footer-item{
	color: #aaa;
}
</style>
