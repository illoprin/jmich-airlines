<script>

export default {
	props: {
		link: {
			type: Object,
			required: false,
			default: {name: 'search'}
		},
		ico: {
			type: String,
			required: false,
			default: '/src/assets/static/ico/controls.svg'
		},
		width: {
			type: Number,
			required: false,
			default: 20
		}
	}
}

</script>

<template>
	<!-- Selector -->
	<RouterLink :to="link" class="w-100 text-decoration-none">
		<div class="btn-mode-selector rounded-3" id="selector">
			<div class="row align-items-center">
				<div class="col-9">
					<slot></slot>
				</div>
				<div class="col text-end">
					<img :src="ico" :width="width" alt="">
				</div>
			</div>
		</div>
	</RouterLink>
</template>