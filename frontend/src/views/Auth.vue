<script>

</script>

<template>
	<div class="row w-100 vh-100 m-0">
		<!-- Aside -->
		<div class="col-4 aside p-3">
			<div class="d-flex flex-column gap-3 w-100 align-items-end h-100 justify-content-center" aria-label="Выбор режима">
				<label class="btn btn-mode-selector p-4 fw-bold text-start rounded-start-5 w-75" for="auth_reg">
					<router-link :to="{ name: 'auth-reg' }" class="text-decoration-none text-white">
						Регистрация
						<input type="radio" class="btn-check" id="auth_reg" name="auth" autocomplete="off" checked @click="mode='reg'">
					</router-link>
				</label>
				<label class="btn btn-mode-selector p-4 fw-bold text-start rounded-start-5 w-75" for="auth_login">
					<router-link :to="{ name: 'auth-login' }" class="text-decoration-none text-white">
						<input type="radio" class="btn-check" id="auth_login" name="auth" autocomplete="off" @click="mode='login'">
						Войти в аккаунт
					</router-link>
				</label>
				<label class="btn text-white p-4 fw-bold text-start rounded-start-5 w-75 position-relative" for="auth_login">
					На главную
					<router-link :to="{name: 'search'}" class="position-absolute top-0 start-0 w-100 h-100"></router-link>
				</label>
			</div>
		</div>
		<div class="col-8 d-flex flex-column justify-content-center align-items-center p-0 m-0">
			<router-view></router-view>
		</div>
	</div>
</template>
