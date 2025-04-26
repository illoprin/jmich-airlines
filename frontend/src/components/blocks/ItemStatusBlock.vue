<script>
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
	props: {
		status: {
			type: Number,
			required: true,
		},
		purchase_status: {
			type: Number,
			required: true,
		}
	}
}
</script>

<template>
	<h5 class="fs-5 m-0" :class="{
		'text-success': (status == 1 || status == 0) && purchase_status != 0,
		'text-warning': status == 2 && purchase_status != 0,
		'text-danger': status == 4 || purchase_status == 0
	}">
		<div v-if="status == 1 && purchase_status != 0">
			{{ active_text }}
		</div>
		<div v-else-if="status == 0 && purchase_status != 0">
			{{ completed_text }}
		</div>
		<div v-else-if="status == 2 && purchase_status != 0">
			{{ delayed_text }}
		</div>
		<div v-else-if="status == 4">
			{{ cancelled_text }}
		</div>
		<div v-else-if="purchase_status == 0">
			{{ cancelled_order_text }}
		</div>
	</h5>
</template>
