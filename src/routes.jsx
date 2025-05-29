import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { HotelsPage } from './pages/hotel/HotelsPage';
import { ReservationsPage } from './pages/reservations/ReservationsPage';
import { RoomsPage } from './pages/room/RoomsPage'
import { GuestsPage } from './pages/guest/GuestsPage'
import { ReportsPage } from './pages/reports/ReportsPage';

const routes = [
    {path: '/', element: <Auth />},
    {path: '/dashboard', element: <Dashboard/>},
    { path: '/hotels', element: <HotelsPage /> },
    { path: '/reservations', element: <ReservationsPage /> },
    { path: '/rooms', element: <RoomsPage /> },
    { path: '/guests', element: <GuestsPage /> },
    { path: '/reports', element: <ReportsPage /> },
]

export default routes