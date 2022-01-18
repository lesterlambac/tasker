<template>
  <div class="flex-shrink-0 sm:border-b-2 sm:border-gray-200">
    <header>
      <div class="px-4 sm:px-6">
        <div class="flex items-center justify-between py-2">
          <div class="sm:flex sm:items-center">
            <h2 class="text-2xl font-semibold text-gray-900 leading-tight">
              All Issues
            </h2>
          </div>
          <HeaderUser />
        </div>
      </div>
      <div class="flex px-4 p-1 border-t border-b bg-gray-200 sm:hidden">
        <button
          class="inline-flex items-center justify-center w-1/2 px-2 py-1 rounded"
        >
          <svg class="h-6 w-6 text-gray-600" fill="none" viewbox="0 0 24 24">
            <path
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
              stroke-linecap="round"
              stroke-width="2"
              stroke="currentColor"
            />
          </svg>
          <span class="ml-2 text-sm font-medium text-gray-600 leading-none"
            >List</span
          >
        </button>
        <button
          class="inline-flex items-center justify-center w-1/2 px-2 py-1 bg-white rounded shadow"
        >
          <svg class="h-6 w-6 text-gray-600" fill="none" viewbox="0 0 24 24">
            <path
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              stroke-width="2"
              stroke="currentColor"
            />
          </svg>
          <span class="ml-2 text-sm font-medium text-gray-900 leading-none"
            >Board</span
          >
        </button>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const openUserMenu = ref(false);
    return {
      openUserMenu,
    };
  },
});
</script>