import { XIcon } from "@heroicons/react/outline";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { FakeAPIProvider, useDataListQuery, useRemoveDataMutation } from "./fakeApollo";

export default function App() {
  return (
    <FakeAPIProvider
      initialState={[
        { title: "Hello world", id: uuid() },
        { title: "Some more data", id: uuid() },
      ]}
    >
      <Main />
    </FakeAPIProvider>
  );
}

function Main() {
  const { data, loading } = useDataListQuery();

  const [remove] = useRemoveDataMutation();
  const handleRemove = useCallback(
    (id: string) => {
      remove({ id });
    },
    [remove]
  );

  const handleAdd = useCallback(() => {
    alert("not implemeted");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Data points</h1>
        <ul>
          {data?.map((x) => (
            <li key={x.id} className="flex items-center space-x-2">
              <span>{x.title}</span>
              <button onClick={() => handleRemove(x.id)}>
                <XIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleAdd} className="text-sm underline">
          Add new
        </button>
      </div>
    </div>
  );
}
