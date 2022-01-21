import Cookies from "universal-cookie";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = async ({ redirect, ssrContext, $fire }) => {
  try {
    const cookies = new Cookies(
      ssrContext ? ssrContext.req.headers.cookie : null
    );

    const email = cookies.get("email");
    const password = cookies.get("password");

    if (!email || !password) {
      return redirect("/login");
    }

    const user = await $fire.auth.signInWithEmailAndPassword(email, password);

    if (user.user.email !== email) {
      return redirect("/login");
    }

  } catch (e) {
    console.log(e)
    return redirect("/login");
  }

};

export default auth;
