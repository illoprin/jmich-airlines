<script>
import StandartModal from '../UI/StandartModal.vue';

export default {
	components: { StandartModal },
	props: {
		shown: {
			type: Boolean,
			default: false
		},
		form_data: {
			type: Object,
			required: true,
		}
	}
}

</script>

<template>
	<standart-modal
		:id="'add_flight_modal'"
		:shown="shown"
		@on_hide="$emit('on_hide')"
	>
		<template v-slot:header>
			<h5 class="modal-title fw-bold">
				Добавить новый перелёт
			</h5>
		</template>
		<template v-slot:body>

		</template>
		<template v-slot:footer>
			<div class="d-flex justify-content-between w-100">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
				<button type="button" class="btn btn-success" @click="$emit('add_flight_request')">Добавить</button>
			</div>
		</template>
	</standart-modal>
</template>
