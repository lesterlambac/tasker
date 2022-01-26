<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm px-8 py-6 mt-4 text-left bg-white shadow-lg">
      <h3 class="text-2xl font-bold text-center">Login to Tasker</h3>
      <form class="space-y-4 lg:space-y-4" @submit.prevent="submit">
        <div>
          <label for="email" class="block mt-6 text-sm font-medium text-black">
            Email
          </label>
          <div class="mt-2">
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              placeholder="your@example.com"
              required
              class="block w-full px-3 py-2 text-sm border border-primary rounded-md shadow-sm appearance-none placeholder-grey-light bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white focus:text-black"
              :class="{ 'ring-1 ring-error bg-[#FDEEEE]': formError }"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-black">
            Password
          </label>
          <div class="mt-2">
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Your Password"
                required
                class="flex-1 block w-full px-3 py-2 text-sm border border-primary rounded-md shadow-sm appearance-none placeholder-grey-light bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white focus:text-black"
                :class="{
                  'ring-1 ring-error bg-[#FDEEEE]': formError,
                }"
              />

              <span
                class="absolute inset-y-0 right-0 px-3 py-2 cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <img
                  v-if="!showPassword"
                  :src="require('~/assets/icons/eye-slash.svg')"
                  alt="Show"
                />
                <img
                  v-else
                  :src="require('~/assets/icons/eye.svg')"
                  alt="Hide"
                />
              </span>
            </div>
          </div>
          <p
            class="flex items-start justify-center mt-2 text-sm text-error"
            v-if="formError"
          >
            <img
              :src="require('~/assets/icons/warning.svg')"
              alt="Warning"
              class="mr-2"
            />
            {{ formError }}
          </p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="redirecting"
            :class="{ 'bg-primary-light hover:bg-primary-light': redirecting }"
            class="flex justify-center w-full px-4 py-2 mt-8 text-sm text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ease-in-out duration-100"
          >
            <span class="flex items-center justify-center" v-if="redirecting">
              <LoadingSpinner class="mr-2" />
              Logging In ...
            </span>
            <span v-else>Log In</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  watch,
} from "@nuxtjs/composition-api";
import Cookies from "universal-cookie";

export default defineComponent({
  layout: "default",
  setup() {
    const form = ref({
      email: "",
      password: "",
    });
    const errors = ref();
    const cookies = new Cookies();
    const { $fire, redirect } = useContext();
    const redirecting = ref(false);
    const formError = ref();
    const showPassword = ref(false);

    const submit = async () => {
      try {
        const user = await $fire.auth.signInWithEmailAndPassword(
          form.value.email,
          form.value.password
        );
        cookies.set("email", form.value.email);
        cookies.set("password", form.value.password);

        redirect("/")

        // $fire.auth.signOut();

        // console.log($fire.auth);
      } catch (error) {
        formError.value = error.message;
        // if (error.response && error.response.status === 422) {
        //   errors.value = error.response.data.errors;
        // }
      }
    };

    watch(
      () => [form.value.email, form.value.password],
      (changes) => {
        formError.value = null;
      }
    );

    return {
      submit,
      form,
      redirecting,
      formError,
      showPassword,
    };
  },
});
</script>

