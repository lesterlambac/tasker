<template>
  <div
    :class="
      sidebarOpen
        ? 'translate-x-0 ease-out duration-300'
        : '-translate-x-full ease-in duration-300'
    "
    class="fixed z-30 inset-y-0 left-0 w-64 px-8 py-4 bg-gray-100 border-r overflow-auto lg:static lg:inset-auto lg:translate-x-0"
  >
    <div class="-mx-3 pl-3 pr-1 flex items-center justify-between">
      <span class="relative">
        <img alt="" class="h-9 w-9" src="/favicon.ico" />
      </span>
      <button @click="sidebarOpen = false" class="text-gray-700 lg:hidden">
        <svg class="h-6 w-6" fill="none" viewbox="0 0 24 24">
          <path
            d="M6 18L18 6M6 6L18 18"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
          />
        </svg>
      </button>
    </div>

    <Navigation />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const sidebarOpen = ref(true);
    return {
      sidebarOpen,
    };
  },
});
</script>