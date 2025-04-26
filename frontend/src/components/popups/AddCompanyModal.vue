<script>
import StandartModal from '../UI/StandartModal.vue';
import { has_empty_fields, prepare_form_data } from '@/utils/tools';
import { get_company_all, add_company, remove_company } from '@/http/companyAPI';


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
			companies: undefined,
			form_data: {
				name: '',
				logo: null,
			}
		}
	},
	async mounted() {
		await this.update_list();
		this.loaded = true;
	},
	methods: {
		async remove_item(id) {
			await remove_company(this, id);
			await this.update_list();
		},
		async add_item() {
			console.log(this.form_data);
			
			if (!has_empty_fields(this.form_data)) {
				await add_company(this, this.form_data);
				await this.update_list();
			}
		},
		async update_list() {
			this.companies = await get_company_all(this);
		}
	},
}

</script>

<template>
	<standart-modal 
		:id="'add_company_modal'" 
		:shown="shown" 
		@on_hide="$emit('on_hide')"
	>
		<template v-slot:header>
			<h5 class="modal-title fw-bold">
				База авиакомпаний
			</h5>
		</template>
		<template v-slot:body>
			<div v-if="loaded">

				<div class="d-flex flex-column gap-3">

					<div 
						class="row w-100 align-items-center p-3 border rounded-3 m-0 hover_effect" 
						v-for="item in companies" 
						:key="item.id"
					>
						<div class="col-6 p-0">
							<h5>
								{{ item.name }}
							</h5>
						</div>
						<div class="col-3 p-0">
							<img 
								:src="item.logo_src" 
								:alt="item.name + ' Logo'"
								class="object-fit-contain"
								width="100"
								height="100"
							>
						</div>
						<div class="col-3 p-0 text-end">
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
					<input type="text" class="form-control" v-model="form_data.name">
				</div>
				<div class="col-4">
					<input 
						type="file" 
						class="form-control" 
						@change="e => form_data.logo = e.target.files[0]"
					>
				</div>
				<div class="col-4 text-end">
					<button class="btn btn-primary" @click="add_item()"> Добавить </button>
				</div>
			</div>
		</template>
	</standart-modal>
</template>
