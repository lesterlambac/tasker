import Cookies from "universal-cookie";
import { Middleware } from "@nuxt/types";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import vueCompositionApi from "@vue/composition-api";

const auth = async ({ redirect, ssrContext, $fire }) => {
  try {
    const cookies = new Cookies(
      ssrContext ? ssrContext.req.headers.cookie : null
    );

    const email = cookies.get("email");
    const password = cookies.get("password");

    console.log(email);
    console.log(password);

    if (!email || !password) {
      return redirect("/login");
    }

    const auth = getAuth();
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user)
    if (user.currentUser == email) {
      return redirect("/");
    }



  } catch (e) {
    console.log(e)
    return redirect("/login");
  }



};

export default auth;
