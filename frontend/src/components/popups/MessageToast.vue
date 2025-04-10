<script>
// USAGE
// Prepare toast
// Call function: this.show_toast($title, $message)
// Get component by ref="toastRef"

export default {
	name: 'MessageToast',
	data() {
		return {
			ico_error: '/src/assets/static/ico/error.svg',
			ico_success: '/src/assets/static/ico/success.png',
			toast_bs: null,

			message: '',
			title: '',
			is_error: true,
		}
	},
	methods: {
		show_message(title = 'Уведомление', message = 'Ошибка', is_error = true) {
			this.title = title;
			this.message = message;
			this.is_error = is_error;
			
			this.toast_bs.show();
			setTimeout(() => {
				if (this.toast_bs.isShown)
					this.toast_bs.hide();
			}, 3000);
		}
	},
	mounted() {
		const toastLiveExample = document.getElementById('message_toast');
		this.toast_bs = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
	}
}
</script>

<template>
	<div class="toast-container position-fixed bottom-0 end-0 p-3">
		<div id="message_toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header">
				<img :src="is_error ? ico_error : ico_success" width="15" class="rounded me-2" alt="">
				<strong class="me-auto">
					{{ title }}
				</strong>
				<small>
					Только что
				</small>
				<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
				{{ message }}
			</div>
		</div>
	</div>
</template>