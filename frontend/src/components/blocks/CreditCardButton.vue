<script>

export default {
	data() {
		return {
			ico_mir: '/src/assets/static/png/mir_pay.png',
		};
	},
	props: {
		payment_data: {
			type: Object,
			required: true,
		},
		card_modal_show: {
			type: Function,
			required: true,
		},
	}
}

</script>

<template>
	<div class="row mt-3 g-3">
		<!-- Card data not added -->
		<div class="col" v-if="!payment_data.card_number">
			<h5 class="mb-1 text-secondary fw-light">Банковская карта</h5>
			<button class="btn btn-outline-dark" @click="card_modal_show()">Добавить</button>
		</div>

		<!-- Card data added -->
		<div class="col" v-else>
			<h5 class="mb-1 text-secondary fw-light">Банковская карта</h5>
			<button class="btn btn-dark text-nowrap d-flex align-items-center gap-3 p-3" @click="card_modal_show()">
				<img :src="ico_mir" width="60" alt="mir_pay">
				<p class="m-0 fw-bolder">×××× ×××× ×××× ××××</p>
			</button>
		</div>
	</div>
</template>
