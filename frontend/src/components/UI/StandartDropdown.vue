<script>

export default {
	props: {
		options: {
			type: Object,
			required: true,
		},
		type: {
			type: String,
			required: false,
			default: 'btn-secondary',
		},
		value: Object,
	},
	data() {
		return {
			selected: null,
		}
	},
	methods: {
		select_item(index) {
			this.$emit('update:value', this.options[index]);
		}
	}
	
}

</script>

<template>
	<div class="dropdown">
		<button class="w-100 btn" :class="type + ' dropdown-toggle d-flex align-items-center justify-content-between'" type="button" data-bs-toggle="dropdown" aria-expanded="false">
			<slot v-if="!value"></slot>
			<div v-else>{{ value.name }}</div>
		</button>
		<ul class="dropdown-menu">
			<li>
				<a 
					class="dropdown-item hover_effect" 
					v-for="(option, index) in options" 
					:key="index" 
					@click="select_item(index)"
				>
					{{option.name}}
				</a>
			</li>
		</ul>
	</div>
</template>