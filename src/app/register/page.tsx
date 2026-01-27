'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../services/api';
import Link from 'next/link';

export default function RegisterPage(): React.ReactElement {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        full_name: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authApi.register(
                formData.email,
                formData.username,
                formData.password,
                formData.full_name
            );
            // Redirigir al login tras registro exitoso
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <h1>Crear Cuenta</h1>
                    <p>Registro de Operador SCADA</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="full_name">Nombre Completo</label>
                        <input
                            id="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Usuario (ID)</label>
                        <input
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="jdoe"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@scada.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300">
                            Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
        /* Reutilizando estilos del login */
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 48px 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .login-header { text-align: center; margin-bottom: 30px; }
        .logo-icon {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
          border-radius: 16px; margin-bottom: 16px; color: white;
        }
        .login-header h1 { color: white; font-size: 24px; margin: 0 0 4px 0; }
        .login-header p { color: rgba(255,255,255,0.6); font-size: 14px; margin: 0; }
        .login-form { display: flex; flex-direction: column; gap: 20px; }
        .error-message {
          padding: 12px; background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px;
          color: #fca5a5; font-size: 14px;
        }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group label { color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 500; }
        .input-group input {
          padding: 12px 14px; background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          color: white; outline: none; transition: all 0.2s;
        }
        .input-group input:focus {
            border-color: #00d4ff; background: rgba(255,255,255,0.12);
        }
        .login-button {
          margin-top: 10px; padding: 14px;
          background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
          border: none; border-radius: 10px; color: white; font-weight: 600;
          cursor: pointer; transition: transform 0.2s;
        }
        .login-button:hover { transform: translateY(-2px); }
        .login-footer { margin-top: 24px; text-align: center; }
        .login-footer p { color: rgba(255,255,255,0.4); font-size: 13px; }
      `}</style>
        </div>
    );
}
