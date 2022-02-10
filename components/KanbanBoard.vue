<template>
  <div class="flex-1 overflow-auto p-6 card-scene mx-auto">

    <div
      v-if="loading.tasks"
      class="flex items-center justify-center w-full"
    >
      <LoadingSpinner
        class="mr-2 h-12 w-12"
        handle="text-gray-400"
        circle="text-gray-800"
      />
      Loading Issues ...
    </div>

    <template v-else>

    <div class="mb-2">
      <button
        @click="createCard"
        class="
          inline-flex
          items-center
          ml-3
          pl-2
          pr-4
          py-2
          text-sm
          font-medium
          text-white
          bg-gray-600
          rounded-md
          hover:bg-gray-700
        "
      >
        <svg class="h-6 w-6" fill="none" viewbox="0 0 24 24">
          <path
            d="M12 7v10m5-5H7"
            stroke-linecap="round"
            stroke-width="2"
            stroke="currentColor"
          />
        </svg>
        <span class="ml-1">New Issue</span>
      </button>
    </div>

    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".column-drag-handle"
      @drag-start="dragStart"
      :drop-placeholder="upperDropPlaceholderOptions"
      class="p-3 inline-flex overflow-hidden"
    >
      <Draggable
        v-for="column in scene.children"
        :key="column.id + forceRender"
      >
        <div
          class="
            mr-3
            flex-shrink-0 flex flex-col
            w-80
            bg-gray-100
            rounded-md
            h-full
          "
        >
          <h3
            class="
              flex-shrink-0
              pt-3
              pb-1
              px-3
              text-sm
              font-medium
              text-gray-700
            "
          >
            {{ column.name }}
          </h3>
          <div class="flex-1 min-h-0 overflow-y-visible">
            <div class="pt-1 pb-3 px-3 block">
              <Container
                group-name="col"
                @drop="(e) => onCardDrop(column.id, e)"
                @drag-start="(e) => log('drag start', e)"
                @drag-end="(e) => onDragEnd(column.name, e)"
                :get-child-payload="getCardPayload(column.id)"
                drag-class="card-ghost"
                drop-class="card-ghost-drop"
                :drop-placeholder="dropPlaceholderOptions"
                class="space-y-4"
              >
                <Draggable v-for="card in column.children" :key="card.id">
                  <div @click="viewCard(card)">
                    <div class="p-5 bg-white rounded-md shadow cursor-pointer">
                      <div class="">
                        <div class="float-right pl-6">
                          <img
                            alt=""
                            class="h-6 w-6 rounded-full shadow border"
                            :src="
                              getAssigedUser(card.assignedTo) ||
                              require('~/assets/icons/person.svg')
                            "
                          />
                        </div>
                        <p
                          class="text-sm font-medium leading-snug text-gray-900"
                        >
                          {{ card.description }}
                        </p>
                      </div>
                      <div class="mt-4 flex justify-between items-baseline">
                        <div class="text-sm text-gray-600">
                          <time datetime="2019-09-14">{{
                            $moment(card.date).format("DD MMM YYYY")
                          }}</time>
                        </div>
                        <div>
                          <span
                            class="
                              px-2
                              py-1
                              leading-tight
                              inline-flex
                              items-center
                              bg-gray-200
                              rounded
                            "
                          >
                            <span class="text-xs font-medium text-gray-900">{{
                              card.label
                            }}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Draggable>
              </Container>
            </div>
          </div>
        </div>
      </Draggable>
    </Container>

    <NewIssue
      :cardData="cardData"
      :users="users"
      v-if="showNewIssueModal"
      @close="showNewIssueModal = false"
      @created="$toast.success('New task sucessfully added.').goAway(1500)"
      @edited="$toast.success('Task successfully edited. 🎉').goAway(1500)"
      @uploaded="$toast.success('Files successfully uploaded. 🎉').goAway(1500)"
    />
    </template>
  </div>
</template>


<script>
import { Container, Draggable } from "vue-smooth-dnd";

import {
  defineComponent,
  nextTick,
  ref,
  reactive,
  useContext,
  useStore,
  computed,
  onMounted,
} from "@nuxtjs/composition-api";
import { applyDrag, generateItems } from "../utils/helpers.js";

export default defineComponent({
  components: { Container, Draggable },
  setup() {
    const { $fire, $fireModule, context, $toast } = useContext();
    const fireTasks = $fire.database.ref("tasks");
    const fireUsers = $fire.database.ref("users");
    const fireActivities = $fire.database.ref("activities");

    const store = useStore();
    const user = computed(() => store.state.user);

    const cardTracker = reactive({
      dropCounter: 1,
      sourceColumn: "",
    });

    const loading = reactive({
      tasks: true,
    })

    const showNewIssueModal = ref(false);
    const cardData = ref({});
    const forceRender = ref(1);

    const columnNames = ["Pending", "For Review", "Done"];
    const pendingTasks = ref();
    const forReviewTasks = ref([]);
    const doneTasks = ref([]);
    const scene = ref({
      type: "container",
      props: {
        orientation: "horizontal",
      },
      children: generateItems(columnNames.length, (i) => ({
        id: `column${i}`,
        type: "container",
        name: columnNames[i],
        props: {
          orientation: "vertical",
          className: "card-container",
        },
        children: [],
      })),
    });

    const users = ref([]);
    const tasks = ref([]);
    const sorter = (a, b) => (a.order > b.order ? 1 : -1);

    const getTasks = async (items) => {
      const usortedItems = [];

      items.forEach((child) => {
        usortedItems.push({
          id: child.key,
          ...child.val(),
        });
      });

      tasks.value = usortedItems.sort(sorter);
      pendingTasks.value = [];
      forReviewTasks.value = [];
      doneTasks.value = [];

      tasks.value.map((task) => {
        switch (task.status) {
          case "Pending":
            pendingTasks.value.push(task);
            break;
          case "For Review":
            forReviewTasks.value.push(task);
            break;
          case "Done":
            doneTasks.value.push(task);
            break;
        }
      });

      let pendingToUser = [];
      if (pendingTasks.value) {
        pendingToUser = pendingTasks.value.filter((pendingTask) => {
          return pendingTask.assignedTo == user.value.id;
        });
      }

      scene.value.children[0].children = pendingToUser || pendingTasks.value;
      scene.value.children[1].children = forReviewTasks.value;
      scene.value.children[2].children = doneTasks.value;

      forceRender.value = Date.now();
      loading.tasks = false;
    };

    const getUsers = (items) => {
      const unsortedUsers = [];
      items.forEach((child) => {
        unsortedUsers.push({
          id: child.key,
          ...child.val(),
        });
      });
      users.value = unsortedUsers.sort(sorter);
    };

    const setNewAddedTask = (item) => {
      scene.value.children[0].children.unshift({
        id: item.key,
        order: 0,
        ...item.val(),
      });
    };

    const onCardDrop = (columnId, dropResult) => {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        let sceneCopy = Object.assign({}, scene.value);
        const column = sceneCopy.children.filter((p) => p.id === columnId)[0];
        const columnIndex = sceneCopy.children.indexOf(column);
        const newColumn = Object.assign({}, column);
        newColumn.children = applyDrag(newColumn.children, dropResult);
        scene.value = sceneCopy;

        newColumn.children.map(async (child, index) => {
          await fireTasks.child(child.id).update({
            order: index,
            updated: Date.now(),
            status: columnNames[columnIndex],
          });
          forceRender.value = Date.now();
        });

        // statusChange Activity - cleanup later
        if (cardTracker.dropCounter == 2) {
          const res = tasks.value.find(
            (task) => dropResult.payload.id == task.id
          );

          if (res.status !== cardTracker.sourceColumn) {
            createActivity(
              res.id,
              "statusChange",
              `Moved status to "${res.status}"`
            );
          }
          cardTracker.dropCounter = 0;
        }

        cardTracker.dropCounter += 1;
      }
    };

    const onDragEnd = (columnName, e) => {
      if (e.isSource) {
        cardTracker.sourceColumn = columnName;
      }
    };

    const getCardPayload = (columnId) => {
      return (index) => {
        return scene.value.children.filter((p) => p.id === columnId)[0]
          .children[index];
      };
    };

    const onColumnDrop = () => {};
    const dragStart = () => {};
    const log = (...params) => {
      console.log(...params);
    };

    const viewCard = (card) => {
      cardData.value = card;
      showNewIssueModal.value = true;
    };

    const createCard = () => {
      cardData.value = {};
      showNewIssueModal.value = true;
    };

    const createActivity = async (taskId, activityType, data) => {
      const fireActivity = $fire.database.ref(
        `activities/${taskId}/user-${user.value.id}-date-${Date.now()}`
      );
      try {
        await fireActivity.set({
          id: `user-${user.value.id}-date-${Date.now()}`,
          type: activityType,
          data: data,
          user: user.value.id,
          date: Date.now(),
        });
      } catch (e) {
        console.log(e);
      }
    };

    const getAssigedUser = (userId) => {
      if (users.value) {
        const selected = users.value.find((user) => user.id == userId);

        if (selected) {
          return selected.photo;
        }
      }
    };

    onMounted(async () => {
      loading.tasks = true;
      fireTasks.orderByChild("order").on("value", getTasks);
      fireUsers.orderByChild("order").on("value", getUsers);
    });

    return {
      showNewIssueModal,
      onColumnDrop,
      onCardDrop,
      dragStart,
      applyDrag,
      Container,
      Draggable,
      scene,
      log,
      getCardPayload,
      forceRender,
      viewCard,
      createCard,
      cardData,
      users,
      onDragEnd,
      getAssigedUser,
      loading,
      upperDropPlaceholderOptions: {
        className: "cards-drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
    };
  },
});
</script>

<style>
.draggable-item {
  height: 50px;
  line-height: 50px;
  text-align: center;
  display: block;
  background-color: #fff;
  outline: 0;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: 2px;
  margin-top: 2px;
  cursor: default;
  user-select: none;
}

.draggable-item-horizontal {
  height: 300px;
  padding: 10px;
  line-height: 100px;
  text-align: center;
  /* width : 200px; */
  display: block;
  background-color: #fff;
  outline: 0;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-right: 4px;
  cursor: default;
}

.dragging {
  background-color: yellow;
}

.card-scene {
  /* padding: 2rem; */
  /* background-color: #fff; */
}

.card-container {
  width: 320px;
  padding: 10px;
  margin: 5px;
  margin-right: 45px;
  background-color: #f3f3f3;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
}

.card {
  margin: 5px;
  /* border: 1px solid #ccc; */
  background-color: white;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  padding: 10px;
}

.card-column-header {
  font-size: 18px;
}

.column-drag-handle {
  cursor: move;
  padding: 5px;
}

.card-ghost {
  transition: transform 0.18s ease;
  transform: rotateZ(5deg);
}

.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
}

.opacity-ghost {
  transition: all 0.18s ease;
  opacity: 0.8;
  /* transform: rotateZ(5deg); */
  background-color: cornflowerblue;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
}

.opacity-ghost-drop {
  opacity: 1;
  /* transform: rotateZ(0deg); */
  background-color: white;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0);
}

.form-demo {
  width: 650px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  display: flex;
}

.form {
  flex: 3;
  /* width: 500px; */
  /* background-color: #f3f3f3; */
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 6px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.08), 0px 3px 3px rgba(0, 0, 0, 0.08);
}

.form-fields-panel {
  flex: 1;
  margin-right: 50px;
}

.form-ghost {
  transition: 0.18s ease;
  box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.08);
}

.form-ghost-drop {
  box-shadow: 0 0 2px 5px rgba(0, 0, 0, 0);
}

.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}

.cards-drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px 45px 5px 5px;
}

.smooth-dnd-container {
  position: relative;
  min-height: 130px;
  min-width: 30px;
}
</style>