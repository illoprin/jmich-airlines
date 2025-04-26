<script>
import { AUTH_ROUTES, SERVER_URL } from '@/utils/config';

// API
import { get_decode_token } from '@/http';
import { get_payment_data, add_payment_data} from '@/http/paymentAPI';
import { add_order } from '@/http/purchaseAPI';

import CreditCardModal from '@/components/popups/CreditCardModal.vue';
import SpinnerBody from '@/components/sections/SpinnerBody.vue';
import FlightInfoSnippet from '@/components/blocks/FlightInfoSnippet.vue';
import PurchasePromo from '@/components/blocks/PurchasePromo.vue';
import { format_price } from '@/utils/tools';
import MessageToast from '@/components/popups/MessageToast.vue';
import { ref } from 'vue';
import CreditCardButton from '@/components/blocks/CreditCardButton.vue';

export default {
	data() {
		return {
			img_arrow_back: '/src/assets/static/ico/arrow_back.svg',
			img_mir: '/src/assets/static/png/mir_pay.png',

			purchase_data: {
				flight_id: undefined,
				client_id: undefined,
				seats: undefined,
				total_cost: undefined,
			},
			purchase_result: undefined,

			flight_data: undefined, // Flight object

			promo_code_data: {
				code: undefined,
			},

			payment_data: {},
			card_modal_shown: false,

			loaded: false,
			view: false,
		}
	},

	setup() {
		// Prepare toast
		// Get component by ref="toastRef"
		const toastRef = ref(null);

		function show_toast(title, message) {
			toastRef.value.show_message(title, message);
		}

		return {toastRef, show_toast};
		// Prepare toast
		// Call function: this.show_toast($title, $message)
	},
	async mounted() {
		const client_id = parseInt(get_decode_token().id);

		this.purchase_data.flight_id = parseInt(this.$route.params.flight_id);
		this.purchase_data.seats = parseInt(this.$route.params.seats);
		this.purchase_data.client_id = client_id;

		// Get flight data from server
		await this.axios.get(SERVER_URL + '/flight/' + this.purchase_data.flight_id, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(response => {
			this.flight_data = response.data;
		})
		.catch(err => {
			this.show_toast('Ошибка на стороне сервера', err);
		});

		// Get payment data
		await get_payment_data(this).then(data => {
			if (data.status == 0)
				this.payment_data = data.result;
		})
		.catch(err => {
			this.show_toast('Ошибка на стороне сервера', err);
		});

		console.log(this.flight_data);
		console.log(this.payment_data);
		this.loaded = true;
	},
	computed: {
		get_url() {
			return AUTH_ROUTES.PURCHASE_ROUTE + '/' + this.flight_data.id + '/' + this.purchase_data.seats;
		},
		get_total_cost() {
			return (this.flight_data.price * this.purchase_data.seats) * (1-(this.promo_code_data.discount || 0));
		},
		get_total_cost_str() {
			return format_price(this.get_total_cost);
		},
	},
	methods: {
		async submit() {
			this.loaded = false;
			this.purchase_data.total_cost = this.get_total_cost;
			await setTimeout(async () => {
				await add_order(this, this.purchase_data)
				.then(res => {
					this.purchase_result = res;
					console.log(this.purchase_result);
				})
				.catch(err => {
					this.show_toast('Ошибка на стороне сервера', err);
				});
				this.view = true;
				this.loaded = true;
			}, 1000);
		},
		async card_form_submit(form_data) {
			const post_result = await add_payment_data(this, form_data);
			if (post_result.status == 0) {
				this.payment_data = form_data;
				this.card_modal_hide();
			}else {
				// error
				alert(post_result.message);
			}
		},
		card_modal_hide() {
			this.card_modal_shown = false;
		},
		card_modal_show() {
			this.card_modal_shown = true;
		}

	},
	components: { CreditCardModal, SpinnerBody, FlightInfoSnippet, MessageToast, PurchasePromo, CreditCardButton }
}
</script>

<template>
	<message-toast ref="toastRef"/>
	<div v-if="loaded">
		<div id="purchase_process" class="d-flex flex-column align-items-center justify-content-center" v-if="!view">
			<credit-card-modal
				:shown="card_modal_shown"
				:payment_data="payment_data" 
				:can_delete="false"
				@submit="card_form_submit"
				@on_hide="card_modal_hide"
			/>
			<div class="container w-75 p-0">

				<div class="row mt-4 mb-4">
					<div class="col">
						<router-link :to="{ name: 'search' }" class="text-decoration-none d-flex gap-3">
							<img :src="img_arrow_back" alt="Arrow Back" width="10">
							<p class="m-0">
								На главную
							</p>
						</router-link>
					</div>
				</div>

				<div class="row m-0 gap-5 flex-nowrap">
					<div class="col-8 p-0">
						<h2 class="fw-semibold">Билет</h2>

						<div class="mt-3">
							<div class="w-100 m-auto p-5 text-black border rounded-3 position-relative mt-3" id="ticket">

								<div class="row align-items-center">
									<div class="col">
										<h4>
											Количество мест
										</h4>
									</div>
									<div class="col-4 p-0 d-flex gap-3">

										<button class="btn btn-primary" @click="purchase_data.seats -= purchase_data.seats <= 1 ? 0 : 1">
											-
										</button>
										<input type="number" class="form-control" v-model="purchase_data.seats" readonly>
										<button class="btn btn-primary" @click="purchase_data.seats += (purchase_data.seats + 1) < flight_data.seats_available ? 1 : 0">
											+
										</button>

									</div>
								</div>

								<flight-info-snippet :flight_data="flight_data" />


							</div>
						</div>

						<div class="mt-5">
							<h2 class="fw-semibold">Оплата</h2>
							<credit-card-button 
								:payment_data="payment_data" 
								:card_modal_show="card_modal_show"
							/>
						</div>

					</div>
					<div class="col-4 p-0">
						<h2 class="fw-semibold">Итого</h2>

						<div class="mt-3">
							<div class="row align-items-end">
								<div class="col">
									<p class="m-0">Рейс</p>
									<h4>{{ flight_data.route_code }}</h4>
								</div>
								<div class="col text-end">
									<h3 class="text-success">{{ get_total_cost_str }}</h3>
								</div>
							</div>
						</div>

						<PurchasePromo :promo_code="promo_code_data"/>

						<div class="mt-3">
							<button
								class="btn btn-primary shadow-sm w-100"
								@click="submit()"
								:disabled="!payment_data.card_number"
							>
								Купить
							</button>
						</div>


					</div>
				</div>
			</div>
		</div>
		

		<div class="vh-100 d-flex flex-column align-items-center justify-content-center" v-else>
			<div class="w-50 m-auto">
				<div class="text-center">
					<img :src="purchase_result.qr || ''" width="300" class="p-2 border rounded-2 order_qr">
					<p class="m-0">Просто покажите QR код на стойке регистрации</p>
				</div>

				<div class="row mt-5">
					<div class="col-4">
						<h5 class="text-secondary m-0">Код рейса</h5>
						<h4 class="m-0 fw-semibold">{{ flight_data.route_code }}</h4>
					</div>
					<div class="col-4 text-center">
						<h5 class="text-secondary m-0">Места</h5>
						<h4 class="m-0 fw-semibold">{{ purchase_data.seats }}</h4>
					</div>
					<div class="col-4 text-end">
						<h5 class="text-secondary m-0">Стоимость</h5>
						<h4 class="m-0 fw-semibold">{{ get_total_cost_str }}</h4>
					</div>
				</div>

				<div class="mt-5 text-center">
					<router-link :to="{ name: 'user-order'}">
						<div class="btn btn-primary">
							В личный кабинет
						</div>
					</router-link>
				</div>
			</div>
		</div>
	</div>

	<div v-else>
		<SpinnerBody />
	</div>


</template>
