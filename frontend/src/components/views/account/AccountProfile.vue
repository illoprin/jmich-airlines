<template>
  <div class="d-flex flex-column gap-3">

    <div class="glass-convex glass-border glass-padding p-5">
      <ProfileBrief />
    </div>
    
    <div class="tab-bar">
      <div class="glass-convex glass-border glass-padding w-auto d-flex flex-column">
        <ProfileLevel />
      </div>
      <div class="glass-convex glass-border glass-padding flex-fill">
        <ProfileClosestFlight />
      </div>
    </div>

    <div class="tab-bar">
      <ProfileInfo />
    </div>

  </div>
</template>

<script setup lang="ts">
import ProfileBrief from '@/components/views/account/components/profile/ProfileBrief.vue';
import ProfileClosestFlight from '@/components/views/account/components/profile/ProfileClosestFlight.vue';
import ProfileInfo from '@/components/views/account/components/profile/ProfileInfo.vue';
import ProfileLevel from '@/components/views/account/components/profile/ProfileLevel.vue';

</script>

<style scoped>
@media screen and (max-width: 1080px) {
  .tab-bar {
    flex-flow: column;
  }
}

</style>