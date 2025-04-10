<script>
import { has_empty_fields, format, prepare_form_data, redirect } from '@/utils/tools';
import MessageToast from '@/components/popups/MessageToast.vue';
import { GUEST_ROUTES, SERVER_URL } from '@/utils/config';
import { ref } from 'vue';

export default {
	data() {
		return {
			img_src: "/src/assets/static/ico/logo.svg",
			data_validness: {
				firstname: false,
				secondname: false,
				login: false,
				email: false,
				phone: false,
				password: false,
			},
			form_data: {
				firstname: "",
				secondname: "",
				login: "",
				email: "",
				phone: "",
				password: "",
			},
			password_repeat: '',
		};
	},
	methods: {
		check_valid() {
			for (const [key, value] of Object.entries(this.form_data)) {
				if (key == 'password') {
					this.data_validness.password = (value == this.password_repeat) && (value.length >= 4);
				}
				else if (key == 'email') {
					this.data_validness.email = value.includes('@') && value.length > 5;
				}
				else {
					this.data_validness[key] = value.length >= 3;
				}
			}
			console.log(this.data_validness);
		},
		format_phone(raw, pattern) {
			raw = raw.trim();
			raw = raw.replace(/[^0-9]/g, "");
			raw = format(raw, pattern);
			return raw;
		},
		async reg_action() {
			if (!has_empty_fields(this.form_data)) {
				this.form_data = prepare_form_data(this.form_data, true);
				console.log(this.form_data);
				this.form_data.role = 0;
				this.axios.post(SERVER_URL + '/user', this.form_data)
					.then(res => {
						this.show_toast('Успешно!', 'Теперь войдите в аккаунт', false);
						setTimeout(() => {
							redirect('/auth/' + GUEST_ROUTES.LOGIN_ROUTE);
						}, 500);
					})
					.catch(err => {
						console.log(err.response.data);
						this.show_toast('Ошибка на стороне сервера', err.response.data.message);
					})

			} else {
				this.show_toast('Ошибка', 'Некоторые поля не заполнены');
			}
		},

	},
	computed: {
		is_form_valid() {
			let valid = true;
			for (const [key, value] of Object.entries(this.data_validness)) {
				valid = valid & value;
			}
			return valid;
		}
	},
	setup() {
		// Prepare toast
		// Get component by ref="toastRef"
		const toastRef = ref(null);

		function show_toast(title, message, is_error = true) {
			toastRef.value.show_message(title, message, is_error);
		}

		return { toastRef, show_toast };
		// Prepare toast
		// Call function: this.show_toast($title, $message)
	},

	components: { MessageToast }
};
</script>

<template>
	<message-toast ref="toastRef" />
	<div class="text-center w-75">
		<img :src="img_src" width="300" alt="ЖМЫХ Airlines" />
		<form class="mt-5 w-100" @submit.prevent="reg_action()">
			<div class="row mt-3 m-0 gap-3">
				<div class="col p-0">
					<input type="text" class="form-control" placeholder="Имя" name="firstname" maxlength="64" @input="check_valid()"
						v-model="form_data.firstname" />
				</div>
				<div class="col p-0">
					<input type="text" class="form-control" placeholder="Фамилия" name="secondname" maxlength="64"
						@input="check_valid()" v-model="form_data.secondname" />
				</div>
			</div>

			<div class="row mt-3 m-0 gap-3">
				<div class="col p-0">
					<input type="email" class="form-control" placeholder="Email" name="email" maxlength="256" @input="check_valid()"
						v-model="form_data.email" />
				</div>
				<div class="col p-0 input-group">
					<span class="input-group-text">+7</span>
					<input type="text" class="form-control" placeholder="Номер телефона" name="phone" maxlength="18" @input="e => {
						check_valid();
						e.target.value = format_phone(e.target.value, '(xxx) xxx xx-xx');
						form_data.phone = e.target.value;
					}" />
				</div>
			</div>
			<div class="mt-3">
				<input type="text" class="form-control" placeholder="Логин" name="login" maxlength="128" @input="check_valid()"
					v-model="form_data.login" />
			</div>
			<div class="row mt-3 m-0 gap-3">
				<div class="col p-0">
					<input type="password" class="form-control" placeholder="Пароль" name="password" maxlength="255"
						@input="check_valid()" v-model="form_data.password" />
				</div>
				<div class="col p-0">
					<input type="password" class="form-control" placeholder="Повторите пароль" name="password_repeat"
						maxlength="255" @input="check_valid()" v-model="password_repeat" />
					<div class="invalid-feedback text-start" :class="{ 'd-block': !data_validness.password }">
						Пароли должны совпадать
					</div>
				</div>
			</div>
			<div class="mt-3 row m-0">
				<div class="col p-0"></div>
				<div class="col p-0 text-end">
					<button type="submit" class="btn btn-primary text-white rounded-5" :disabled="!is_form_valid">
						Зарегистрироваться
					</button>
				</div>
			</div>
		</form>
	</div>
</template>
