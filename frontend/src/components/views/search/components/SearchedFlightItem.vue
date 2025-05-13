<template>
  <div class="glass glass-border glass-panel flight-item">

    <!-- Tag -->
    <div class="tag-block" v-if="tagField">
      <img :src="CheckIco" alt="tag" class="tag-ico">
      <div class="tag-text">
        {{ tagField }}
      </div>
    </div>

    <div class="row">
      <div class="col-lg-4 text-center position-relative p-3">
        <!-- Dynamic Price -->
        <span class="fs-3 fw-bold price-base" :class="priceWithBaggage ? 'small' : ''">
          {{ formatPrice(flight.price, "₽") }}
        </span>

        <span class="fs-3 fw-bold price-baggage" :class="!priceWithBaggage ? 'invisible' : ''">
          {{ formatPrice(priceWithBaggage, "₽") }}
        </span>

        <div>
          <label class="fs-5 text-start w-100 mb-2 text-white-50">
            Вес багажа
          </label>
          <GlassInput
            type="number"
            min="0"
            :max="flight.seats_available"
            placeholder="Укажите вес"
            v-model:value="baggageWeight"
          />
        </div>

        <GlowButton class="mt-3 w-100 p-3">
          Приобрести
        </GlowButton>
      </div>
      <div class="col-lg-8 p-3 d-flex flex-column justify-content-between">
        <!-- Company Logo -->
        <div class="d-block">
          <img
            :src="`${BASE_API}${flight.company.logo}`"
            :alt="flight.company.name"
            class="company-logo float-start"
          >

          <LikeBtnDynamic
            :checked="liked"
            @click="() => handleLikeButton()"
            class="float-end"
          />
        </div> 

        <!-- Flight snippet -->
        <FlightSnippet :flight="flight" class="mt-3"/>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import CheckIco from '@/assets/icons/check.svg'
import GlassInput from '@/components/UI/GlassInput.vue';
import { formatPrice } from '@/lib/format/formatPrice';
import { computed, ref } from 'vue';
import type { BaggageRule } from '@/api/types/entities/company';
import GlowButton from '@/components/UI/GlowButton.vue';
import FlightSnippet from '@/components/shared/FlightSnippet.vue';
import { BASE_API } from '@/store/store';
import LikeBtnDynamic from '@/components/icons/LikeBtnDynamic.vue';

const props = defineProps<{
  flight: Flight,
  likeCallback: (flight: Flight) => void;
  dislikeCallback: (flight: Flight) => void;
  isFlightLiked: (flight: Flight) => boolean;
}>();
const baggageWeight = ref<string>("");
const liked = ref<boolean>(props.isFlightLiked(props.flight));

const tagField = computed<string>(() => {
  if (props.flight.cheapest) {
    return 'Выбор ЖМЫХ.Airlines';
  }
  return '';
});

const priceWithBaggage = computed<number>(() => {
  // WARN: take out the price calculation in booking service
  const rule = (props.flight.company.baggage_rule as BaggageRule);
  if (!rule)
    return 0;

  if (baggageWeight.value
    && parseInt(baggageWeight.value) > rule.max_free_weight) {
    return props.flight.price + (parseInt(baggageWeight.value) - rule.max_free_weight) * rule.price_per_kg;
  }
  return 0;
});

const handleLikeButton = () => {
  liked.value = !liked.value;
  if (liked.value)
    props.likeCallback(props.flight)
  else
    props.dislikeCallback(props.flight);
}

</script>

<style scoped>

.flight-item {
  position: relative;
  background-color: rgba(255, 255, 255, 0.014) !important;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}
.tag-block {
  position: absolute;
  left: 1rem;
  top: .4rem;
  display: flex;
  gap: 0.75rem;
}
.price-baggage {
  display: block;
  opacity: 1;
  transition: opacity 200ms;
  will-change: opacity;
}
.price-baggage.invisible {
  position: absolute;
  opacity: 0;
}

.price-base {
  display: block;
  transition: font-size 200ms;
  will-change: font-size;
}
.price-base.small {
  font-size: 1rem !important;
  text-decoration: line-through;
  color: var(--glass-text-transparent);
}

</style>