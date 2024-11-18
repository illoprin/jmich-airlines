<script>
import OrderList from '@/components/sections/OrderList.vue';
import SpinnerComponent from '@/components/sections/SpinnerComponent.vue';
import ConfirmDialog from '@/components/popups/ConfirmDialog.vue';
import { get_order_list, change_order_status } from '@/utils/api';
import OrderModal from '@/components/popups/OrderModal.vue';
import SortTypeSelector from '@/components/blocks/SortTypeSelector.vue';
import RowHeader from '@/components/UI/RowHeader.vue';

export default {
    data() {
        return {
            view: 'active',
			sort_options: [
				{ value: 'active', name: 'Активные перелёты' },
				{ value: 'completed', name: 'Завершённые перелёты' },
				{ value: 'cancelled', name: 'Отменённые', highlight: 'btn-outline-danger' },
			],

            order_list: null,
			loaded: false,

			modal_shown: false,
			modal_purchase_id: 0,
			selected_order: null,

			confirm_modal_shown: false,
			confirm_message: '',
			request_cancel_order: undefined,
        };
    },
    async mounted() {
        this.order_list = (await get_order_list(this)).purchase;
		console.log(this.order_list);
		this.loaded = true;
    },
	methods: {
		get_order_by_id(purchase_id) {
			return this.order_list.filter(
				item => item.purchase_id == purchase_id
			)[0];
		},

		toggle_modal_id(purchase_id) {
			this.modal_purchase_id = purchase_id;
			this.modal_shown = true;
			this.selected_order = this.get_order_by_id(purchase_id);
		},
		hide_modal() {
			this.modal_shown = false;
		},

		request_cancel(purchase_id) {
			this.confirm_modal_shown = true;
			this.request_cancel_order = this.get_order_by_id(purchase_id);
			this.confirm_message = 
			`Вы действительно хотите аннулировать билет на рейс ${this.request_cancel_order.route_code} ${this.request_cancel_order.departure_city} — ${this.request_cancel_order.arrival_city}`;
		},
		async cancel_order() {
			this.confirm_modal_shown = false;
			const put_result = await change_order_status(this, this.request_cancel_order.purchase_id);
			this.order_list = (await get_order_list(this)).purchase;
			this.request_cancel_order = undefined;
		},

		change_view(selected) {
			this.view = selected;
		}
	},
	computed: {
		get_sorted_order_list() {
			return this.order_list.filter(item => 
				(((item.status == 1 || item.status == 2) && item.purchase_status != 0) && this.view == 'active') ||
				(item.status == 0 && this.view == 'completed' && item.purchase_status != 0) ||
				((item.status == 4 || item.purchase_status == 0) && this.view == 'cancelled'))
		},
	},
    components: { 
		OrderList, 
		SpinnerComponent, 
		ConfirmDialog, 
		OrderModal, 
		SortTypeSelector, 
		RowHeader 
	}
}
</script>

<template>
	<!-- Order Section -->
	<div class="w-100 h-100" id="order">
		<row-header>
			<template v-slot:left>
					Управление заказами
			</template>
			<template v-slot:right>
				<sort-type-selector 
					:sort_options="sort_options" 
					v-model:sort-model="view"
				/>
			</template>
		</row-header>

		
		<div v-if="loaded && get_sorted_order_list.length > 0">
			<order-list 
				:order_list="get_sorted_order_list"
				:show_order_modal="toggle_modal_id"
				:cancel_order="request_cancel"
			/>
			<order-modal
				:shown="modal_shown"
				:order="selected_order"
				@on_hide="hide_modal"
			/>

			<confirm-dialog
				:shown="confirm_modal_shown"
				:title="'Отмена заказа'" 
				:message="confirm_message" 
				@confirmed="cancel_order"
			/>
		</div>
		<div v-else-if="loaded && get_sorted_order_list.length == 0">
			<div class="w-100 text-center">
				<h2 class="fs-2 fw-bold mt-5">
					Сделайте первый заказ 😉
				</h2>
				<router-link 
					class="btn btn-success text-decoration-none mt-5" 
					:to="{ name: 'search' }"
				>
					На страницу поиска
				</router-link>
			</div>
		</div>
		<div v-else>
			<spinner-component />
		</div>
	</div>
</template>
