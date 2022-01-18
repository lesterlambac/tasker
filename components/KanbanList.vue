<template>
  <div class="flex-1 overflow-auto card-scene">
    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".column-drag-handle"
      @drag-start="dragStart"
      :drop-placeholder="upperDropPlaceholderOptions"
      class="p-3 h-full inline-flex overflow-hidden"
    >
      <Draggable v-for="column in scene.children" :key="column.id">
        <div
          class="mr-3 flex-shrink-0 flex flex-col w-80 bg-gray-100 rounded-md h-full"
        >
          <h3
            class="flex-shrink-0 pt-3 pb-1 px-3 text-sm font-medium text-gray-700"
          >
            {{ column.name }}
          </h3>
          <div class="flex-1 min-h-0 overflow-y-auto">
            <div class="pt-1 pb-3 px-3 block">
              <Container
                group-name="col"
                @drop="(e) => onCardDrop(column.id, e)"
                @drag-start="(e) => log('drag start', e)"
                @drag-end="(e) => log('drag end', e)"
                :get-child-payload="getCardPayload(column.id)"
                drag-class="card-ghost"
                drop-class="card-ghost-drop"
                :drop-placeholder="dropPlaceholderOptions"
                class="space-y-4 transfer-above-elements-here...."
              >
                <Draggable v-for="card in column.children" :key="card.id">
                  <div>
                    <div class="p-5 bg-white rounded-md shadow cursor-pointer">
                      <div class="flex justify-between">
                        <p
                          class="text-sm font-medium leading-snug text-gray-900"
                        >
                          Provide documentation on integrations
                        </p>
                        <span>
                          <img
                            alt=""
                            class="h-6 w-6 rounded-full"
                            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80"
                          />
                        </span>
                      </div>
                      <div class="mt-2 flex justify-between items-baseline">
                        <div class="text-sm text-gray-600">
                          <time datetime="2019-09-14">Sep {{ card.id }}</time>
                        </div>
                        <div></div>
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
  </div>
</template>


<script>
import { Container, Draggable } from "vue-smooth-dnd";

import { defineComponent, nextTick, ref } from "@nuxtjs/composition-api";
import { applyDrag, generateItems } from "../utils/helpers.js";

export default defineComponent({
  components: { Container, Draggable },
  setup() {
    const columnNames = ["Pending", "For Review", "Done", "Backlogs"];

    const scene = ref({
      type: "container",
      props: {
        orientation: "horizontal",
      },
      children: generateItems(4, (i) => ({
        id: `column${i}`,
        type: "container",
        name: columnNames[i],
        props: {
          orientation: "vertical",
          className: "card-container",
        },
        children: generateItems(5, (j) => ({
          type: "draggable",
          id: `${i}${j}`,
          props: {
            className: "card",
          },
          data: "",
        })),
      })),
    });

    const onCardDrop = (columnId, dropResult) => {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        let sceneCopy = Object.assign({}, scene.value);
        const column = sceneCopy.children.filter((p) => p.id === columnId)[0];
        const columnIndex = sceneCopy.children.indexOf(column);
        const newColumn = Object.assign({}, column);
        newColumn.children = applyDrag(newColumn.children, dropResult);
        sceneCopy.children.splice(columnIndex, 1, newColumn);
        scene.value = sceneCopy;
      }
    };

    const getCardPayload = (columnId) => {
      return (index) => {
        return scene.value.children.filter((p) => p.id === columnId)[0]
          .children[index];
      };
    };

    const onColumnDrop = (dropResult) => {
      console.log(dropResult);
    };

    const dragStart = () => {
      console.log("drag started");
    };

    const log = (...params) => {
      console.log(...params);
    };

    return {
      onColumnDrop,
      onCardDrop,
      dragStart,
      applyDrag,
      Container,
      Draggable,
      scene,
      log,
      getCardPayload,
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
    border: 1px solid rgba(0, 0, 0, .125);
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
    border: 1px solid rgba(0, 0, 0, .125);
    margin-right: 4px;
    cursor: default;
}

.dragging {
    background-color: yellow;
}

.card-scene {
    padding: 50px;
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
    transform: rotateZ(5deg)
}

.card-ghost-drop {
    transition: transform 0.18s ease-in-out;
    transform: rotateZ(0deg)
}

.opacity-ghost {
    transition: all .18s ease;
    opacity: 0.8;
    /* transform: rotateZ(5deg); */
    background-color: cornflowerblue;
    box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
}

.opacity-ghost-drop {
    opacity: 1;
    /* transform: rotateZ(0deg); */
    background-color: white;
    box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.0);
}


.form-demo {
    width: 650px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    display: flex
}

.form {
    flex: 3;
    /* width: 500px; */
    /* background-color: #f3f3f3; */
    border: 1px solid rgba(0, 0, 0, .125);
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
    box-shadow: 0 0 2px 5px rgba(0, 0, 0, 0.0);
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
</style>