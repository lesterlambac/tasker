<template>
  <div class="bg-gray-50">
    <Nuxt /> 
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  middleware : []
})
</script>
<style>

.toasted-container.top-right-custom {
    top: 5%;
    right: 3%;
}
</style>
