<script>
import StandartModal from '@/components/UI/StandartModal.vue';
import { format_price } from '@/utils/tools';

export default {
	props: {
		order: {
			type: Object,
			required: false,
			default: null
		},
		shown: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	components: { StandartModal },
	methods: {
		format_id(id) {
			return String(id).padStart(4, '0');
		},
		get_total_cost(order) {
			return format_price(order.cost);
		},
		get_qr_url(order) {
			return order.qr
		},
	},
}
</script>

<template>
	<standart-modal 
		:id="'order_modal'" 
		:shown="shown" 
		@on_hide="$emit('on_hide')"
	>
		<template v-slot:header>
			<h5 class="modal-title fw-bolder">
				{{ `Заказ ID${format_id(order.purchase_id)}` }}
			</h5>
		</template>

		<template v-slot:body>
			<div class="text-center">
				<img :src="get_qr_url(order)" width="300" class="p-2 border rounded-2 order_qr">
				<p class="m-0">Просто покажите QR код на стойке регистрации</p>
			</div>
			<div class="row mt-5">
				<div class="col-4">
					<h5 class="text-secondary m-0">Код рейса</h5>
					<h4 class="m-0 fw-semibold">{{ order.route_code }}</h4>
				</div>
				<div class="col-4 text-center">
					<h5 class="text-secondary m-0">Места</h5>
					<h4 class="m-0 fw-semibold">{{ order.seats }}</h4>
				</div>
				<div class="col-4 text-end">
					<h5 class="text-secondary m-0">Стоимость</h5>
					<h4 class="m-0 fw-semibold">{{ get_total_cost(order) }}</h4>
				</div>
			</div>
		</template>

		<template v-slot:footer>
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
		</template>
	</standart-modal>
</template>

