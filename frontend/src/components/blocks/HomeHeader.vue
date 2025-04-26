<script>
import { disauthorizize_user, delete_user, get_user_data, get_role } from '@/http/userAPI';

export default {
    data() {
        return {
            authorized: false,
			user_data: {},
			role: null,
        };
    },
    async mounted() {
        this.authorized = localStorage.getItem('authorized');
		console.log(`Header auth status: ${this.authorized}`);
		if (this.authorized === 'true') {
			this.user_data = (await get_user_data(this)).result;
			this.role = get_role();
		}
    },
	methods: {
		exit_account () {
			disauthorizize_user();
			this.authorized = false;
		},
		async delete_account () {
			alert('Удаление пользователя!');
			await delete_user(this);
			this.authorized = false;
		},
	}
}
</script>

<template>
	<nav class="navbar navbar-expand-lg">
		<div class="container p-3">
			<a class="navbar-brand fw-bold text-white" href="#">
				ЖМЫХ Airlines ✈️
			</a>
			<ul class="navbar-nav">
				<li class="nav-item dropdown">


					<div v-if="authorized === 'true'">
						<a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							{{ user_data.firstname + ' ' + user_data.secondname }}
						</a>
						<ul class="dropdown-menu">
							<li>
								<router-link class="dropdown-item" :to="{name: 'user-data'}">Личный кабинет</router-link>
							</li>
							<li>
								<router-link class="dropdown-item" :to="{name: 'user-order'}">Билеты</router-link>
							</li>
							<li v-show="role == 1">
								<router-link class="dropdown-item" :to="{name: 'admin-stat'}">Админ панель</router-link>
							</li>
							<li>
								<hr class="dropdown-divider">
							</li>
							<li>
								<button class="dropdown-item text-danger" @click="exit_account()">Выйти из аккаунта</button>
							</li>
							<li>
								<button class="dropdown-item bg-danger text-white" @click="delete_account()">Удалить аккаунт</button>
							</li>
						</ul>
					</div>

					<div v-else>
						<RouterLink class="btn btn-outline-light" :to="{name: 'auth-login'}">
							Войти
						</RouterLink>
					</div>
					
				</li>
			</ul>
		</div>
	</nav>
</template>