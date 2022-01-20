<template>
  <Kanban />
</template>

<script lang="ts">
import {
  defineComponent,
} from "@nuxtjs/composition-api";

export default defineComponent({
  middleware: 'auth',
  layout: "default",
  setup() {
    return {
    };
  },
});
</script>

