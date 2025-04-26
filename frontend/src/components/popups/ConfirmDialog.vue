<script>
	export default {
		props: {
			title: {
				type: String,
				required: false,
				default: 'Запрос'
			},
			message: {
				type: String,
				required: false,
				default: 'Подтвердите действие'
			},
			shown: {
				type: Boolean,
				required: false,
				default: false,
			}
		},
		mounted() {
			const modal_dom = document.getElementById('confirm_modal');
			modal_dom.addEventListener('hidden.bs.modal', event => {
				this.$emit('on_hide');
			});
		},
		methods: {
			confirm() {
				this.$emit('confirmed');
			}
		},
		watch: {
			shown(new_val, old_val) {
				const modal_dom = new bootstrap.Modal("#confirm_modal");
				if (new_val) {
					modal_dom.show()
				}else {
					modal_dom.hide()
				}
			}
		}
	}
</script>

<template>
	<!-- Confirm modal -->
	<div class="modal fade" id="confirm_modal">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content bg-black text-white bg-opacity-50" v-if="shown">
				<div class="modal-header">
					<h5 class="modal-title fw-bolder">
						{{ title }}
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" data-bs-target="#confirm_modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>
						{{ message }}
					</p>
				</div>
				<div class="modal-footer justify-content-between">
					<button type="button" class="btn btn-danger" data-bs-dismiss="modal" data-bs-target="#confirm_modal">Нет</button>
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal" data-bs-target="#confirm_modal" @click="confirm()">Да</button>
				</div>
			</div>
		</div>
	</div>
</template>