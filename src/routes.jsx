import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { HotelsPage } from './pages/hotel/HotelsPage';

const routes = [
    {path: '/', element: <Auth />},
    {path: '/dashboard', element: <Dashboard/>},
    { path: '/hotels', element: <HotelsPage /> }
]

export default routes