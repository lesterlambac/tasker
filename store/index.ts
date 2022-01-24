import { GetterTree, ActionTree, MutationTree } from "vuex";

export const state = () => ({
  user: null,
  organizations: [],
  addresses: [],
  currentOrganizationId: null
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  currentOrganization(state: any) {
    return state.organizations.find(
      (org: any) => org._id === state.currentOrganizationId
    );
  },
  withdrawAddresses(state: any) {
    return state.addresses;
  },
  currentWithdrawAddress(state: any) {
    return state.addresses.length > 0 ? state.addresses[0] : null;
  },
  primaryWithdrawAddress(state: any) {
    return state.addresses.length > 0 ? state.addresses.find((address: any) => address.isPrimary) : null;
  },
  currentUserAddress(state: any) {
    return state.user.publicAddress;
  },
  isInstantLinkReady(state: any, getters) {
    const org = getters.currentOrganization;
    if (!org) return false;
    const { username, preferredNetworks, preferredTokenSymbols, publicAddress } = org;
    if (!username || !preferredNetworks.length || !preferredTokenSymbols.length || !publicAddress) {
      return false;
    }
    return true;
  }
};

export const mutations: MutationTree<RootState> = {
  setUser(state: any, user: any) {
    state.user = user;
  },
  setOrganizations(state: any, organizations: any[]) {
    state.organizations = organizations;
    if (state.currentOrganizationId === null && organizations.length > 0) {
      state.currentOrganizationId = organizations[0]._id;
    }
  },
  setAddresses(state: any, addresses: any[]) {
    state.addresses = addresses;
  },
  setCurrentOrganizationId(state: any, id: any) {
    state.currentOrganizationId = id;
  }
};

export const actions: ActionTree<RootState, RootState> = {};
