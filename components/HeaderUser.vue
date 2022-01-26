<template>
  <div class="flex relative">
    <button
      @click="open = !open"
      type="button"
      class="bg-white rounded-full flex text-sm ring-2 ring-white ring-opacity-20 shadow-sm border"
    >
      <img
        :src="user.photo || require('~/assets/icons/person.svg')"
        class="flex-none h-10 w-10 rounded-full fill-current text-gray-500 shadow-sm"
      />
    </button>

    <div
      v-show="open"
      @click="open = false"
      class="fixed inset-0 h-full w-full z-10"
    ></div>

    <div
      v-show="open"
      class="mt-10 mr-2 top-0 right-0 z-40 absolute w-52 rounded shadow-lg bg-white focus:outline-none p-4 border border-gray-100"
    >
      <div
        class="flex flex-col items-start justify-start border-gray-100"
      >
        <span class="text-base font-medium text-gray-900">{{ user.name }}</span>
        <span class="text-sm text-gray-500">{{ user.position }}</span>
      </div>
      <!-- <a
        @click="signOut"
        class="cursor-pointer block px-4 py-2 text-sm font-medium text-blue-900 hover:bg-gray-200 rounded-md mt-2"
        >Sign Out</a
      > -->
    </div>
  </div>
</template>


<script>
import {
  defineComponent,
  ref,
  useContext,
  computed,
  useStore,
} from "@nuxtjs/composition-api";
import Cookies from "universal-cookie";
import { RootState } from "~/store";

export default defineComponent({
  setup() {
    const open = ref(false);
    const store = useStore();
    const user = computed(() => store.state.user);

    const signOut = () => {
      cookies.remove("email");
      cookies.remove("password");
      $fire.auth.signOut();
      redirect("/login");
    };

    return {
      open,
      signOut,
      user,
    };
  },
});
</script>