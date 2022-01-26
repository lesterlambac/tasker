<template>
  <Kanban />
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  useFetch,
  onMounted,
  useContext,
  ref,
} from "@nuxtjs/composition-api";
import { RootState } from "~/store";
import { useUsers } from "~/composables/useUsers";

export default defineComponent({
  middleware: "authHandle",
  layout: "default",
  setup() {
    const store = useStore<RootState>();
    const user = computed(() => store.getters.getUser);
    const { redirect } = useContext();
    // const { users } = useUsers();
    // const fireUsers = computed(() => users);

    onMounted(() => {
      // console.log(fireUsers.value) 
      
    });

    return {
      user,
    };
  },
});
</script>

