<template>
  <div
    :class="
      showCustomSelect
        ? 'focus:outline-none border border-gray-400 ring-1 ring-gray-400 bg-white text-black '
        : 'border border-grey-line'
    "
    class="relative cursor-pointer select placeholder-gray rounded-md"
  >
    <!-- Click outside select closes the token list -->
    <div
      v-if="showCustomSelect"
      @click="showCustomSelect = !showCustomSelect"
      class="fixed inset-0 transition-opacity bg-black bg-opacity-0"
      aria-hidden="true"
    ></div>

    <div
      @click="showCustomSelectAndMakeInputFocus"
      class="bg-white flex items-center justify-between block px-3 py-2 text-sm tracking-wide rounded-md text-grey focus:text-black max-h-9 z-40 shadow-sm"
    >
      <span class="text-sm text-gray-400">
        <img
          v-if="selectedUser"
          class="object-contain w-4 h-4 mr-1 rounded-full"
          :src="selectedUser.photo || require('~/assets/icons/person.svg')"
          alt=""
        />
        <!-- <svg
          v-else
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 6.01088 14.7098 4.10322 13.3033 2.6967C11.8968 1.29018 9.98912 0.5 8 0.5ZM8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14ZM3.50004 7.5875C3.69269 5.40916 5.42351 3.68467 7.60254 3.5C7.70987 3.49335 7.81489 3.53308 7.89092 3.60912C7.96696 3.68516 8.0067 3.79018 8.00004 3.8975V4.6475C7.99349 4.83092 7.85263 4.98139 7.67004 5C6.26131 5.14806 5.14809 6.26128 5.00004 7.67C4.9805 7.86111 4.81708 8.00492 4.62504 8H3.87504C3.77017 7.99894 3.67014 7.95569 3.59754 7.88C3.52913 7.79839 3.49428 7.69384 3.50004 7.5875Z"
            fill="#A6A6A6"
          />
        </svg> -->
      </span>
      <input
        class="flex-1 px-2 pl-1 text-sm text-left truncate focus:text-black border-0 focus:outline-none placeholder-gray-400"
        :class="[
          showCustomSelect ? 'text-grey-light' : 'text-black',
          selectedUser ? 'text-black' : 'text-grey-light',
        ]"
        v-model="inputValue"
        :placeholder="users.length ? 'Assign user' : 'No users'"
        ref="input"
      />

      <span>
        <svg
          v-if="showCustomSelect && users.length"
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 1.25L4.79289 0.542894C5.18342 0.152369 5.81658 0.152369 6.20711 0.542894L5.5 1.25ZM9.70711 4.04289L10.4142 4.75L9 6.16421L8.29289 5.45711L9.70711 4.04289ZM2.70711 5.45711L2 6.16421L0.585787 4.75L1.29289 4.04289L2.70711 5.45711ZM6.20711 0.542894L9.70711 4.04289L8.29289 5.45711L4.79289 1.95711L6.20711 0.542894ZM6.20711 1.95711L2.70711 5.45711L1.29289 4.04289L4.79289 0.542894L6.20711 1.95711Z"
            fill="#A6A6A6"
          />
        </svg>
        <svg
          v-else
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 5.75L6.20711 6.45711C5.81658 6.84763 5.18342 6.84763 4.79289 6.45711L5.5 5.75ZM1.29289 2.95711L0.585786 2.25L2 0.835786L2.70711 1.54289L1.29289 2.95711ZM8.29289 1.54289L9 0.835786L10.4142 2.25L9.70711 2.95711L8.29289 1.54289ZM4.79289 6.45711L1.29289 2.95711L2.70711 1.54289L6.20711 5.04289L4.79289 6.45711ZM4.79289 5.04289L8.29289 1.54289L9.70711 2.95711L6.20711 6.45711L4.79289 5.04289Z"
            class="darkmode-svg"
            fill="#A6A6A6"
          ></path>
        </svg>
      </span>
    </div>
    <div
      v-if="showCustomSelect"
      class="absolute left-0 right-0 z-40 flex flex-col mt-1 overflow-y-auto bg-white border shadow-lg border-gray-10 border-opacity-15 rounded-b-md max-h-48"
    >
      <div
        @click="setSelected(user)"
        v-for="user in users"
        :key="user.id"
        :value="user"
        class="text-sm"
      >
        <div
          class="flex items-center justify-between w-full px-3 py-2 cursor-pointer group hover:bg-gray-100"
        >
          <span class="pr-2">
            <img
              class="object-contain w-4 h-4 mr-1 rounded-full"
              :src="user.photo || require('~/assets/icons/person.svg')"
              alt=""
            />
          </span>

          <div class="flex-1 text-sm font-semibold truncate">
            {{ user.name }}
          </div>

          <IconsSelectDropdown class="hidden w-3 h-3 group-hover:block" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watch,
  onMounted,
} from "@nuxtjs/composition-api";
import { useUsers } from "~/composables/useUsers";

export default defineComponent({
  props: ["setSelectedUser"],
  setup({ setSelectedUser }, { emit }) {
    const showCustomSelect = ref(false);
    const selectedUser = ref();
    const inputValue = ref("");
    const input = ref(null);

    const { fireUsers } = useUsers();
    const users = computed(() =>
      fireUsers.value.filter((user: any) =>
        `${user.name}`.toLowerCase().includes(inputValue.value.toLowerCase())
      )
    );

    watch(
      () => setSelectedUser,
      () => setPreSelectedUser(setSelectedUser)
    );

    const setPreSelectedUser = (userId: any) => {
      if (userId) {
        const selected = fireUsers.value.find(
          (user: any) => user.id == userId
        ) as any;

        selectedUser.value = selected;
        if (selected) {
          inputValue.value = selected.name;
        } else {
          inputValue.value = "";
        }
        emit("selected", selected);
      }
    };

    const setSelected = (payload: any) => {
      selectedUser.value = payload;

      showCustomSelect.value = false;
      if (selectedUser.value) {
        inputValue.value = `${selectedUser.value.name}`;
      } else {
        inputValue.value = "";
      }
      emit("selected", payload);
    };

    const showCustomSelectAndMakeInputFocus = () => {
      showCustomSelect.value = !showCustomSelect.value;
      setTimeout(() => {
        (input.value as any).focus();
        (input.value as any).clear();
      });
    };

    onMounted(() => {
      if (setSelectedUser) {
        setPreSelectedUser(setSelectedUser);
      }
    });

    return {
      showCustomSelect,
      setSelected,
      selectedUser,
      users,
      inputValue,
      input,
      showCustomSelectAndMakeInputFocus,
    };
  },
});
</script>
<style scoped>
.select ::-webkit-scrollbar {
  width: 10px;
}

.select ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 3px #a6a6a6;
  border-radius: 10px;
}

.select ::-webkit-scrollbar-thumb {
  background: #a6a6a6;
  border-radius: 10px;
}
</style>
