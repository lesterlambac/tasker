
import { useContext, computed, watch, onMounted, ref } from "@nuxtjs/composition-api";
export function useFiles() {

  const { $fire } = useContext();
  const storage = $fire.storage;
  const fireAttachedFiles = ref(<any>[]);
  const fireListFiles = ref();


  const uploadFiles = async (files: any, taskId: String) => {
    for (let file of files) {
      const metadata = {
        contentType: file.type,
        fileName: file.name,
      }
      const fileDestination = storage.ref(`tasks/${taskId}/${file.name}`);
      await fileDestination.put(file, metadata);
    }
  };

  const getFiles = async (taskId: String) => {
    fireAttachedFiles.value = [];
    const files = <any>[];
    const fileDestination = $fire.storage.ref(`tasks/${taskId}`);
    const res = await fileDestination.list();
    fireListFiles.value = res;

    if (res) {
      for (let item of res.items) {
        const data = await Promise.all([item.getMetadata(), item.getDownloadURL()])
        if (data) {
          fireAttachedFiles.value.push({
            metaData: data[0],
            downloadURL: data[1],
          });

          files.push({
            metaData: data[0],
            downloadURL: data[1],
          });
        }
      }

      return files;
    }
  }

  return {
    uploadFiles,
    getFiles,
    fireAttachedFiles,
    fireListFiles,
  };
}