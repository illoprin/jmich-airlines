<script>
	export default {
		props: {
			shown: {
				type: Boolean,
				required: false,
				default: false,
			},
			id: {
				type: String,
				required: false,
				default: 'jmich-standart-modal'
			},
			width: {
				type: String,
				required: false,
				default: ''
			}
		},
		mounted() {
			const modal_dom = document.getElementById(this.id);
			modal_dom.addEventListener('hidden.bs.modal', event => {
				this.$emit('on_hide');
			});
		},
		watch: {
			shown(new_val, old_val) {
				const modal_dom = new bootstrap.Modal(`#${this.id}`);
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
	<!-- Standart Modal -->
	<div class="modal fade" :id="id">
		<div class="modal-dialog modal-dialog-centered" :class="width">
			<div class="modal-content" v-if="shown">
				<div class="modal-header">
					<slot name="header"></slot>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<slot name="body"></slot>
				</div>
				<div class="modal-footer">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
