<script>
import Datepicker from '@/vendor/datepicker/src';
import '@/vendor/datepicker/dist/css/datepicker.minimal.css';
import '@/assets/style/datepicker_customize.css';
import { fetch_city } from '@/http/cityAPI';
import { has_empty_fields } from '@/utils/tools';

export default {
	data() {
		return {
			cities: {},

			btn_label: 'Найти билеты',
		}
	},
	async mounted() {
		var datepicker = new Datepicker('#datepicker', {
			classNames: {
				node: 'datepicker custom'
			},
			serialize: (date) => {
				let str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
				return str;
			}
		});

		try {
			const cities = await fetch_city(this);
			this.cities = cities;
		} catch (e) {
			console.log(e);
		}
	},
	computed: {
		get_header() {
			if (this.submitted && !this.searched) {
				return 'билеты не найдены 😪'
			}else if (this.submitted && this.searched) {
				return 'мы нашли билеты!'
			}else if (!this.submitted && !this.searched){
				return 'летаем с одним крылом!'
			}
		}
	},
	methods: {
		on_input() {
			this.btn_label = has_empty_fields(this.search_data) ? 'Куда угодно' : 'Найти билеты';
		}
	},

	props: {
		submit: {
			type: Function,
			required: true,
		},
		search_data: {
			type: Object,
			required: true,
		},
		submitted: {
			type: Boolean,
			required: true,
		},
		searched: {
			type: Boolean,
			required: true
		}
	}
}
</script>


<template>
	<div class="container-fluid d-flex flex-column align-items-center justify-content-center h-75">
		<span class="logo mb-5">🛫</span>
		<h1 class="text-uppercase fw-bold">{{ get_header }}</h1>
		<form class="mt-5 w-100" @submit.prevent="submit()">
			<div class="row w-75 m-auto">
				<div class="col-3 p-1">
					<select 
						class="form-select rounded-start-5 p-3" 
						aria-label="Выбор города" 
						@input="e => {on_input(); search_data.departure_city = e.target.value}"
					>
						<option class="" value="" selected>Откуда 📍</option>
						<option :value="`${city.name}`" v-for="(city, index) in cities" :key="index">{{ city.name }}</option>
					</select>
				</div>
				<div class="col-3 p-1">
					<select 
						class="form-select p-3" 
						aria-label="Выбор города" 
						@input="e => {on_input(); search_data.arrival_city = e.target.value}"
					>
						<option class="" value="" selected>Куда 📍</option>
						<option :value="`${city.name}`" v-for="(city, index) in cities" :key="index">{{ city.name }}</option>
					</select>
				</div>
				<div class="col-2 p-1">
					<input 
						class="form-control p-3" 
						type="text" 
						placeholder="Когда 🕖" 
						id="datepicker" 
						name="date"
						@input="on_input()"
					/>
				</div>
				<div class="col-2 p-1">
					<input 
						type="number" 
						class="form-control p-3" 
						min="0" max="32" 
						placeholder="Сколько мест 🍾" 
						v-model="search_data.seats"
						@input="on_input()"
					>
				</div>
				<div class="col-2 p-1">
					<button type="submit" class="btn w-100 h-100 rounded-end-5 btn-primary btn-search fw-bolder">{{ btn_label }}</button>
				</div>

			</div>
		</form>
	</div>
</template>