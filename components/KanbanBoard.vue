<template>
  <div class="h-screen flex">
    <Sidebar />

    <div class="flex-1 min-w-0 flex flex-col bg-white">
      <Header />

      <KanbanList> </KanbanList>
    </div>
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

