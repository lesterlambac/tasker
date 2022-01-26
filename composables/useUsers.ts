import { defineComponent, useContext, useStore, ref } from "@nuxtjs/composition-api";
import { RootState } from "~/store";



export function useUsers() {

  const store = useStore<RootState>();
  const { $fire } = useContext();

  const fireUsers = ref();

  const getUsers = async () => {
    
    fireUsers.value = [];
    const users = $fire.database.ref('users');
    users.on('value', (items) => {
      items.forEach((child) => {

        fireUsers.value.push({
          id: child.key,
          ...child.val(),
        });

      })
    })
  }

  getUsers();

  return {
    fireUsers,
    getUsers,
  }

}