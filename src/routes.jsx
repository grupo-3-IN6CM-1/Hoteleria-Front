import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { HotelsPage } from './pages/hotel/HotelsPage';
import { ReservationsPage } from './pages/reservations/ReservationsPage';
import { RoomsPage } from './pages/room/RoomsPage'
import { GuestsPage } from './pages/guest/GuestsPage'
import { ReportsPage } from './pages/reports/ReportsPage';
import { EventPage } from './pages/events/EventPage';

const routes = [
    {path: '/', element: <Auth />},
    {path: '/dashboard', element: <Dashboard/>},
    { path: '/hotels', element: <HotelsPage /> },
    { path: '/reservations', element: <ReservationsPage /> },
    { path: '/rooms', element: <RoomsPage /> },
    { path: '/guests', element: <GuestsPage /> },
    { path: '/reports', element: <ReportsPage /> },
    { path: '/events', element: <EventPage/> },
]

export default routes