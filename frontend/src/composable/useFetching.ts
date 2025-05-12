import { ref } from 'vue';

export function useFetching<T>(callback: () => Promise<T>) {
  const isLoading = ref<boolean>(false);
  const error = ref<string | undefined>(undefined);

  const fetchData = async () => {
    try {
      isLoading.value = true;
      await callback();
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 300);
    }
  };

  return {
    fetchData, isLoading, error
  };
}
