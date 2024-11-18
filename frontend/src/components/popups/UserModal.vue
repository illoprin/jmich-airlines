<script>
import StandartModal from '@/components/UI/StandartModal.vue';
import { format } from '@/utils/tools';

export default {
	props: {
		user: {
			type: Object,
			required: false,
			default: null
		},
		shown: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	components: { StandartModal },
	computed: {
		get_phone() {
			return '+7 ' + format(this.user.phone, '(xxx) xxx xx-xx');
		},
		get_card_number() {

		}
	}
}
</script>

<template>
	<standart-modal 
		:id="'user_profile_modal'" 
		:shown="shown"
		:width="'w-100'"
		@on_hide="$emit('on_hide')"
	>
		<template v-slot:header>
			<div class="d-flex flex-column">
				<h5 class="modal-title fw-bolder fs-5">
					{{ `${user.role == 1 ? 'Админ' : 'Клиент'} ID${String(user.id).padStart(4, '0')}` }}
				</h5>
				<h4 class="m-0 fw-bolder">
					{{ `${user.firstname} ${user.secondname}` }}
				</h4>
			</div>
		</template>

		<template v-slot:body>
			<div class="row align-items-center" title="Посмотреть информацию о клиенте">
				<div class="col-4 text-center">
					<img :src="user.avatar_src" width="100" height="100" :alt="user.login" class="rounded-circle object-fit-cover">
				</div>
				<div class="col-8 d-flex justify-content-between flex-column">
					<div>
						<p class="text-secondary m-0">
							Номер телефона
						</p>
						<h5 class="fw-bold m-0">
							{{ `${ get_phone }` }}
						</h5>
					</div>

					<div class="mt-3">
						<p class="text-secondary m-0">
							E-mail
						</p>
						<h5 class="fw-bold m-0">
							{{ `${ user.email }` }}
						</h5>
					</div>

					<div class="mt-3">
						<p class="text-secondary m-0">
							Логин
						</p>
						<h5 class="fw-bold m-0">
							{{ `${ user.login }` }}
						</h5>
					</div>
				</div>
			</div>
		</template>

		<template v-slot:footer>
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
		</template>
	</standart-modal>
</template>

