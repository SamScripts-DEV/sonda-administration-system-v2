"use client";

import './globals.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';

const queryClient = new QueryClient();



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gray-100 font-sans }`}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Toaster />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
