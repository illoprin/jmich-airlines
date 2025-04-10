<script>
// API
import { get_payment_data, delete_payment_data, add_payment_data } from '@/http/paymentAPI';
import { get_decode_token } from '@/http';
import { get_user_data, } from '@/http/userAPI';

import { AUTH_ROUTES, SERVER_URL } from '@/utils/config';
import { format, prepare_form_data, has_empty_fields, redirect } from '@/utils/tools';
import SpinnerComponent from '@/components/sections/SpinnerComponent.vue';
import ImageDragArea from '@/components/UI/ImageDragArea.vue';

import CreditCardButton from '../blocks/CreditCardButton.vue';
import CreditCardModal from '@/components/popups/CreditCardModal.vue';


export default {
	components: { SpinnerComponent, ImageDragArea, CreditCardModal, CreditCardButton },
	data() {
		return {
			user_data: null,
			payment_data: {},
			loaded: false,

			card_modal_shown: false,
		}
	},
	methods: {
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
		async card_delete() {
			const delete_result = await delete_payment_data(this);
			this.payment_data = {}
			this.card_modal_hide();
		},
		card_modal_hide() {
			this.card_modal_shown = false;
		},
		card_modal_show() {
			this.card_modal_shown = true;
		}

	},
	computed: {
		get_upload_url() {
			const { id } = get_decode_token();
			return SERVER_URL + '/user/avatar/' + id;
		},
		get_redirect_url() {
			return AUTH_ROUTES.USER_ROUTE + '/' + AUTH_ROUTES.USER_DATA_ROUTE;
		}
	},	
	async mounted() {
		this.user_data = (await get_user_data(this)).result;
		const payment_res = (await get_payment_data(this));
		if (payment_res.status == 0)
			this.payment_data = payment_res.result;
		this.user_data.phone_formatted = "+7 " + format(this.user_data.phone, '(xxx) xxx xx-xx');
		this.loaded = true;
	},

}
</script>

<template>
	<!-- Personal Data section -->
	<div class="row w-100 p-4" v-if="loaded">
		<credit-card-modal 
			:payment_data="payment_data" 
			:shown="card_modal_shown"
			@submit="card_form_submit" 
			@on_hide="card_modal_hide"
			@delete="card_delete"
		/>
		<div class="col text-center">
			<image-drag-area 
				:img_src="user_data.avatar_src" 
				:circle="true" 
				:img_width="300"

				:upload_url="get_upload_url"
				:redirect_url="get_redirect_url"
			/>
		</div>
		<div class="col p-4">
			<!-- Personal Data -->
			<h2 class="fw-bold">Личные данные</h2>
			<div class="row mt-5 g-3">
				<div class="col-6">
					<h5 class="mb-1 text-secondary fw-light">Имя</h5>
					<h4 class="fw-semibold">
						{{ user_data.firstname }}
					</h4>
				</div>
				<div class="col-6">
					<h5 class="mb-1 text-secondary fw-light">Фамилия</h5>
					<h4 class="fw-semibold">
						{{ user_data.secondname }}
					</h4>
				</div>
				<div class="col-6">
					<h5 class="mb-1 text-secondary fw-light">Логин</h5>
					<h4 class="fw-semibold">
						{{ user_data.login }}
					</h4>
				</div>
				<div class="col-6">
					<h5 class="mb-1 text-secondary fw-light">Email</h5>
					<h4 class="fw-semibold">
						{{ user_data.email }}
					</h4>
				</div>
				<div class="col-6">
					<h5 class="mb-1 text-secondary fw-light">Номер телефона</h5>
					<h4 class="fw-semibold">
						{{ this.user_data.phone_formatted }}
					</h4>
				</div>
			</div>

			<h2 class="fw-bold mt-5">Оплата</h2>
			<credit-card-button :payment_data="payment_data" :card_modal_show="card_modal_show"/>
		</div>
		
	</div>
	<div class="w-100" v-else>
		<SpinnerComponent />
	</div>
</template>

