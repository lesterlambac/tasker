<template>
  <div>
    <ModalCenter @close="$emit('close')">
      <form class="space-y-5" @submit.prevent="createTask">
        <div class="mt-2">
          <input
            type="text"
            v-model="form.title"
            autocomplete="title"
            placeholder="Title"
            required
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          />
        </div>

        <div class="mt-2">
          <textarea
            v-model="form.description"
            placeholder="Add Description"
            rows="3"
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          ></textarea>
        </div>

        <div class="mt-2">
          <input
            type="date"
            v-model="form.date"
            autocomplete="date"
            placeholder="Date"
            required
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          />
        </div>

        <div class="mt-2">
          <input
            type="text"
            v-model="form.label"
            autocomplete="label"
            placeholder="Label"
            required
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          />
        </div>

        <!-- <div class="mt-2">
          <input
            type="text"
            v-model="form.status"
            autocomplete="status"
            placeholder="Status"
            required
            class="appearance-none border border-gray-200 block w-full px-3 py-2 rounded-md shadow-sm placeholder-grey-light bg-white text-black focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:text-black text-sm"
          />
        </div> -->

        <div>
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
  setup(_, { emit }) {
    const { $fire } = useContext();

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

    const createTask = async () => {
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

    function sluggify(text) {
      return text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    return {
      form,
      createTask,
      onChange,
      remove,
      dragover,
      dragleave,
      drop,
      filelist,
      fileUpload,
      forceRender,
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
