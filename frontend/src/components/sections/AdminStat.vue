<script>
import { fetch_client, fetch_order } from '@/http/adminAPI';
import { get_all_flights } from '@/http/flightAPI';
import SpinnerComponent from './SpinnerComponent.vue';

export default {
	data() {
		return {
			loaded: false,
			user_label: 0,
			order_label: 0,
			flight_label: 0,
		}
	},
	async mounted() {
		this.user_label = (await fetch_client(this)).result.length;
		this.order_label = (await fetch_order(this)).length;
		this.flight_label = (await get_all_flights(this)).length;

		this.loaded = true;
	},
	components: { SpinnerComponent }
}
</script>

<template>
	<div class="w-100 h-100 d-flex flex-column align-content-center text-center" v-if="loaded">
		<div class="mt-5">
			<h1 class="fw-bold">Статистика</h1>
		</div>
		<div class="row w-100 m-auto">
			<h2 class="mb-5">На сервисе <strong>ЖМЫХ Airlines</strong></h2>
			<div class="col-4">
				<h5 class="mb-0 text-secondary">
					Зарегестрированно пользователей
				</h5>
				<h1 class="strong-header m-0">
						{{ user_label }}
				</h1>
			</div>
			<div class="col-4">
				<h5 class="mb-0 text-secondary">
					Сделано заказов
				</h5>
				<h1 class="strong-header m-0">
						{{ order_label }}
				</h1>
			</div>
			<div class="col-4">
				<h5 class="mb-0 text-secondary">
					Активных перелётов
				</h5>
				<h1 class="strong-header m-0">
						{{ flight_label }}
				</h1>
			</div>
		</div>
	</div>
	<div class="w-100 h-100 d-flex align-items-center justify-content-center" v-else>
		<spinner-component />
	</div>
</template>

<style></style>
