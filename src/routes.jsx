import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { HotelsPage } from './pages/hotel/HotelsPage';
import { ReservationsPage } from './pages/reservations/ReservationsPage';

const routes = [
    {path: '/', element: <Auth />},
    {path: '/dashboard', element: <Dashboard/>},
    { path: '/hotels', element: <HotelsPage /> },
    { path: '/reservations', element: <ReservationsPage /> }
]

export default routes