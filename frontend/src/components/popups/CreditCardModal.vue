<script>
import StandartModal from '../UI/StandartModal.vue';
import { format, prepare_form_data } from '@/utils/tools';

export default {
	components: {StandartModal},
	props: {
		shown: {
			type: Boolean,
			required: true
		},
		payment_data: {
			type: Object,
			required: false,
			default: {},
		},
		can_delete: {
			type: Boolean,
			required: false,
			default: true,
		}
	},
	data() {
		return {
			ico_mir: '/src/assets/static/png/mir_pay.png',
			form_data: {
				card_number: '',
				card_date: '',
				card_cvv: '',
			},
		}
	},
	computed: {
		get_formatted_number() {
			return format(this.payment_data.card_number, 'xxxx xxxx xxxx xxxx');
		},
		get_formatted_date() {
			return format(this.payment_data.card_date, 'xx/xx');
		},
		get_state() {
			return this.payment_data.card_number ? true : false;
		},
	},
	methods: {
		format_number(event) {
			event.target.value = this.format_data(event.target.value, 'xxxx xxxx xxxx xxxx');
			this.form_data.card_number = event.target.value;
		},
		format_date(event) {
			event.target.value = this.format_data(event.target.value, 'xx/xx');
			this.form_data.card_date = event.target.value;
		},
		format_data(raw, pattern) {
			raw = raw.trim();
			raw = raw.replace(/[^0-9]/g, "");
			raw = format(raw, pattern);
			return raw;
		},
		submit() {
			this.form_data = prepare_form_data(this.form_data, true);
			if (this.form_data.card_number.length == 16 &&
				this.form_data.card_date.length == 4 &&
				this.form_data.card_cvv.length == 3
			) {
				console.log('Payment modal form data: ', this.form_data);
				this.$emit('submit', this.form_data);
				this.form_data = {};
			}
			else
				alert('Данные банковской карты введены не верно');
		},
	},
}



</script>

<template>

	<standart-modal
		:id="'payment_modal'"
		:shown="shown"
		@on_hide="$emit('on_hide')"
	>
		<template v-slot:header>
			<h5 class="modal-title fw-bolder">
				{{ get_state ? 'Карта МИР' : 'Добавить данные банковской карты' }}
			</h5>
		</template>
		<template v-slot:body>
			<div class="p-3 bg-body-secondary rounded-3 border">
				<!-- Payment Method Images -->
				<div class="row text-left mb-4 mt-3 align-items-center">
					<div class="col">
						<img :src="ico_mir" width="100" alt="">
					</div>
				</div>

				<!-- Inputs -->
				<div class="mb-3">
					<label class="form-label">Номер карты</label>
					<input type="text" class="form-control" name="card_number" placeholder="Номер карты" maxlength="19" minlength="19" 
						:readonly="get_state" 
						:value="get_state ? get_formatted_number : ''"
						v-on:input="e => format_number(e)"
					>
				</div>
				<div class="row mb-3 g-3">
					<div class="col">
						<label class="form-label">Срок действия</label>
						<input type="text" class="form-control" placeholder="MM/YY" maxlength="5" minlength="5" 					
							:readonly="get_state"
							:value="get_state ? get_formatted_date : ''"
							v-on:input="e => format_date(e)"
						>
					</div>
					<div class="col">
						<label class="form-label">CVV</label>
						<input type="text" pattern="\d*" class="form-control" name="card_cvv" placeholder="CVV" maxlength="3" minlength="3" 
							:readonly="get_state" 
							:value="get_state ? payment_data.card_cvv : ''"
							v-on:input="e => form_data.card_cvv = e.target.value"
						>
					</div>
				</div>
			</div>

		</template>
		<template v-slot:footer>

			<button 
				class="btn btn-danger" 
				title="Удалить данные о банковской карте" 
				v-show="(get_state && can_delete)" 
				@click="$emit('delete')"
			>
				🗑
			</button>

			<button type="button" class="btn btn-primary" v-show="!get_state" @click="submit()">
				Отправить
			</button>

		</template>


	</standart-modal>
	
</template>