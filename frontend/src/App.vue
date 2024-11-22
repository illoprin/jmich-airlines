<script>
import SpinnerBody from '@/components/sections/SpinnerBody.vue';
import { check_auth } from './http/userAPI';


export default {
	components: { SpinnerBody },
	data() {
		return { loaded: false }
	},

	async mounted() {
		const auth = await check_auth(this);
		console.log(`Authorize status: ${auth}`);
		localStorage.setItem('authorized', auth);
		this.loaded = true;
	},
}
</script>

<template>
	<div v-if="!loaded">
		<SpinnerBody/>
	</div>
	<div v-else>
		<router-view></router-view>		
	</div>
</template>

<style scoped>
.app-enter-active,
.app-leave-active {
  transition: all 500ms;
}
.app-enter-from {
  opacity: 0.5;
  transform: translateX(-100vw);
}
.app-leave-to {
	opacity: 0;
  	transform: translateX(100vw);
}
</style>

