<script>
import { fetch_flight, change_flight_status, delete_flight } from '@/http/adminAPI';
import SpinnerComponent from './SpinnerComponent.vue';
import RowHeader from '@/components/UI/RowHeader.vue';
import AdminFlightItem from '@/components/items/AdminFlightItem.vue';

import AddFlightModal from '../popups/AddFlightModal.vue';
import { has_empty_fields } from '@/utils/tools';

export default {
	data() {
		return {
			ico_plus: '/src/assets/static/ico/plus.svg',
			loaded: false,

			page: 0,
			flights: undefined,
			checked: [],

			new_flight_modal_shown: false,
			new_flight_form_data: {},
		};
	},
	async mounted() {
		this.flights = await fetch_flight(this, 6);
		this.loaded = true;
	},
	computed: {
		get_sorted_list() {
			return this.flights.filter(item => item.page <= this.page);
		}
	},
	methods: {
		show_new_flight_modal() {
			this.new_flight_modal_shown = true;
			this.new_flight_form_data = {};
		},
		hide_new_flight_modal() {
			this.new_flight_modal_shown = false;

		},

		async add_new_flight() {
			if (!has_empty_fields(this.new_flight_form_data)) {
				this.new_flight_modal_shown = false;
			} else {
				alert('Присутствуют пустые поля');
			}
		},
		async change_flights(action_type) {
			console.log(action_type, this.checked);
			for (const id of this.checked) {
				switch (action_type) {
					case 'cancel':
						await change_flight_status(this, id, 4);
						break;
					case 'delay':
						await change_flight_status(this, id, 2);
						break;
					case 'active':
						await change_flight_status(this, id, 1);
						break;
					case 'complete':
						await change_flight_status(this, id, 0);
						break;
					case 'delete':
						await delete_flight(this, id);
						break;
				}
			}
			this.flights = await fetch_flight(this, 6);
		},
	},
	components: { SpinnerComponent, RowHeader, AdminFlightItem, AddFlightModal }
}
</script>
<template>
	<div class="w-100" v-if="loaded">
		<row-header>
			<template v-slot:left>
				Управление перелётами
			</template>
			<template v-slot:right>
				<div class="d-flex gap-2" style="margin-right: 20%">
					<button class="btn btn-primary" title="Рандомизировать перелёты">
					🎲
					</button>
					<button class="btn btn-success d-flex" @click="show_new_flight_modal()" title="Добавить перелёт">
						<img :src="ico_plus" width="18" class="m-auto">
					</button>
				</div>
				
				<button class="btn btn-danger" title="Отменить выбранные перелёты" @click="change_flights('cancel')">
					📍
				</button>
				<button class="btn btn-warning" title="Задержать выбранные перелёты" @click="change_flights('delay')">
					🕗
				</button>
				<button class="btn btn-success" title="Активировать выбранные перелёты" @click="change_flights('active')">
					✅
				</button>
				<button class="btn btn-success" title="Завершить выбранные перелёты" @click="change_flights('complete')">
					👍
				</button>
				<button class="btn btn-danger" title="Удалить выбранные перелёты" @click="change_flights('delete')">
					❌
				</button>
			</template>
		</row-header>

		<div class="w-100 row p-3 g-1">
			<div class="col-6 p-2" v-for="flight in get_sorted_list" :key="flight.id" >
				<admin-flight-item 
					:flight="flight" 
					v-model:checked_items="checked"
					class="h-100"
				/>
			</div>
			<div class="col-12">
				<button class="btn btn-outline-primary w-100" @click="page++">
					Загрузить ещё
				</button>
			</div>
		</div>
		

		<add-flight-modal 
			:shown="new_flight_modal_shown" 
			:form_data="new_flight_form_data" 
			@on_hide="hide_new_flight_modal" 
			@add_flight_request="add_new_flight" 
		/>

	</div>
	<div v-else>
		<spinner-component />
	</div>
</template>