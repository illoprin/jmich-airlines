<script>
import { has_empty_fields } from '@/utils/tools';
import { authorizize_user } from '@/http/userAPI';
import MessageToast from '@/components/popups/MessageToast.vue';
import { SERVER_URL } from '@/utils/config';
import { ref } from 'vue';

export default {
	data() {
		return {
			img_src: '/src/assets/static/ico/logo.svg',
			form_data: {
				login: '',
				password: '',
			},
		};
	},
	methods: {
		async login_action() {
			if (!has_empty_fields(this.form_data)) {
				const url = SERVER_URL + '/user/login'
				this.axios.post(url, this.form_data)
					.then(res => {
						authorizize_user(res.data);
						this.$router.push({ name: 'user-data' });
					})
					.catch(error => {
						console.log(error);
						this.show_toast('Ошибка', error.response.data.message);
					})

			}
			else {
				this.show_toast('Ошибка', 'Некоторые поля не заполнены');
			}
		},


	},
	components: { MessageToast },

	setup() {
		// Prepare toast
		const toastRef = ref(null);

		function show_toast(title, message) {
			toastRef.value.show_message(title, message);
		}

		return { toastRef, show_toast };
		// Prepare toast
		// Call function: this.show_toast($title, $message)
	}
}
</script>

<template>
	<message-toast ref="toastRef" />
	<div class="text-center w-50">
		<img :src="img_src" width="300" alt="ЖМЫХ Airlines">
		<form class="mt-5" @submit.prevent="login_action()">

			<div class="mt-3">
				<input type="text" class="form-control" name="login" placeholder="Логин" maxlength="256"
					v-model="form_data.login">
			</div>
			<div class="mt-3">
				<input type="password" class="form-control" name="password" placeholder="Пароль" maxlength="128"
					v-model="form_data.password">
			</div>

			<div class="mt-3 row m-0">
				<div class="col p-0">

				</div>
				<div class="col p-0 text-end">
					<button type="submit" class="btn btn-search text-white rounded-5 w-50">Войти</button>
				</div>
			</div>
		</form>
	</div>
</template>
