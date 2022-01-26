import Cookies from "universal-cookie";

const auth = async ({ redirect, ssrContext, $fire, store, }) => {
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

    store.commit('setFireUser', user.user.uid);

  } catch (e) {
    console.log(e)
    return redirect("/login");
  }

};

export default auth;
