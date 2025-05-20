import { Navigate } from 'react-router-dom'
import { Auth } from './pages/auth'
import {DashboardLayout}    from './pages/dashboard/'
import {HotelsPage}         from './pages/hotels'
import {RoomsPage}          from './pages/rooms'
import {ReservationsPage}   from './pages/reservations'

const routes = [
  { path: '/',                     element: <Navigate to="/auth" replace /> },
  { path: '/auth',                 element: <Auth /> },
  { path: '/dashboard',            element: <DashboardLayout /> },
  { path: '/dashboard/hotels',     element: <HotelsPage /> },
  { path: '/dashboard/rooms',      element: <RoomsPage /> },
  { path: '/dashboard/reservations', element: <ReservationsPage /> },
  { path: '*',                     element: <Navigate to="/Auth" replace /> }
]

export default routes
