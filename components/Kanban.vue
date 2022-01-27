<template>
  <div class="flex" :class="{ 'no-user': noUser }">
    <!-- <Sidebar class="h-screen" /> -->

    <div
        v-show="noUser"
        class="fixed inset-0 h-full w-full z-10 bg-black bg-opacity-40 transition duration-200 ease-in-out"
      ></div>

    <div class="flex-1 min-w-0 flex flex-col bg-white">
      <Header />
      <KanbanBoard />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["noUser"],
  setup() {
    const sidebarOpen = ref(true);
    return {
      sidebarOpen,
    };
  },
});
</script>

<style scoped>
.no-user {
  pointer-events: none;
}
</style>



