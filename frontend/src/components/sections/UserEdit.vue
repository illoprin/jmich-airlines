<script>
import SpinnerComponent from '@/components/sections/SpinnerComponent.vue';
import { get_user_data, update_user_data } from '@/http/userAPI';
import { AUTH_ROUTES } from '@/utils/config';
import { prepare_form_data, redirect } from '@/utils/tools';
import RowHeader from '@/components/UI/RowHeader.vue';

export default {
	components: {
		SpinnerComponent, RowHeader
	},
	data () {
		return {
			loaded: false,

			user_data: undefined,
			form_data: {},
			payment_data: undefined,
		}
	},
	async mounted() {
		this.user_data = (await get_user_data(this)).result;
		delete this.user_data.id;
		delete this.user_data.avatar_src;
		delete this.user_data.role;
		delete this.user_data.password;
		this.loaded = true;

		this.check_empty_of_new_data();
	},
	methods: {
		async submit() {
			this.check_empty_of_new_data();
			prepare_form_data(this.form_data, false);
			console.log(this.form_data);
			this.loaded = false;
			setTimeout(async () => {
				await update_user_data(this, this.form_data)
				redirect(AUTH_ROUTES.USER_EDIT_ROUTE);
			}, 500);
		},

		check_empty_of_new_data() {
			for (const [key, value] of Object.entries(this.user_data)) {
				if (!this.form_data[key]) {
					this.form_data[key] = value;
				}
			}
		}
	}
}
</script>

<template>
	<div v-if="loaded">
		<div class="w-100 h-100">
			<!-- Header -->
			<row-header>
				<template v-slot:left>
					Управление аккаунтом
				</template>
			</row-header>

			<div class="p-4">
				<form @submit.prevent="submit()">
					<div class="row gap-3">
						<div class="col-6" v-for="([key, value], index) in Object.entries(user_data)" :key="index">
							<label class="form-label">{{ key.charAt(0).toUpperCase() + key.substring(1) }}</label>
							<input 
								type="text" 
								class="form-control p-2 bg-body-secondary" 
								:name="key" 
								:maxlength="key == 'phone' ? 10 : 128"
								v-model="form_data[key]"
							>
						</div>
					</div>
					<button type="submit" class="btn btn-primary mt-4">
						Сохранить изменения
					</button>
				</form>
				
			</div>
			
		</div>
	</div>
	<div class="w-100" v-else>
		<SpinnerComponent />
	</div>
</template>

