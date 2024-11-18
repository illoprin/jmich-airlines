<script>
import { format_price } from '@/utils/tools';
import FlightInfoSnippet from '@/components/blocks/FlightInfoSnippet.vue';
import StandartItem from '@/components/UI/StandartItem.vue';

export default {
    data() {
        return {
            img_plane_off: '/src/assets/static/ico/plane_off.svg',
            img_plane_on: '/src/assets/static/ico/plane_on.svg',
            // Mock
            img_company: 'http://localhost:8001/upload/aeroflot.png'
        };
    },
    props: {
        search_result: {
            type: Object,
            reqired: true,
        },
        search_data: {
            type: Object,
            required: true,
        }
    },
    methods: {
        parse_price(raw) {
            return format_price(raw);
        },
    },
    components: { FlightInfoSnippet, StandartItem }
}
</script>

<template>
	<div class="container-fluid w-75 p-3 rounded-3 shadow mt-4 bg-white d-flex flex-column gap-3">
        <!-- Ticket -->
        <standart-item
            class="row p-5 order"
            v-for="(flight, index) in search_result"
            :key="flight.id"
        >
            <span class="position-absolute badge rounded-pill bg-success fs-5 w-auto" id="ticket_badge" v-if="flight.cheapest">Самый дешёвый</span>
            <div class="col-9 p-0">
                <!-- Price -->
                <h2 class="fw-bolder">{{ parse_price(flight.price) }}</h2>
                <flight-info-snippet :flight_data="flight" class="mt-4"/>
            </div>
            <div class="col-3 text-center p-0 d-flex flex-column align-items-center justify-content-between">
                <img :src="flight.company_logo" style="width: 100px; height: 100px" alt="Company" class="object-fit-contain">
                <router-link 
                    :to="{ name: 'purchase', params: {flight_id: flight.id, seats: search_data.seats || 1} }"
                    class="btn btn-dark shadow-lg rounded-5 mt-auto"
                >
                    Приобрести
                </router-link>
            </div>
        </standart-item>

        <button class="btn btn-outline-primary w-100" @click="$emit('load_more')">Загрузить ещё</button>
	</div>
</template>