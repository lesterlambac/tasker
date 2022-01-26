import { defineComponent, useContext } from "@nuxtjs/composition-api";

export function useUsers() {
  const { $fire } = useContext();

  const getUsers = () => {

    const fireUsers = <any>[];
    const users = $fire.database.ref('users');

    users.on('value', (items) => {
      items.forEach((child) => {

        fireUsers.push({
          id: child.key,
          ...child.val(),
        });

      })
    })

    return fireUsers;
  }

  return {
    getUsers,
  }

}