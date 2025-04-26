<script>
import OrderItem from '@/components/items/AdminOrderItem.vue';
import SpinnerComponent from './SpinnerComponent.vue';
import { fetch_order, get_user_profile } from '@/http/adminAPI';
import { change_order_status } from '@/http/purchaseAPI';
import ConfirmDialog from '@/components/popups/ConfirmDialog.vue';
import OrderModal from '@/components/popups/OrderModal.vue';
import UserModal from '@/components/popups/UserModal.vue';
import RowHeader from '@/components/UI/RowHeader.vue';
import UserOrderItem from '../items/UserOrderItem.vue';


export default {
	components: { OrderItem, SpinnerComponent, OrderModal, ConfirmDialog, UserModal, RowHeader, UserOrderItem },
	data() {
		return {
			loaded: false,
			order_list: undefined,

			selected_order: undefined,
			order_modal_shown: false,

			confirm_modal_shown: false,
			confirm_message: '',
			request_delete: undefined,

			selected_user: undefined,
			user_modal_shown: false,
		}
	},
	async mounted() {
		this.order_list = (await fetch_order(this));
		console.log(this.order_list);
		this.loaded = true;
	},
	methods: {
		get_order_by_id(purchase_id) {
			return this.order_list.filter(
				item => item.purchase_id == purchase_id
			)[0];
		},

		// Request cancel action
		request_cancel_order(purchase_id) {
			this.confirm_modal_shown = true;
			this.request_delete = this.get_order_by_id(purchase_id);
			const { login, departure_city, arrival_city } = this.request_delete;

			this.confirm_message = `Вы действительно хотите аннулировать билет пользователя ${login} на рейс ${departure_city} — ${arrival_city}`;
		},
		// Cancel order action
		async cancel_order() {
			this.confirm_modal_shown = false;
			await change_order_status(this, this.request_delete.purchase_id);
			this.order_list = (await fetch_order(this));
			this.request_delete = undefined;
		},

		// Order modal handle
		show_order_modal(purchase_id) {
			this.selected_order = this.get_order_by_id(purchase_id);
			this.order_modal_shown = true;
		},
		hide_order_modal() {
			this.order_modal_shown = false;
		},

		// User profile modal handle
		async show_user_modal (client_id) {
			this.selected_user = (await get_user_profile(this, client_id)).result;
			this.user_modal_shown = true;
		},
		hide_user_modal () {
			this.user_modal_shown = false;
			this.selected_user = undefined;
		},
		
	},
	
}
</script>

<template>
	<div class="w-100" v-if="loaded">
		<row-header>
			<template v-slot:left>
				Все билеты
			</template>
		</row-header>

		<!-- List -->
		<div class="d-flex p-3 flex-column gap-3">
			<order-item 
				:order="order" 
				v-for="(order, index) in order_list"
				:key="order.purchase_id"
				:index="index"
				:request_cancel_order="request_cancel_order" 
				:show_order_modal="show_order_modal"

				:show_user_modal="show_user_modal"
			/>
		</div>

		<order-modal 
			:shown="order_modal_shown"
			:order="selected_order"
			@on_hide="hide_order_modal"
		/>

		<confirm-dialog
			:title="'Запрос на удаление'" 
			:message="confirm_message"
			:shown="confirm_modal_shown"
			@confirmed="cancel_order"
		/>

		<user-modal
			:user="selected_user"
			:shown="user_modal_shown"
			@on_hide="hide_user_modal"
		/>

	</div>
	<div class="w-100 h-100 d-flex align-items-center justify-content-center" v-else>
		<SpinnerComponent />
	</div>
</template>


