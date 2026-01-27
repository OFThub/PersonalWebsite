'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';

export type SiteData = {
  name: string;
  title: string;
  description: string;
  email?: string;
  github?: string;
  linkedin?: string;
};

type SiteContextType = {
  siteData: SiteData | null;
  loading: boolean;
  error: string | null;
  saveSiteData: (data: SiteData) => Promise<void>;
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await fetch('/api/site');

        if (!res.ok) {
          throw new Error('Site bilgileri alınamadı');
        }

        const data = await res.json();
        setSiteData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, []);

  // 🔹 DB'ye yaz (update)
  const saveSiteData = async (data: SiteData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error('Kaydetme başarısız');
      }

      const updated = await res.json();
      setSiteData(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteContext.Provider
      value={{ siteData, loading, error, saveSiteData }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return ctx;
};
