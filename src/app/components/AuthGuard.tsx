'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuth, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);

      if (!token) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      const isValid = await checkAuth();

      if (!isValid) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }

      setIsChecking(false);
    };

    verifyAuth();
  }, [token, checkAuth, router, pathname]);

  if (isChecking) {
    return (
      <div className="auth-loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Verificando sesión...</p>
        </div>

        <style jsx>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          }

          .loading-content {
            text-align: center;
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: #00d4ff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="auth-loading">
        <div className="loading-content">
          <p>Redirigiendo al login...</p>
        </div>

        <style jsx>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          }

          .loading-content {
            text-align: center;
          }

          p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }
  return <>{children}</>;
}
