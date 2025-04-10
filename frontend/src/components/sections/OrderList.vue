<script>
import Order from '@/components/items/UserOrderItem.vue';
import OrderModal from '@/components/popups/OrderModal.vue';

export default {
	data() {
		return {
			key_modal: 0,
		}
	},
	props: {
		order_list: {
			type: Object,
			required: true,
		},
		show_order_modal: {
			type: Function,
			required: false,
		},
		cancel_order: {
			type: Function,
			required: true,
		}
	},
	methods: {
	},
	components: { Order, OrderModal }
}
</script>

<template>
	<div v-if="order_list.length > 0" class="d-flex flex-column gap-3 p-4">
		<TransitionGroup name="slide">
			<order v-for="(order, index) in order_list" :key="order.flight_id" :order="order"
				@show_order_modal="show_order_modal" @cancel_order="cancel_order" />
		</TransitionGroup>
	</div>
</template>

<style scoped>
.slide-move,
.slide-enter-active,
.slide-leave-active {
	transition: all 300ms;
}

.slide-enter-from,
.slide-leave-to {
	opacity: 0;
	transform: translateX(100px);
}

.slide-leave-active {
	position: absolute;
}
</style>