<template>
  <div class="flex" :class="{ 'no-user' : noUser }">
    <!-- <Sidebar class="h-screen" /> -->

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



