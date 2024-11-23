<script>
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
			companies: undefined,
			form_data: {
				name: '',
				logo_src: '',
			}
		}
	},
	async mounted() {
		await this.update_list();
		this.loaded = true;
	},
	methods: {
		async remove_item(id) {
			
		},
		async add_item() {
			if (!has_empty_fields(this.form_data)) {
				
				await this.update_list();
			}
		},
		async update_list() {
			
		}
	},
}

</script>

<template>
	<standart-modal 
		:id="'add_promo_modal'" 
		:shown="shown" 
		@on_hide="$emit('on_hide')"
	>
		<template v-slot:header>
			<h5 class="modal-title fw-bold">
				База промо-кодов
			</h5>
		</template>
		<template v-slot:body>
			<div v-if="loaded">
			
			</div>
			<div v-else></div>
		</template>
		<template v-slot:footer>

		</template>
	</standart-modal>
</template>
