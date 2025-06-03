import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import LanguageSelector from './components/LanguajeSelector'
import ErrorBoundary from './ErrorBoundary'

// ⏳ Carga diferida de las páginas
const Login = lazy(() => import('./pages/Login'))
const Home = lazy(() => import('./pages/Home'))
const Players = lazy(() => import('./pages/Players'))
const Matches = lazy(() => import('./pages/Matches'))
const NewPlayer = lazy(() => import('./pages/NewPlayer'))
const NewMatch = lazy(() => import('./pages/NewMatch'))
const BrokenComponent = lazy(() => import('./components/BrokenComponent'))

function App() {
  return (
    <ErrorBoundary>
      <div style={{ padding: 20 }}>
        <LanguageSelector />
        <Suspense fallback={<p>Cargando...</p>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/players" element={<PrivateRoute><Players /></PrivateRoute>} />
            <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
            <Route path="/players/new" element={<PrivateRoute><NewPlayer /></PrivateRoute>} />
            <Route path="/matches/new" element={<PrivateRoute><NewMatch /></PrivateRoute>} />
            <Route path="/prueba-error" element={<BrokenComponent />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
