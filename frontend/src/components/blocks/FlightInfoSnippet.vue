<script>
import { date_to_locale, parse_responce_date, date_delta } from '@/utils/tools';

export default {
	data () {
		return {
			img_plane_off: '/src/assets/static/ico/plane_off.svg',
            img_plane_on: '/src/assets/static/ico/plane_on.svg',
		}
	},
	props: {
		flight_data: {
			type: Object,
			required: true,
		}
	},
	methods: {
		parse_date(res_datetime) {
			const date_string = date_to_locale(parse_responce_date(res_datetime)).split(' ');
			return date_string[0] + " " + date_string[1];
		},
		get_date_delta(res_date_1, res_date_2) {
			const { days, minutes, hours } = date_delta(
				parse_responce_date(res_date_1),
				parse_responce_date(res_date_2)
			)
			let str = !days ? '' : days + 'd ';
			str += `${Math.floor(hours)}h ${String(minutes).padStart(2, '0')}m`;

			return str;
		}
	}
}
</script>

<template>
	<div class="row w-100 mt-2 align-items-center">
		<div class="col-3 d-flex flex-column justify-content-center">
			<!-- Departure -->
			<h3 class="m-0">
				{{ String(flight_data.departure_datetime.hour).padStart(2, '0') }}
				:
				{{ String(flight_data.departure_datetime.minute).padStart(2, '0') }}
			</h3>
			<p class="text-secondary m-0">{{ flight_data.departure_city }}</p>
			<p class="text-secondary m-0">
				{{ parse_date(flight_data.departure_datetime) }}
			</p>
		</div>
		<div class="col-6 text-secondary text-center">
			<div class="row align-items-center">
				<div class="col-2 text-start">
					<img :src="img_plane_off" width="30" alt="">
					<!-- Departure Code -->
					<p class="m-0">
						{{ flight_data.departure_code }}
					</p>
				</div>
				<div class="col-8">
					<!-- Duration -->
					<h5>
						{{ get_date_delta(
							flight_data.departure_datetime,
							flight_data.arrival_datetime
						) }}
					</h5>
				</div>
				<div class="col-2 text-end">
					<img :src="img_plane_on" width="30" alt="">
					<!-- Arrival Code -->
					<p class="m-0">
						{{ flight_data.arrival_code }}
					</p>
				</div>
			</div>
			<hr class="w-100 table-group-divider m-0">
		</div>
		<div class="col-3 text-end d-flex flex-column justify-content-center">
			<!-- Arrival -->
			<h3 class="m-0">
				{{ String(flight_data.arrival_datetime.hour).padStart(2, '0') }}
				:
				{{ String(flight_data.arrival_datetime.minute).padStart(2, '0') }}
			</h3>
			<p class="text-secondary m-0">
				{{ flight_data.arrival_city }}
			</p>
			<p class="text-secondary m-0">
				{{ parse_date(flight_data.arrival_datetime) }}
			</p>
		</div>
	</div>
</template>