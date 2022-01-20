<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <transition name="fade" appear>
        <div
          @click="$emit('close')"
          class="fixed inset-0 transition-opacity bg-black bg-opacity-40 transition duration-200 ease-in-out"
          aria-hidden="true"
        ></div>
      </transition>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <transition name="pop" appear>
        <div
          class="inline-block w-full px-5 py-8 text-left align-bottom transition-all transform bg-gray-50 shadow-xl rounded-xl sm:my-8 sm:align-middle sm:max-w-xl sm:p-8"
        >
          <slot></slot>
        </div>
      </transition>
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.2s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.2s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
