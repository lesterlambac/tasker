const authHandle = async ({ redirect, ssrContext, $fire, store, route }) => {
  try {
    if (route.params.handle) {
      const user = $fire.database.ref(`users/${route.params.handle}`);
      await user.on('value', (e) => {

        if (e.val()) {
          store.commit('setUser', {
            id: e.key,
            ...e.val(),
          });
          store.commit('setFireUser', e.val().id)
        } else {
          redirect('/')
        }

      })
    }

  } catch (e) {
    console.log(e)
  }

};

export default authHandle;