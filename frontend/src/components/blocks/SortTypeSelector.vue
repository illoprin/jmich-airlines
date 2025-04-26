<script>
export default {
	props: {
		sort_options: {
			type: Object,
			required: true
		},
		sortModel: String,
	},
	// Эмит указывать не обязательно
	emits: ['update:sortModel'],
	methods: {
		change_option(value) {
			this.$emit('update:sortModel', value);
			console.log(value);
		}
	}
}
</script>

<template>
	<div class="d-flex justify-content-end gap-3" role="group">
		<div v-for="(option, index) in sort_options" :key="option.value">
			<input 
				type="radio" 
				class="btn-check"
				name="sort_selector"
				:id="option.value"
				autocomplete="off"
				:checked="index == 0"
				@click="e => change_option(option.value)"
			>
			<label 
				class="btn btn-outline-primary rounded-5"
				:class="option.highlight || ''"
				:for="option.value"
			>
				{{ option.name }}
			</label>
		</div>
	</div>
</template>

<style></style>
