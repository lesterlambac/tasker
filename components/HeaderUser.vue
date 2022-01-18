<template>
  <div class="flex relative">
    <button
      @click="open = !open"
      type="button"
      class="bg-white rounded-full flex text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100 bg-grey-stroke"
    >
      <svg
        class="h-8 w-8 rounded-full shadow-sm border-gray-200 fill-current text-gray-500 shadow-sm"
        viewBox="0 0 24 24"
      >
        <path
          d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
        ></path>
      </svg>
    </button>

    <div v-if="open" class="fixed inset-0 z-40 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          @click="open = false"
          class="fixed inset-0 transition-opacity bg-transparent bg-opacity-40"
          aria-hidden="true"
        ></div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="mt-12 mr-6 top-0 right-0 z-40 absolute w-52 rounded shadow-lg bg-white focus:outline-none p-4 border border-gray-100"
        >
        <div class="flex flex-col items-start justify-start border-b border-gray-100 pb-3">
          <span class="text-base font-medium text-gray-900">Lester Moore</span>
          <span class="text-sm text-gray-500">Front-End Developer</span>
        </div>
          <a
            @click="open = false"
            class="cursor-pointer block px-4 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 rounded-md mt-2"
            >Sign Out</a
          >
        </div>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const open = ref(false);
    return {
      open,
    };
  },
});
</script>