<template>
  <svg
    class="loading inline-block"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="white"
  >
    <path
      opacity="0.4"
      d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM2.25 9C2.25 12.7279 5.27208 15.75 9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9Z"
      :class="`${handle ? handle : 'text-black'} fill-current`"
    />
    <path
      d="M9 18C6.89813 18 4.86254 17.2643 3.24629 15.9206C1.63004 14.5769 0.535076 12.7098 0.151297 10.6433L2.36347 10.2325C2.65131 11.7824 3.47253 13.1827 4.68472 14.1905C5.89691 15.1983 7.42359 15.75 9 15.75V18Z"
      :class="`${circle ? circle : 'text-black'} fill-current`"
    />
  </svg>
</template>
<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: ["circle", "handle"],
  setup() {},
});
</script>


<style scoped>
.loading {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
