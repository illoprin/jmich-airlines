<script>
import { add_promo, delete_promo, get_all_promo } from '@/http/promoAPI';
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
			promo: undefined,
			form_data: {}
		}
	},
	async mounted() {
		await this.update_list();
		this.loaded = true;
	},
	methods: {
		async remove_item(id) {
			await delete_promo(this, id);
			await this.update_list();
		},
		async add_item() {
			if (!has_empty_fields(this.form_data) && this.form_data.discount.includes('%')) {
				this.form_data.discount = Number(this.form_data.discount.replace(/[^0-9]/, '')) / 100;
				console.log(this.form_data);
				await add_promo(this, this.form_data);
				this.form_data = {};
				await this.update_list();
			}else {
				alert('Некорректный ввод!');
			}
		},
		async update_list() {
			this.promo = await get_all_promo(this);
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
				<div class="w-100 d-flex flex-column gap-3">
					<div class="row hover_effect" v-for="(item, index) in promo" :key="item.id">
						<div class="col-8">
							<ul class="list-group list-group-horizontal">
								<li class="list-group-item bg-body-secondary">{{ item.id }}</li>
								<li class="list-group-item bg-body-secondary">{{ item.code }}</li>
								<li class="list-group-item bg-body-secondary">{{ `${item.discount * 100}%` }}</li>
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
					<input type="text" placeholder="Код" class="form-control" v-model="form_data.code">
				</div>
				<div class="col-4">
					<input type="text" placeholder="Скидка" class="form-control" v-model="form_data.discount">
				</div>
				<div class="col-4 text-end">
					<button class="btn btn-primary" @click="add_item()"> Добавить </button>
				</div>
			</div>
		</template>
	</standart-modal>
</template>
