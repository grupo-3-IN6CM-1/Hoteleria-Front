import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard/Dashboard';

const routes = [
    {path: '/', element: <Auth />},
    {path: '/dashboard', element: <Dashboard/>}
]

export default routes