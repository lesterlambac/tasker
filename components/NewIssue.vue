<template>
  <div>
    <ModalCenter @close="$emit('close')">
      <!-- Attach files -->
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
    </ModalCenter>
  </div>
</template>

<script>
import {
  defineComponent,
  nextTick,
  ref,
  reactive,
} from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
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
      console.log(event.dataTransfer.files);
      event.preventDefault();

      filelist.value.push(...event.dataTransfer.files);

      for (let i = 0; i < filelist.value.length; i++) {
        let reader = new FileReader();
        reader.onload = (e) => {
          filelist.value[i].src = reader.result;
          forceRender.counter += Date.now();
        };

        reader.readAsDataURL(filelist.value[i]);
        console.log(forceRender.counter);
      }

      // onChange(event); // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");

      console.log(filelist.value);
    };

    return {
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
