import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

type Data = {
  title: string;
  id: string;
};

const FakeAPIContext = createContext<[Data[], Dispatch<SetStateAction<Data[]>>]>(
  [] as unknown as [Data[], Dispatch<SetStateAction<Data[]>>]
);

export const FakeAPIProvider = (props: React.PropsWithChildren<{
  initialState: Data[];
}>) => {
  const state = useState(props.initialState);
  return <FakeAPIContext.Provider value={state}>{props.children}</FakeAPIContext.Provider>;
};

function getRandomDelay(min: number, max: number) {
  return min + Math.random() * (max - min)
}

const useFakeLoading = (initialValue?: boolean) => {
  const [loading, setLoading] = useState(initialValue ?? false);
  const load = useCallback(async () => {
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), getRandomDelay(100, 1000)));
    setLoading(false);
  }, []);
  return { load, loading };
};

export const useDataListQuery = () => {
  const [data] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading(true);
  useEffect(() => {
    load();
  }, [load]);
  return { data: loading ? null : data, loading };
};

export const useDataQuery = (id: string | undefined) => {
  const [list] = useContext(FakeAPIContext);
  const data = useMemo(() => {
    return list.find((x) => x.id === id);
  }, [list, id]);

  const { load, loading } = useFakeLoading(true);
  useEffect(() => {
    load();
  }, [load]);
  return { data: loading ? null : data, loading };
};

export function useCreateDataMutation(): [
  (props: { data: Omit<Data, "id"> }) => Promise<Data>,
  { loading: boolean },
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    useCallback(
      async ({ data }) => {
        return load().then(() => {
          const newItem = { ...data, id: uuid() };
          setData((prev) => [...prev, newItem]);
          return newItem;
        });
      },
      [load, setData],
    ),
    { loading },
  ];
}

export function useRemoveDataMutation(): [
  (props: { id: string }) => Promise<void>,
  { loading: boolean }
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    useCallback(
      async ({ id }) => {
        return load().then(() => {
          setData((prev) => prev.filter((x) => x.id !== id));
        });
      },
      [load, setData],
    ),
    { loading },
  ];
}

export function useUpdateDataMutation(): [
  (props: { data: Data; id: string }) => Promise<void>,
  { loading: boolean }
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    useCallback(
      async ({ data, id }) => {
        return load().then(() => {
          setData((prev) =>
            prev.map((x) => (x.id === id ? { ...x, ...data } : x)),
          );
        });
      },
      [load, setData],
    ),
    { loading },
  ];
}
