import { useEffect, useState } from 'react';
import { useAppStore } from '../store/app-store';
import type { Config } from '../types';

export function useConfig() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { config, setConfig } = useAppStore();

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const response = await fetch('/config.json');

        if (!response.ok) {
          throw new Error('Failed to load config.json');
        }

        const data: Config = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (!config) {
      loadConfig();
    } else {
      setLoading(false);
    }
  }, [config, setConfig]);

  return { config, loading, error };
}
