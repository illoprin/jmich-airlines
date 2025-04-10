<script>
import StandartDropdown from '../UI/StandartDropdown.vue';
import StandartModal from '../UI/StandartModal.vue';
import { get_company_all } from '@/http/companyAPI';
import { add_flight } from '@/http/flightAPI';
import { fetch_city } from '@/http/cityAPI';
import { redirect } from '@/utils/tools';
import { ADMIN_ROUTES } from '@/utils/config';

export default {
	components: { StandartModal, StandartDropdown },
	props: {
		shown: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			ico_plane: '/src/assets/static/ico/plane_01.svg',
			loaded: false,
			form_data: this.empty_form(),
			cities: null,
			companies: null
		}
	},
	async mounted() {
		this.cities = await fetch_city(this);
		this.companies = await get_company_all(this);
		this.loaded = true;
	},
	computed: {
		check_valid() {
			let hasEmpty = false;
			for (const [key, value] of Object.entries(this.form_data))
				hasEmpty = !value || value == '' ? true : hasEmpty;
			return !hasEmpty;
		},
	},
	methods: {
		async submit() {
			const request = {
				company_id: this.form_data.company.id,
				departure_id: this.form_data.departure_city.id,
				arrival_id: this.form_data.arrival_city.id,
				departure_datetime: this.form_data.departure_datetime,
				arrival_datetime: this.form_data.arrival_datetime,
				seats_available: this.form_data.seats_available,
				price: this.form_data.price,
				route_code: this.form_data.route_code
			};

			await add_flight(this, request);
			this.$emit('flight_added');
		},
		empty_form() {
			return {
				departure_city: null,
				arrival_city: null,
				departure_datetime: '',
				arrival_datetime: '',
				company: null,
				route_code: '',
				price: Math.floor(Math.random() * 5000),
				seats_available: (20 + Math.floor(Math.random() * 15)),
			};
		}
	}
}

</script>

<template>
	<standart-modal :id="'add_flight_modal'" :shown="shown" :type="'modal-lg'" @on_hide="$emit('on_hide')">
		<template v-slot:header>
			<h5 class="modal-title fw-bold">
				Добавить новый перелёт
			</h5>
		</template>
		<template v-slot:body v-if="loaded">
			<div class="row">
				<div class="col-4">
					<standart-dropdown
						:type="'btn-success'" 
						:options="this.companies"
						v-model:value="form_data.company"
					>
						Авиакомпания
					</standart-dropdown>
				</div>
			</div>

			<div class="row align-items-center mt-3">
				<div class="col">
					<standart-dropdown
						:type="'btn-primary'" 
						:options="this.cities"
						v-model:value="form_data.departure_city"
					>
						Выберете город вылета
					</standart-dropdown>
				</div>
				<div class="col text-center">
					<img :src="ico_plane" alt="">
				</div>
				<div class="col">
					<standart-dropdown
						:type="'btn-primary'" 
						:options="this.cities"
						v-model:value="form_data.arrival_city"
					>
						Выберете город прибытия
					</standart-dropdown>
				</div>
			</div>

			<div class="row align-items-center mt-3">
				<div class="col">
					<input 
						type="datetime-local" 
						class="form-control"
						data-time="true"
						v-model="form_data.departure_datetime"
					>
				</div>
				<div class="col text-center fs-3">
					🕗
				</div>
				<div class="col">
					<input type="datetime-local" 
						class="form-control"
						data-time="true"
						v-model="form_data.arrival_datetime"
					>
				</div>
			</div>
			<div class="row align-items-center mt-3">
				<div class="col-4">
					<input type="text" 
						maxlength="4" 
						class="form-control" 
						placeholder="Код маршрута" 
						v-model="form_data.route_code"
					>
				</div>
				<div class="col-4">
					<input type="text" 
						maxlength="6" 
						class="form-control" 
						placeholder="Цена" 
						v-model.number="form_data.price"
					>
				</div>
				<div class="col-4">
					<input type="text" 
						maxlength="2" 
						class="form-control" 
						placeholder="Количество мест" 
						v-model.number="form_data.seats_available"
					>
				</div>
			</div>

		</template>
		<template v-slot:footer>
			<div class="d-flex justify-content-between w-100">
				<button 
					type="button" 
					class="btn btn-secondary" 
					data-bs-dismiss="modal"

				>
					Закрыть
				</button>
				<button 
					type="button" 
					class="btn btn-success" 
					@click="submit()"
					:disabled="!check_valid"
				>
					Добавить
				</button>
			</div>
		</template>
	</standart-modal>
</template>
