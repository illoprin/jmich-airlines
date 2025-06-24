import { ref } from 'vue';

export function useFetching<T>(callback: () => Promise<T>) {
  const isLoading = ref<boolean>(false);
  const fetchData = async () => {
    try {
      isLoading.value = true;
      await callback();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    fetchData, isLoading
  };
}
