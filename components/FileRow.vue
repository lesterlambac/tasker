<template>
  <div class="flex space-x-4 pb-6 relative w-full">
    <img
      v-if="isFileImage(file.metaData)"
      class="w-12 h-12 object-fit"
      :src="file.downloadURL"
      alt=""
    />

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="flex-none h-10 w-10 shadow-sm border-grey-line fill-current text-gray-500 shadow-sm"
    >
      <path
        class="primary"
        d="M6 2h6v6c0 1.1.9 2 2 2h6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"
      ></path>
      <polygon class="secondary" points="14 2 20 8 14 8"></polygon>
    </svg>

    <div class="flex flex-col flex-1">
      <a :href="file.downloadURL" target="_blank" class="text-gray-900 font-medium mb-1">{{
        file.metaData.name
      }}</a>
      <span class="text-gray-500">{{ file.metaData.size }} bytes</span>

      <!-- <button
                class="ml-2"
                type="button"
                @click="remove(filelist.indexOf(file))"
                title="Remove file"
              >
                remove
              </button> -->

    </div>
    <div class="flex-none inline-block relative">
      <button
        type="button"
        @click="dropdownOpen = !dropdownOpen"
        class="relative z-10 inline-block rounded-md p-2 focus:outline-none group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-4 icon-dots-vertical"
        >
          <path
            class="secondary fill-current text-gray-500 group-hover:text-gray-900 font-bold"
            fill-rule="evenodd"
            d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
          ></path>
        </svg>
      </button>

      <div
        v-show="dropdownOpen"
        @click="dropdownOpen = false"
        class="fixed inset-0 h-full w-full z-10"
      ></div>

      <div
        v-show="dropdownOpen"
        class="absolute right-0 mt-1 py-2 w-48 bg-white border border-gray-100 rounded-md shadow-xl z-20"
      >
        <div
          class="cursor-pointer block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-grey-line hover:text-gray-900"
          @click="$emit('delete', file)"
        >
          Delete
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "@nuxtjs/composition-api";
import { isFileImage } from "~/utils/helpers.js";

export default defineComponent({
  props: ["file"],
  setup({ file }) {

    const dropdownOpen = ref(false);

    return {
      dropdownOpen,
      isFileImage,
    };
  },
});
</script>