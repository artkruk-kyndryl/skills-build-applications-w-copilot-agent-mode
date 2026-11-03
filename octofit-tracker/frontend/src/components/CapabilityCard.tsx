import { useEffect, useState, type ReactNode } from 'react';
import { getJson } from '../api/client.js';

type Props = { title: string; description: string };

type ApiResourceProps<T> = Props & {
  path: string;
  emptyMessage: string;
  isEmpty: (data: T) => boolean;
  children: (data: T) => ReactNode;
};

export function CapabilityCard<T>({ title, description, path, emptyMessage, isEmpty, children }: ApiResourceProps<T>) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);
    getJson<T>(path)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unknown request error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path]);

  return <section className="card h-100"><div className="card-body">
    <h2 className="h4">{title}</h2>
    <p>{description}</p>
    {loading && <p role="status">Loading {title.toLowerCase()}...</p>}
    {!loading && error && <p role="alert">Unable to load {title.toLowerCase()}: {error}</p>}
    {!loading && !error && data !== undefined && isEmpty(data) && <p>{emptyMessage}</p>}
    {!loading && !error && data !== undefined && !isEmpty(data) && children(data)}
  </div></section>;
}
