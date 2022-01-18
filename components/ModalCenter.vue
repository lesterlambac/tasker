<template>
  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        @click="$emit('close')"
        class="fixed inset-0 transition-opacity bg-black bg-opacity-40"
        aria-hidden="true"
      ></div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="inline-block w-full px-5 py-8 text-left align-bottom transition-all transform bg-white shadow-xl rounded-xl sm:my-8 sm:align-middle sm:max-w-xl sm:p-8"
      >
        <div>
          <div class="sm:mt-5">
            <h2
              class="mb-6 text-lg font-semibold leading-6 text-center text-black lg:text-2xl"
            >
              {{ title }}
            </h2>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["title"],
  setup(_, { emit }) {},
});
</script>
