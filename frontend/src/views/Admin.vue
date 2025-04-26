<script>
import AsideSelector from '@/components/blocks/AsideSelector.vue';

export default {
	data() {
		return {
			ico_stat: '/src/assets/static/ico/stat.svg',
			ico_plane: '/src/assets/static/ico/plane_white.svg',
			ico_order: '/src/assets/static/ico/order.svg',
			ico_controls: '/src/assets/static/ico/controls.svg',
			ico_arrow_r: '/src/assets/static/ico/arrow_r.svg',
		};
	},
	components: { AsideSelector },
}
</script>

<template>
	<div class="row w-100 vh-100 m-0">
		<div class="col-3 aside p-3 d-flex flex-column gap-3 align-items-end">
			<aside-selector :link="{ name: 'admin-stat' }" :ico="ico_stat" :width="17">
				Статистика
			</aside-selector>
			<aside-selector :link="{ name: 'admin-order' }" :ico="ico_order">
				Билеты клиентов
			</aside-selector>
			<aside-selector :link="{ name: 'admin-flight' }" :ico="ico_plane" :width="22">
				Перелёты
			</aside-selector>
			<aside-selector :link="{ name: 'admin-static' }" :ico="ico_controls">
				Изменить статичные данные
			</aside-selector>
			<aside-selector :link="{ name: 'search' }" :ico="ico_arrow_r" :width="10">
				На главную
			</aside-selector>
		</div>
		<div class="col-9 d-flex m-0 p-0">
			<!-- Panels -->
			<router-view></router-view>
		</div>
	</div>
</template>
