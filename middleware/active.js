import Cookies from "universal-cookie";
import { Middleware } from "@nuxt/types";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";

const auth = async ({ redirect, ssrContext, $fire }) => {
  console.log($fire.auth.currentUser)
  if ($fire.auth.currentUser) {
    redirect("/")
  }

  // const cookies = new Cookies(
  //   ssrContext ? ssrContext.req.headers.cookie : null
  // );

  // const email = cookies.get("email");
  // const password = cookies.get("password");

  // if (!email || !password) {
  //   // return redirect("/login");
  // }

  // const auth = getAuth();

  // const user = await signInWithEmailAndPassword(auth, email, password);
  // if (user.currentUser == email) {
  //   // return redirect("/");
  // }

  // return redirect("/login");

};

export default auth;
