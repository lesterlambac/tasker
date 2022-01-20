<template>
  <div   @keydown.esc="$emit('close')">
    <ModalCenter @close="$emit('close')">
      
      <div class="inline-block relative float-right">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="relative z-10 inline-block rounded-md bg-white p-2 focus:outline-none group"
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
            class="cursor-pointer block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          >
            Edit
          </div>
          <div
            class="cursor-pointer block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            @click="deleteCard"
          >
            Delete
          </div>
        </div>
      </div>

      <div v-if="cardData.id">
        <span
          class="px-2 py-1 leading-tight inline-flex items-center bg-teal-100 rounded-md"
        >
          <span class="text-xs font-medium text-teal-800">{{
            cardData.label
          }}</span>
        </span>
      </div>
      <form
        :class="[!cardData.id ? 'space-y-5' : '']"
        @submit.prevent="createCard"
      >
        <div class="mt-2">
          <input
            type="text"
            v-if="!cardData.id"
            v-model="form.title"
            autocomplete="title"
            placeholder="Title"
            required
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          />

          <h3 v-else class="text-gray-900 font-medium text-xl">
            {{ cardData.title }}
          </h3>
        </div>

        <div class="mt-2">
          <textarea
            v-if="!cardData.id"
            v-model="form.description"
            placeholder="Add Description"
            rows="3"
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          ></textarea>

          <p v-else class="text-gray-700 text-md">{{ cardData.description }}</p>
        </div>

        <div class="mt-2">
          <input
            type="date"
            v-if="!cardData.id"
            v-model="form.date"
            autocomplete="date"
            placeholder="Date"
            required
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          />

          <p v-else class="text-gray-700 mt-6 text-base ">📅 {{ cardData.date }}</p>
        </div>

        <div class="mt-2">
          <input
            type="text"
            v-if="!cardData.id"
            v-model="form.label"
            autocomplete="label"
            placeholder="Label"
            required
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          />
        </div>

        <div v-if="!cardData.id">
          <div
            class="p-12 border border-gray-300 border-dashed rounded-lg"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
          >
            <input
              type="file"
              multiple
              id="assetsFieldHandle"
              class="w-px h-px opacity-0 overflow-hidden absolute"
              @change="onChange"
              ref="fileUpload"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <label for="assetsFieldHandle" class="block cursor-pointer">
              <div class="text-gray-500 text-center">
                Drop files here to upload
              </div>
            </label>
          </div>

          <div class="mt-4" v-if="filelist.length">
            <div
              class="text-sm p-1 flex space-x-2"
              v-for="file in filelist"
              :key="file.name + forceRender.counter"
            >
              <img
                class="w-12 h-12 object-fit"
                :src="file.src"
                alt=""
                :key="forceRender.counter"
              />
              <div class="flex flex-col flex-1">
                <span class="text-gray-900 font-medium mb-1">{{
                  file.name
                }}</span>
                <span class="text-gray-500">{{ file.size }} bytes</span>

                <!-- <button
                class="ml-2"
                type="button"
                @click="remove(filelist.indexOf(file))"
                title="Remove file"
              >
                remove
              </button> -->
              </div>
              <button
                @click="remove(filelist.indexOf(file))"
                class="text-gray-700"
              >
                <svg fill="none" viewBox="0 0 24 24" class="h-4 w-4">
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    stroke="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button
          v-if="!cardData.id"
          type="submit"
          class="w-full max-w-xs text-center block mx-auto pl-2 pr-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
        >
          <!-- <svg class="h-6 w-6" fill="none" viewbox="0 0 24 24">
            <path
              d="M12 7v10m5-5H7"
              stroke-linecap="round"
              stroke-width="2"
              stroke="currentColor"
            />
          </svg> -->
          <span class="ml-1">Create</span>
        </button>
      </form>
    </ModalCenter>
  </div>
</template>

<script>
import {
  defineComponent,
  nextTick,
  ref,
  reactive,
  useContext,
  onMounted,
} from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    cardData: {
      type: Object,
      required: false,
      default: {},
    },
  },
  setup({ cardData }, { emit }) {
    const { $fire } = useContext();

    const dropdownOpen = ref(false);

    const form = ref({
      title: "",
      description: "",
      date: "",
      label: "",
      status: "Pending",
      order: null,
      created: Date.now(),
      updated: Date.now(),
    });

    const filelist = ref([]);
    const fileUpload = ref();
    const forceRender = reactive({
      counter: 1,
    });

    const onChange = (e) => {
      filelist.value.push(...e.target.files);
    };

    const remove = (i) => {
      filelist.value.splice(i, 1);
    };

    const dragover = (event) => {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains("bg-green-300")) {
        event.currentTarget.classList.remove("bg-gray-100");
        event.currentTarget.classList.add("bg-green-300");
      }
    };

    const dragleave = (event) => {
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    };

    const drop = (event) => {
      event.preventDefault();

      filelist.value.push(...event.dataTransfer.files);

      for (let i = 0; i < filelist.value.length; i++) {
        let reader = new FileReader();
        reader.onload = (e) => {
          filelist.value[i].src = reader.result;
          forceRender.counter += Date.now();
        };

        reader.readAsDataURL(filelist.value[i]);
      }

      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    };

    const createCard = async () => {
      const tasks = $fire.database.ref(
        `tasks/${sluggify(form.value.title)}${Date.now()}`
      );
      try {
        await tasks.set({
          ...form.value,
          checklist: [],
          comments: [],
          activity: [],
        });
      } catch (e) {
        console.log(e);
      }
      emit("close");
      alert("New task successfully created!");
    };

    const deleteCard = async () => {
      const tasks = $fire.database.ref("tasks");
      try {
       await tasks.child(cardData.id).remove();
      } catch (e) {
        console.log(e);
      }
      emit("close");
      alert("Task successfully deleted!");
    };

    function sluggify(text) {
      return text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    return {
      form,
      createCard,
      deleteCard,
      onChange,
      remove,
      dragover,
      dragleave,
      drop,
      filelist,
      fileUpload,
      forceRender,
      dropdownOpen,
    };
  },
});
</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
