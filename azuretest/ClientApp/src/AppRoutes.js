import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { FetchFake } from "./components/FetchFake";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/fake',
    element: <FetchFake />
  }
];

export default AppRoutes;
