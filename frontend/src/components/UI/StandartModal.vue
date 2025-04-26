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
			type: {
				type: String,
				required: false,
				default: ''
			},
		},
		data() {
			return {
				modal_dom: undefined,
			}
		},
		mounted() {
			this.modal_dom = document.getElementById(this.id);
			this.modal_dom.addEventListener('hidden.bs.modal', () => {
				this.$emit('on_hide');
			});
		},
		watch: {
			shown(new_val, old_val) {
				const modal_bs = bootstrap.Modal.getOrCreateInstance(this.modal_dom);
				if (new_val) {
					modal_bs.show();
				}else {
					modal_bs.hide();
				}
			}
		}
	}
</script>

<template>
	<!-- Standart Modal -->
	<div class="modal fade" :id="id">
		<div class="modal-dialog modal-dialog-centered" :class="type">
			<div class="modal-content" >
				<div v-if="shown">
					<div class="modal-header">
						<slot name="header"></slot>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
	</div>
</template>
