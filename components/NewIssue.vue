<template>
  <div>
    <ModalCenter @close="$emit('close')">
      <div v-if="cardData.id" class="inline-block relative float-right">
        <button
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
          <!-- <div
            class="cursor-pointer block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-grey-line hover:text-gray-900"
          >
            Edit
          </div> -->
          <div
            class="cursor-pointer block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-grey-line hover:text-gray-900"
            @click="deleteCard"
          >
            Delete
          </div>
        </div>
      </div>

      <div
        v-if="cardData.id"
        class="inline-flex items-center justify-start space-x-2 border-b border-grey-line pb-4"
      >
        <span
          class="px-2 py-1 leading-tight inline-flex items-center bg-green-100 rounded-md shadow-sm border border-green-200"
        >
          <span class="text-xs font-medium text-green-800">{{
            cardData.label
          }}</span>
        </span>

        <p class="text-gray-700 text-xs">
          🎯 {{ $moment(cardData.date).format("MMMM DD") }}
        </p>
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
            placeholder="Add Title"
            required
            class="appearance-none border border-grey-line block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 bg-white text-black focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:bg-white focus:text-black text-sm"
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
            class="appearance-none border border-grey-line block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 bg-white text-black focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:bg-white focus:text-black text-sm"
          ></textarea>

          <p v-else class="text-gray-700 text-md">{{ cardData.description }}</p>
        </div>

        <div class="mt-2" v-if="!cardData.id">
          <div class="date-picker">
              <date-picker
                v-model="form.date"
                class="w-full"
                placeholder="Add Deadline"
                format="MM/dd/yyyy"
              >
              </date-picker>
          </div>
        </div>

        <div class="mt-2">
          <input
            type="text"
            v-if="!cardData.id"
            v-model="form.label"
            autocomplete="label"
            placeholder="Add Label"
            required
            class="appearance-none border border-grey-line block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 bg-white text-black focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:bg-white focus:text-black text-sm"
          />
        </div>

        <div v-if="showUploadOption" class="mt-4">
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

          <!-- Test button -->
          <button
            v-if="cardData.id"
            type="button"
            @click="fireUploadFiles"
            class="mt-4 w-full max-w-xs text-center block mx-auto pl-2 pr-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
          >
            <!-- <svg class="h-6 w-6" fill="none" viewbox="0 0 24 24">
              <path
                d="M12 7v10m5-5H7"
                stroke-linecap="round"
                stroke-width="2"
                stroke="currentColor"
              />
            </svg> -->
            <span class="ml-1">Upload Now</span>
          </button>
        </div>

        <div
          v-if="cardData.id"
          class="mt-8 space-y-4 bg-white shadow-card border border-grey-line rounded-lg relative"
        >
          <div
            class="flex items-center justify-between space-x-4 py-4 px-6 border-b border-grey-line"
          >
            <h3 class="text-base font-medium text-gray-900">Files</h3>
            <button
              @click="showUploadOption = !showUploadOption"
              type="button"
              class="py-2 px-3 text-xs font-medium hover:bg-gray-200 border border-gray-200 rounded"
            >
              <span v-if="showUploadOption"> Hide Upload Option </span>
              <span v-else> Show Upload Option </span>
            </button>
          </div>

          <div class="relative py-4 px-6" v-if="fireAttachedFiles.length">
            <div v-if="loading.files" class="text-center py-6">
              <LoadingSpinner
                class="mr-2"
                handle="text-gray-400"
                circle="text-gray-800"
              />
              Loading Files ...
            </div>
            <template>
              <!-- <div
                class="flex space-x-4 pb-6 relative"
                v-for="file in attachedFiles"
                :key="file.metaData.name + '' + forceRender.files"
              >
                <FileRow :file="file" />
              </div> -->

              <div
                class="flex space-x-4 pb-6 relative"
                v-for="file in fireAttachedFiles"
                :key="file.metaData.name + 'file'"
              >
                <FileRow :file="file" />
              </div>
            </template>
          </div>
        </div>

        <div
          v-if="cardData.id"
          class="mt-8 space-y-4 bg-white shadow-card border border-grey-line rounded-lg p-6"
        >
          <div
            class="flex items-start justify-center space-x-4 pb-2 border-b border-grey-line"
          >
            <img
              v-if="currentUser.photo"
              :src="currentUser.photo"
              class="flex-none h-10 w-10 rounded-full shadow-sm border-grey-line fill-current text-gray-500 shadow-sm object-contain"
              alt="Photo"
            />

            <svg
              v-else
              class="flex-none h-10 w-10 rounded-full shadow-sm border-grey-line fill-current text-gray-500 shadow-sm"
              viewBox="0 0 24 24"
            >
              <path
                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>

            <textarea
              v-model="comment"
              @keydown.enter.exact="createComment"
              placeholder="Leave a comment"
              rows="2"
              class="appearance-none border-none block w-full px-3 py-2 rounded-md placeholder-gray-400 bg-white text-black focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:bg-white focus:text-black text-sm"
            ></textarea>
          </div>

          <template v-if="comments.length">
            <div
              class="flex items-start justify-center space-x-4"
              v-for="comment in comments"
              :key="comment.id + forceRender.comments"
            >
              <div v-if="getUserPhoto(comment.user)">
                <img
                  :src="getUserPhoto(comment.user)"
                  class="flex-none h-10 w-10 rounded-full shadow-sm border-grey-line fill-current text-gray-500 shadow-sm object-contain"
                  alt="Photo"
                />
              </div>

              <svg
                v-else
                class="flex-none h-10 w-10 rounded-full shadow-sm border-grey-line fill-current text-gray-500 shadow-sm"
                viewBox="0 0 24 24"
              >
                <path
                  d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>

              <div class="w-full flex-1 bg-grey-light rounded-lg p-4">
                <div class="flex items-center justify-center mb-2">
                  <h4
                    class="text-gray-900 font-medium text-sm flex-1 text-left"
                  >
                    {{ comment.name }}
                  </h4>
                  <span class="text-gray-500 text-xs flex-none">{{
                    $moment(comment.date).fromNow()
                  }}</span>
                </div>
                <p class="text-gray-700 text-sm">
                  {{ comment.message }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <div
          v-if="cardData.id"
          class="mt-8 space-y-4 bg-white shadow-card border border-grey-line rounded-lg relative"
        >
          <div
            class="flex items-start justify-start space-x-4 py-4 px-6 border-b border-grey-line"
          >
            <h3 class="text-base font-medium text-gray-900">Activities</h3>
          </div>

          <div class="relative py-4 px-6" v-if="activities.length">
            <div
              class="flex items-start justify-center space-x-4 pb-6 relative"
              v-for="(activity, index) in activities"
              :key="activity.id"
            >
              <div class="flex-none flex items-center justify-center flex-col">
                <img
                  v-if="getUserPhoto(activity.user)"
                  :src="getUserPhoto(activity.user)"
                  class="flex-none h-10 w-10 rounded-full shadow-sm border-grey-line fill-current text-gray-500 shadow-sm object-contain relative z-10"
                  alt="Photo"
                />
                <svg
                  v-else
                  class="flex-none h-10 w-10 rounded-full shadow-sm border-grey-line fill-current text-gray-500 shadow-sm relative z-10 bg-white"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                <div
                  v-if="index !== activities.length - 1"
                  class="absolute top-0 bottom-0 h-full w-[1px] bg-grey-line flex-1 z-0"
                ></div>
              </div>

              <div class="w-full flex-1 rounded-lg px-4">
                <div class="flex items-center justify-center">
                  <h4
                    class="text-gray-600 font-medium text-sm flex-1 text-left"
                  >
                    {{ getUserName(activity.user) }}
                  </h4>
                </div>
                <p class="text-gray-500 text-sm">
                  {{ activity.data }}
                </p>
                <span class="text-gray-500 text-xs">{{
                  $moment(activity.date).fromNow()
                }}</span>
              </div>
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
          <span v-if="loading.creatingTask">
            <LoadingSpinner
              class="mr-2"
              handle="text-gray-400"
              circle="text-gray-800"
            />
            Creating ...
          </span>
          <span v-else class="ml-1">Create</span>
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
  computed,
  onBeforeMount,
} from "@nuxtjs/composition-api";
import { useFiles } from "~/composables/useFiles";
import { isFileImage } from "~/utils/helpers.js";

export default defineComponent({
  props: {
    cardData: {
      type: Object,
      required: false,
      default: {},
    },
    users: {
      type: Array,
      required: false,
      default: [],
    },
  },
  setup({ cardData, users }, { emit }) {
    const { $fire, $toast } = useContext();
    const fireUser = $fire.auth.currentUser;
    const currentUser = ref({});
    const comments = ref([]);
    const activities = ref([]);

    const dropdownOpen = ref(false);

    const form = ref({
      title: null,
      description: null,
      date: null,
      label: null,
      status: "Pending",
      order: 0,
      created: Date.now(),
      updated: Date.now(),
    });
    const comment = ref();

    const filelist = ref([]);
    const fileUpload = ref();
    const { uploadFiles, getFiles, fireAttachedFiles } = useFiles();
    const attachedFiles = ref([]);

    const loadFiles = async () => {
      loading.files = true;
      attachedFiles.value = await getFiles(cardData.id);
      forceRender.files = Date.now();
      loading.files = false;
    };

    const forceRender = reactive({
      counter: 1,
      comments: 1,
      activities: 1,
      files: 1,
    });
    const loading = reactive({
      files: false,
      uploading: false,
      creatingTask: false,
    });
    const showUploadOption = ref(true);

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

    const createComment = async () => {
      const comments = $fire.database.ref(
        `comments/${cardData.id}/user-${
          currentUser.value.id
        }-date-${Date.now()}`
      );
      try {
        await comments.set({
          id: `user-${currentUser.value.id}-date-${Date.now()}`,
          user: currentUser.value.id,
          email: currentUser.value.email,
          name: currentUser.value.name,
          message: comment.value,
          date: Date.now(),
        });
      } catch (e) {
        console.log(e);
      }
      comment.value = "";
    };

    const createCard = async () => {
      loading.creatingTask = true;
      try {
        const title = `${sluggify(form.value.title)}${Date.now()}`;
        const tasks = $fire.database.ref(`tasks/${title}`);

        await tasks.set({
          ...form.value,
          checklist: [],
          comments: [],
          activity: [],
        });

        await uploadFiles(filelist.value, title);
        filelist.value = [];
      } catch (e) {
        console.log(e);
      }

      loading.creatingTask = false;
      emit("close");
      emit("created");
    };

    const deleteCard = async () => {
      const tasks = $fire.database.ref("tasks");
      try {
        await tasks.child(cardData.id).remove();
      } catch (e) {
        console.log(e);
      }
      $toast.success("Deleted.").goAway(1500);
      emit("close");
    };

    const sorter = (a, b) => (a.date < b.date ? 1 : -1);
    const getComments = (items) => {
      const unsortedComments = [];
      items.forEach((child) => {
        unsortedComments.push({
          id: child.key,
          ...child.val(),
        });
      });
      comments.value = unsortedComments.sort(sorter);
      forceRender.comments = Date.now();
    };

    const getActivities = (items) => {
      const unsortedActivities = [];
      items.forEach((child) => {
        unsortedActivities.push({
          id: child.key,
          ...child.val(),
        });
      });
      activities.value = unsortedActivities.sort(sorter);
      forceRender.activities = Date.now();
    };

    const getUserPhoto = (userId) => {
      return users.find((user) => user.id == userId).photo;
    };

    const getUserName = (userId) => {
      return users.find((user) => user.id == userId).name;
    };

    function sluggify(text) {
      return text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const fireUploadFiles = async () => {
      loading.uploading = true;
      await uploadFiles(filelist.value, cardData.id);
      loading.uploading = false;

      loading.files = true;
      await loadFiles();
      loading.files = false;

      filelist.value = [];
    };

    const initShowFileUploadOption = () => {
      if (cardData.id) {
        showUploadOption.value = false;
      }
    };

    loadFiles();

    onBeforeMount(() => {
      console.log(attachedFiles);
      initShowFileUploadOption();
      currentUser.value = users.find((user) => user.id == fireUser.uid);

      const fireComments = $fire.database.ref(`comments/${cardData.id}`);
      fireComments.on("value", getComments);

      const fireActivities = $fire.database.ref(`activities/${cardData.id}`);
      fireActivities.on("value", getActivities);
    });

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
      comment,
      comments,
      activities,
      createComment,
      getUserPhoto,
      getUserName,
      currentUser,
      uploadFiles,
      fireUploadFiles,
      attachedFiles,
      isFileImage,
      showUploadOption,
      loading,
      fireAttachedFiles,
    };
  },
});
</script>

<style lang="scss">
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}

.list-group-activities .list-group-item:not(:last-child):before {
  border-left: 1px solid #e3ebf6;
  content: "";
  height: 100%;
  left: 1.25rem;
  position: absolute;
  top: 1rem;
  z-index: 1;
}

.vdp-datepicker {
  select,
  input {
    @apply appearance-none;
    @apply border-grey-line;
    @apply block;
    @apply w-full;
    @apply px-3;
    @apply py-2;
    @apply rounded-md;
    @apply shadow-sm;
    @apply placeholder-gray-400;
    @apply bg-white;
    @apply text-black;
    @apply text-sm;
    &:focus {
      @apply outline-none;
      @apply border-gray-400;
      @apply ring-1;
      @apply ring-gray-400;
      @apply bg-white;
      @apply text-black;
    }
  }
}

.date-picker select {
  height: 2.5em;
}
</style>
