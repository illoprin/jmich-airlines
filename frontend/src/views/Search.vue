<script>
import SearchResult from '@/components/sections/SearchResult.vue';
import SearchBar from '@/components/sections/Searchbar.vue';
import HomeHeader from '@/components/blocks/HomeHeader.vue';
import { has_empty_fields } from '@/utils/tools';
import { get_all_flights, search_flights } from '@/http/flightAPI';
import { toRaw } from 'vue';

export default {

	data() {
		return {
			submitted: false,
			searched: false,
			search_data: {
				departure_city: '',
				arrival_city: '',
				date: '',
				seats: null,
			},
			page: 0,
			flights: undefined
		}
	},

	components: {
    	SearchBar, SearchResult, HomeHeader
	},

	methods: {
		async submit() {
			this.search_data.date = document.getElementsByName('date')[0].value + " 00:00";
			let flights = null
			if (!has_empty_fields(this.search_data)) {
				// Axios - http://localhost:8001/flight/search
				flights = await search_flights(this, toRaw(this.search_data));
				this.flights = flights;
			}else {
				flights = await get_all_flights(this, 3);
				this.flights = flights;
			}
			if (flights) {
				if (flights.length > 0) {
					this.submitted = true;
					this.searched = true;
				}
				else {
					this.submitted = true;
					this.searched = false;
				}
			}
		},
		load_new_page() {
			this.page++;
		}
	},
	computed: {
		get_sorted_list() {
			if (this.submitted && this.searched) {
				let min_price = Number.MAX_VALUE;
				let min_index = undefined;
				let flights_copy = this.flights.filter(item => item.page <= this.page).map((item, index) => {
					if (item.price < min_price) {
						min_index = index;
						min_price = item.price;
					}
					item.cheapest = false;
					return item;
				});
				flights_copy[min_index].cheapest = true;
				return flights_copy;
			}
		},

	}
}
</script>

<template>
	<div class="search_page pb-5">
		<HomeHeader />
		<SearchBar :submitted="submitted" :searched="searched" :submit="submit" :search_data="search_data"/>
		<Transition>
			<div v-if="submitted && searched">
				<SearchResult :search_result="get_sorted_list" :search_data="search_data" @load_more="load_new_page()"/>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 1.5s, transform 700ms;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateY(100px);
}
</style>