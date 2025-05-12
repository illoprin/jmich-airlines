<script setup lang="ts">

import SearchBar from "@/components/views/search/SearchBar.vue";

function searchSubmit(data: any): void {
  console.log(data);
}
</script>

<template>
  <!-- Title -->
  <h1 class="text-center fw-bold">ЛЕТАЕМ С ОДНИМ КРЫЛОМ</h1>

  <!-- Search Bar -->
  <SearchBar :on-submit="searchSubmit"/>
</template>

<style>
@media screen and (max-width: 1080px) {
  .search-panel {
    flex-flow: column nowrap;
  }

  .search-panel>* {
    width: 100% !important;
  }

  .form-glass {
    display: block;
  }
}

.search-panel {
  margin-top: 5rem;
}
</style>

