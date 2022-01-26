import { GetterTree, ActionTree, MutationTree } from "vuex";
import { useUsers } from "~/composables/useUsers";

export const state = () => ({
  fireUser: null,
  user: null,
  users: [],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  getUser(state: any) {
    if (!state.fireUser) return null;
    return state.users.find(
      (item: any) => item.id === state.fireUser
    );
  },
};

export const mutations: MutationTree<RootState> = {
  setFireUser(state, fireUser: any) {
    state.fireUser = fireUser;
  },
  setUser(state: any, user: any) {
    state.user = user;
  },
  setUsers(state: any, users: any[]) {
    state.users = users;
  },
};

export const actions: ActionTree<RootState, RootState> = {
  fireLoadUsers({ commit, state }) {
    const { getUsers } = useUsers();
    commit('setUsers', getUsers());
  }
};
