<script>
import { add_payment_data, delete_payment_data, get_payment_data } from '@/utils/api';
import { AUTH_ROUTES } from '@/utils/config';
import { format, prepare_form_data, has_empty_fields, redirect } from '@/utils/tools';

export default {

	mounted() {
		this.can_delete_this = this.can_delete;
	},

	data() {
		return {
			ico_mir: '/src/assets/static/png/mir_pay.png',
			form_data: {
				card_number: '',
				card_date: '',
				card_cvv: '',
			},
			can_delete_this: undefined,
		}
	},
	props: {
		payment: {
			type: Object,
			required: true,
		}, 
		can_delete: {
			type: Boolean,
			required: false,
			default: true,
		},
		route: {
			type: String,
			required: false,
			default: AUTH_ROUTES.USER_DATA_ROUTE
		}
	},
	methods: {
		async submit() {
			if (!has_empty_fields(this.form_data)) {
				this.form_data = prepare_form_data(this.form_data, true);
				const post_result = await add_payment_data(this, this.form_data);
				if (post_result.status == 0) {
					redirect(this.route);
				}else {
					// error
					alert(post_result.message);
				}
			}else {
				alert('Некоторые поля не заполнены');
			}
		},

		// Avaliable from user/data page
		async delete_payment() {
			const delete_result = await delete_payment_data(this);
			if (delete_result.status == 0) {
				redirect(this.route);
			}else {
				// error
				alert(post_result.message);
			}
		},

		format_card_data(raw, pattern) {
			raw = raw.trim();
			raw = raw.replace(/[^0-9]/g, "");
			raw = format(raw, pattern);
			return raw;
		}

	},
	computed: {
		get_formatted_number() {
			return format(this.payment.card_number, 'xxxx xxxx xxxx xxxx');
		},
		get_formatted_date() {
			return format(this.payment.card_date, 'xx/xx');
		}
	},

}
</script>

<template>
	<!-- Modal add payment -->
	<div class="modal fade" tabindex="-1" id="credit_card">
		<div class="modal-dialog modal-dialog-centered w-50">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title fw-bolder">
						{{ payment ? 'Карта МИР' : 'Добавить данные банковской карты' }}
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="p-4 bg-body-secondary rounded-3 border border-secondary-subtle">

						<!-- Payment Method Images -->
						<div class="row text-left mb-4 mt-3 align-items-center">
							<div class="col">
								<img :src="ico_mir" width="100" alt="">
							</div>
						</div>

						<!-- Inputs -->
						<form>
							<div class="mb-3">
								<label class="form-label">Номер карты</label>
								<input 
									type="text" 
									class="form-control" 
									name="card_number" 
									placeholder="Номер карты"
									maxlength="19" 
									minlength="19"

									:readonly="payment"
									:value="payment ? get_formatted_number : ''"
									v-on:input = "e => {
										e.target.value = format_card_data(e.target.value, 'xxxx xxxx xxxx xxxx');
										form_data.card_number = e.target.value;
									}"
								>
							</div>
							<div class="row mb-3 g-3">
								<div class="col">
									<label class="form-label">Срок действия</label>
									<input
										type="text"
										class="form-control"
										name="card_date"
										placeholder="MM/YY"
										maxlength="5"
										minlength="5"

										:readonly="payment"
										:value="payment ? get_formatted_date : ''"
										v-on:input = "e => {
											e.target.value = format_card_data(e.target.value, 'xx/xx');
											form_data.card_date = e.target.value;
										}"
									>
								</div>
								<div class="col">
									<label class="form-label">CVV</label>
									<input
										type="text"
										pattern="\d*"
										class="form-control"
										name="card_cvv"
										placeholder="CVV"
										maxlength="3"
										minlength="3"

										:readonly="payment"
										:value="payment ? payment.card_cvv : ''"
										v-on:input = "e => form_data.card_cvv = e.target.value"
									>
								</div>
							</div>
						</form>

					</div>
				</div>
				<div class="modal-footer">

					<button class="btn btn-danger"
						title="Удалить данные о банковской карте"
						v-show="(payment && can_delete)"
						@click="delete_payment()"
					>
						🗑
					</button>


					<button type="button" class="btn btn-primary"
						@click="submit()"
						v-show="!payment"
					>
						Отправить
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
