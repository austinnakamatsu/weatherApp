import React from 'react'
import ReactDOM from 'react-dom/client'

import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import FetchSearch from './pages/Search'

import './index.css'

const queryClient = new QueryClient()

const router = createHashRouter([
    {
        path: "/",
        element: <FetchSearch />,
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
)