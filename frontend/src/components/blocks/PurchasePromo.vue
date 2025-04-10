<script>
import { SERVER_URL } from '@/utils/config';

	export default {
		data() {
			return { 
				clicked: false,
				code: '',
				valid: undefined,
			}
		},
		props: {
			promo_code: {
				type: Object,
				required: true,
			}
		},
		methods: {
			async check_valid() {
				await this.axios.post(SERVER_URL + '/promo/verify', this.promo_code, {
					headers : {
						'Authorization': 'Bearer ' + localStorage.getItem('token')
					}
				})
				.then(res => {
					const { discount } = res.data;
					this.promo_code.discount = discount;
					this.valid = true;
				})
				.catch(err => {
					if (err.status == 403) {
						const { message } = err.response.data;
						console.log(message);
						this.valid = false;
					}
					
				})
			}
		},
		computed: {
			get_label() {
				switch (this.valid) {
					case true:
						return 'Применён!';
					break;
					case false:
						return 'Не верно!';
					break;
					case undefined:
						return 'Применить';
					break;
				}
			}
		}
	}
</script>

<template>
	<div class="mt-3">
		<div class="mb-3" v-if="valid">
			
		
		</div>

		<button class="btn btn-outline-primary w-100" v-if="!clicked" @click="clicked=true">
			Добавить промо-код
		</button>

		<div class="" v-else>
			<div class="row">
				<div class="col-8">
					<input 
						type="text" 
						class="form-control" 
						v-model="promo_code.code" 
						@input="valid = undefined" 
						:readonly="valid"
					>
				</div>
				<div class="col-4">
					<button 
						class="btn w-100"
						:class="{ 
							'btn-primary' : valid == undefined, 
							'btn-danger' : valid == false, 
							'btn-success' : valid == true
						}" 
						@click="check_valid()"
						:disabled="valid"
					>
						{{ get_label }}
					</button>
				</div>
			</div>
		</div>


	</div>


</template>

<style scoped>
	
</style>
