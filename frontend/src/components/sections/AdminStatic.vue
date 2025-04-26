<script>
import AddCityModal from '@/components/popups/AddCityModal.vue';
import RowHeader from '@/components/UI/RowHeader.vue';
import AddCompanyModal from '@/components/popups/AddCompanyModal.vue';
import AddPromoModal from '@/components/popups/AddPromoModal.vue';


export default {
	components: { AddCityModal, RowHeader, AddCompanyModal, AddPromoModal },
	data() {
		return {
			city_modal: false,
			company_modal: false,
			promo_modal: false,
		}
	},
}

</script>

<template>
	<div class="w-100">
		<row-header>
			<template v-slot:left>
				Изменить статичные данные
			</template>
		</row-header>

		<div class="w-100 mt-5 p-3">
			<div class="row">
				<div class="col">
					<button 
						class="btn btn-primary w-100" 
						@click="city_modal = true"
						
					>
						Города
					</button>
				</div>
				<div class="col">
					<button 
						class="btn btn-primary w-100" 
						@click="company_modal = true"
					>
						Компании
					</button>
				</div>
				<div class="col">
					<button 
						class="btn btn-primary w-100" 
						@click="promo_modal = true"
					>
						Промо-коды
					</button>
				</div>
			</div>
		</div>
	</div>
	<add-city-modal 
		:shown="city_modal" 
		@on_hide="city_modal = false"
	/>
	<add-company-modal
		:shown="company_modal"
		@on_hide="company_modal = false"
	/>
	<add-promo-modal
		:shown="promo_modal"
		@on_hide="promo_modal = false"
	/>
</template>