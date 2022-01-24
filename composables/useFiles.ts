
import { useContext, computed, watch, onMounted, } from "@nuxtjs/composition-api";
export function useFiles() {

  const { $fire } = useContext();
  const storage = $fire.storage;


  const uploadFiles = async (files: any, taskId: String) => {
    files.map(async (file: any) => {
      const metadata = {
        contentType: file.type,
        fileName: file.name,
      }
      const fileDestination = storage.ref(`tasks/${taskId}/${file.name}`);
      await fileDestination.put(file, metadata);
    })
  };

  const getFiles = async (taskId: String) => {
    const files = <any>[];
    const fileDestination = $fire.storage.ref(`tasks/${taskId}`);
    if (fileDestination) {
      const res = await fileDestination.listAll()
      res.items.map(async (item) => {

        const metaData = await item.getMetadata();
        const downloadURL = await item.getDownloadURL();

        files.push({
          metaData,
          downloadURL,
        });
      })
    }
    console.log(files)
    return files;
  }

  onMounted(async () => {
    // const fileDestination = $fire.storage.ref('attachments/lester');
    // const res = await fileDestination.listAll()
    // res.items.map(async (item) => {
    //   console.log(await item.getMetadata())
    //   console.log(await item.getDownloadURL())
    // })
  })

  return {
    uploadFiles,
    getFiles,
  };
}