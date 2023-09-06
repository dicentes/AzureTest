import { Counter } from "./components/Counter";
import { Home } from "./components/Home";
import FetchGoals from "./components/FetchGoals"; // Use default import for FetchGoals
import { Login } from "./components/Login"; // Use named import for Login
import Logout from './components/Logout';
import Register from "./components/Register";
import AddGoals from "./components/AddGoals";
import GoalDetail from "./components/GoalDetail";



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
    path: '/login',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: <FetchGoals />
  },
  {
    path: '/logout',
    element: <Logout/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/addgoals',
    element: <AddGoals/>
  },
  {
    path: '/goal/:goalId',  // Dynamic route for goals
    element: <GoalDetail />
  }
];

export default AppRoutes;
