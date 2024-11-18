<script>
import FlightInfoSnippet from '@/components/blocks/FlightInfoSnippet.vue';
import StandartItem from '@/components/UI/StandartItem.vue';
import ItemStatusBlock from '../blocks/ItemStatusBlock.vue';

export default {
	data() {
		return {
			active_text: '✔️ Активен',
            completed_text: '👍 Завершён',
            delayed_text: '🕖 Задерживается',
            cancelled_text: '❌ Отменён',
            cancelled_order_text: '❌ Заказ отменён',
		}
	},
	methods: {
		format_id(id) {
			return String(id).padStart(4, '0');
		},
		toggle_user_modal(client_id) {
			this.$emit('toggle_user_modal', client_id)
		}
	},
	props: {
		order: {
			type: Object,
			required: true,
		},
		request_cancel_order: {
			type: Function,
			required: true,
		},
		show_order_modal: {
			type: Function,
			required: true,
		},
		show_user_modal: {
			type: Function,
			required: true,
		}
	},
	components: { FlightInfoSnippet, StandartItem, ItemStatusBlock }
}
</script>

<template>
	<standart-item class="order" :class="{
		'active': order.status == 1,
		'delay': order.status == 2,
		'cancelled': (order.status == 4 || order.purchase_status == 0)
	}">
		<div class="row d-flex justify-content-between mb-3">
			<div class="col-md-auto">
				<h3 class="m-0 fw-bold">
					Заказ ID{{ format_id(order.purchase_id) }}
				</h3>
			</div>
			<div class="col-5 d-flex gap-2 justify-content-end">
				<button class="btn btn-danger" title="Удалить заказ" @click="request_cancel_order(order.purchase_id)">
					💔
				</button>
				<button class="btn btn-primary" title="Информация по заказу" @click="show_order_modal(order.purchase_id)">
					💬
				</button>
			</div>
		</div>

		<div class="row">
			<div class="col-4">


				<div class="row h-100 user_select" @click="show_user_modal(order.client_id)" title="Посмотреть информацию о клиенте">
					<div class="col-4">
						<img :src="order.avatar_src" width="80" height="80" :alt="order.login" class="rounded-circle object-fit-cover">
					</div>
					<div class="col-8 d-flex flex-column">
						<p class="m-0 text-secondary">Сделал заказ</p>
						<h5 class="fw-bold m-0">
							{{ `${order.firstname} ${order.secondname}` }}
						</h5>
					</div>
				</div>


			</div>
			<div class="col-8">
				<flight-info-snippet class="m-0 p-0" :flight_data="order" />
			</div>
		</div>

		<item-status-block :status="order.status" :purchase_status="order.purchase_status" class="mt-3"/>
	</standart-item>
</template>

<style></style>
