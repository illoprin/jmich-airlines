<script>
import { parse_responce_date, date_delta, date_to_locale } from '@/utils/tools';
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
        };
    },
    props: {
        order: {
            type: Object,
            required: true,
        },
    },
    methods: {
        parse_date(res_datetime) {
            const date_string = date_to_locale(parse_responce_date(res_datetime)).split(' ');
            return date_string[0] + " " + date_string[1];
        },
        get_date_delta(res_date_1, res_date_2) {
            const { days, minutes, hours } = date_delta(parse_responce_date(res_date_1), parse_responce_date(res_date_2));
            let str = !days ? '' : days + 'd ';
            str += `${Math.floor(hours)}h ${minutes}m`;
            return str;
        }
    },
    mounted() {
    },
    components: { FlightInfoSnippet, StandartItem, ItemStatusBlock }
}
</script>

<template>
	<standart-item
		class="order"
		:class="{
			'active': order.status == 1,
			'delay': order.status == 2,
			'cancelled': (order.status == 4 || order.purchase_status == 0)
		}"
	>
		<flight-info-snippet :flight_data="order"/>

		<div class="row mt-3 align-items-center">
			<div class="col-8">
				<item-status-block :status="order.status" :purchase_status="order.purchase_status"/>
			</div>
			<div class="col-4 d-flex gap-2 justify-content-end">
				<button 
					class="btn btn-primary" 
					title="Информация по заказу"
					@click="$emit('show_order_modal', order.purchase_id)"
				>
					💬
				</button>
				<button 
					class="btn btn-danger" 
					title="Отменить заказ"
					v-show="(order.status != 0 && order.status != 4 && order.purchase_status == 1)"
					@click="$emit('cancel_order', order.purchase_id)"
				>
					❌
				</button>
			</div>
		</div>
	</standart-item>
</template>
