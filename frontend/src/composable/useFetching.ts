import { ref } from 'vue';


export function useFetching<T>(callback: () => Promise<T>) {
  
  const isLoading = ref<boolean>(false);
  const fetchData = async () => {
    try {
      isLoading.value = true;
      await callback();
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 300);
    }
  };

  return {
    fetchData, isLoading
  };
}
