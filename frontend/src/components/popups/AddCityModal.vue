<script>
import { fetch_city, delete_city, add_city } from '@/http/cityAPI';
import StandartModal from '../UI/StandartModal.vue';
import { has_empty_fields, prepare_form_data } from '@/utils/tools';


export default {
	components: { StandartModal },

	props: {
		shown: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			loaded: false,
			cities: [],
			form_data: {
				name: '',
				airport_code: '',
			}
		}
	},
	async mounted() {
		await this.update_state();
		console.log(this.cities);
		this.loaded = true;
	},
	methods: {
		async remove_item(id) {
			await delete_city(this, id);
			await this.update_state();
		},
		async add_item() {
			if (!has_empty_fields(this.form_data)) {
				this.form_data = prepare_form_data(this.form_data, true);
				await add_city(this, this.form_data);
				await this.update_state();
				this.form_data = {};
			}
		},


		async update_state() {
			this.cities = await fetch_city(this);
		},
	},
}

</script>

<template>
	<standart-modal 
		:id="'add_city_modal'" 
		:shown="shown" 
		@on_hide="$emit('on_hide')"
	>
		<template v-slot:header>
			<h5 class="modal-title fw-bold">
				База городов
			</h5>
		</template>
		<template v-slot:body>
			<div v-if="loaded">
				
				<div class="w-100 d-flex flex-column gap-3">
					<div class="row hover_effect" v-for="(item, index) in cities" :key="item.id">
						<div class="col-8">
							<ul class="list-group list-group-horizontal">
								<li class="list-group-item bg-body-secondary">{{ item.id }}</li>
								<li class="list-group-item bg-body-secondary">{{ item.name }}</li>
								<li class="list-group-item bg-body-secondary">{{ item.airport_code }}</li>
							</ul>
						</div>
						<div class="col-4 text-end">
							<button class="btn btn-danger" @click="remove_item(item.id)">
								🗑
							</button>
						</div>
					</div>
				</div>

				

			</div>
			<div v-else></div>
		</template>

		<template v-slot:footer>
			<div class="row w-100">
				<div class="col-4">
					<input type="text" placeholder="Город" class="form-control" v-model="form_data.name">
				</div>
				<div class="col-4">
					<input type="text" placeholder="Код аэропорта" class="form-control" v-model="form_data.airport_code">
				</div>
				<div class="col-4 text-end">
					<button class="btn btn-primary" @click="add_item()"> Добавить </button>
				</div>
			</div>
		</template>

	</standart-modal>
</template>
