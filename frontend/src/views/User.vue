<script>
import CreditCardModal from '@/components/popups/CreditCardModal.vue';
import AsideSelector from '@/components/blocks/AsideSelector.vue';

export default {
    data() {
        return {
            ico_personal: '/src/assets/static/ico/personal.svg',
            ico_order: '/src/assets/static/ico/order.svg',
            ico_controls: '/src/assets/static/ico/controls.svg',
            ico_arrow_r: '/src/assets/static/ico/arrow_r.svg',
        };
    },
    components: { CreditCardModal, AsideSelector }
}
</script>

<template>
	<div class="row w-100 vh-100 m-0">
		<div class="col-3 aside p-3 d-flex flex-column gap-3 align-items-end">
			<aside-selector :link="{name:'user-data'}" :ico="ico_personal">
				Личные данные
			</aside-selector>
			<aside-selector :link="{name:'user-order'}" :ico="ico_order">
				Билеты
			</aside-selector>
			<aside-selector :link="{name:'user-edit'}" :ico="ico_controls">
				Управление аккаунтом
			</aside-selector>
			<aside-selector :link="{name:'search'}" :ico="ico_arrow_r" :width="10" class="mt-auto">
				На главную
			</aside-selector>
		</div>
		<div class="col-9 d-flex m-0 p-0">
			<!-- Panels -->
			<router-view></router-view>
		</div>
	</div>
</template>