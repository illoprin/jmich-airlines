<script>
import { get_decode_token, get_payment_data, get_user_data } from '@/utils/api';
import { AUTH_ROUTES, SERVER_URL } from '@/utils/config';
import { format } from '@/utils/tools';
import SpinnerComponent from '@/components/sections/SpinnerComponent.vue';
import CreditCardModal from '@/components/popups/CreditCardModal.vue';
import ImageDragArea from '@/components/UI/ImageDragArea.vue';


export default {
	components: { SpinnerComponent, CreditCardModal, ImageDragArea },
	data() {
		return {
			user_data: null,
			payment_data: null,
			ico_mir: '/src/assets/static/png/mir_pay.png',
			loaded: false
		}
	},
	methods: {

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
			<div class="row mt-3 g-3">
				<!-- Card data or add card -->
				<div class="col" v-if="!payment_data">
					<h5 class="mb-1 text-secondary fw-light">Банковская карта</h5>
					<button class="btn btn-outline-dark" data-bs-target="#credit_card" data-bs-toggle="modal">Добавить</button>
				</div>

				<div class="col" v-else>
					<h5 class="mb-1 text-secondary fw-light">Банковская карта</h5>
					<button class="btn btn-dark text-nowrap d-flex align-items-center gap-3 p-3" data-bs-target="#credit_card" data-bs-toggle="modal">
						<img :src="ico_mir" width="60" alt="mir_pay">
						<p class="m-0 fw-bolder">×××× ×××× ×××× ××××</p>
					</button>
				</div>
			</div>
		</div>
		<credit-card-modal :payment="payment_data"/>
	</div>
	<div class="w-100" v-else>
		<SpinnerComponent />
	</div>
			


</template>

