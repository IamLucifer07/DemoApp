import { ref, computed } from 'vue';
import axios from 'axios';

interface TableItem {
  id: number;
  [key: string]: any;
}

interface ApiConfig {
  url: string;
  title: string;
  columns?: string[];
}

export const useApiData = (config: ApiConfig) => {
  const items = ref<TableItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const headers = computed(() => {
    if (config.columns) {
      return config.columns;
    }
    if (items.value.length > 0) {
      return Object.keys(items.value[0]);
    }
    return [];
  });

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get(config.url);
      
      if (response.data && response.data.length > 0) {
        items.value = response.data;
      }
    } catch (err) {
      error.value = 'Failed to fetch data: ' + (err as Error).message;
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    headers,
    loading,
    error,
    fetchData
  };
};