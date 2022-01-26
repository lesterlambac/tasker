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
  middleware: "auth",
  layout: "default",
  setup() {
    const store = useStore<RootState>();
    const user = computed(() => store.getters.getUser);
    const { getUsers } = useUsers();
    const fireUsers = ref(<any>[]);

    useFetch(async () => {
      fireUsers.value = await getUsers();
    });

    onMounted(() => {
      if (fireUsers.value) {
        store.commit("setUsers", fireUsers.value);
      }
    });

    return {
      user,
    };
  },
});
</script>

