<script>
import FlightInfoSnippet from '../blocks/FlightInfoSnippet.vue';
import StandartItem from '@/components/UI/StandartItem.vue';
import ItemStatusBlock from '../blocks/ItemStatusBlock.vue';

export default {
	components: { FlightInfoSnippet, StandartItem, ItemStatusBlock},
	props: {
		flight: {
			type: Object,
			required: true
		},
		checked_items: Array,
	},
	methods: {
		update_checklist(event) {
			const { checked, value } = event.target;
			if (checked) {
				this.checked_items.push(Number(value));
			}else {
				if (this.checked_items.length > 0)
					this.checked_items.splice(this.checked_items.indexOf(Number(value)), 1);
			}
			console.log(this.checked_items)
		}
	},
}
</script>

<template>
	<standart-item class="order" :class="{
		'active': flight.status == 1,
		'delay': flight.status == 2,
		'cancelled': flight.status == 4,
		'complete': flight.status == 0
	}">
		<div class="row mb-3">
			<div class="col-3">
				<h4 class="fw-bolder">
					{{ `ID${String(flight.id).padStart(4, '0')}` }}
				</h4>
			</div>
			<div class="col-9 d-flex justify-content-end">
				<div class="form-check">
					<input 
						class="form-check-input" 
						type="checkbox" 
						:value="`${flight.id}`" 
						:id="`delete_select_for_${flight.id}`" 
						@click="update_checklist"
					>
				</div>
			</div>
		</div>
		<flight-info-snippet :flight_data="flight" />
		<div class="row align-items-end mt-3">
			<div class="col">
				<item-status-block :status="flight.status" :purchase_status="1"/>
			</div>
			<div class="col text-end">
				<img :src="flight.company_logo" width="60" height="60" class="object-fit-contain">
			</div>
		</div>
	</standart-item>
</template>