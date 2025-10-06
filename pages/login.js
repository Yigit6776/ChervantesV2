'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebaseConfig';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const router = useRouter();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert('Giriş başarılı!');
      router.push('/');
    } catch (error) {
      console.error(error);
      setErr(error?.message || 'Giriş hatası');
    }
  };

  return (
    <>
      <Navbar />

      {/* ✅ Arka plan fotoğrafı */}
      <div className="page-bg" />

      <main className="d-flex justify-content-center align-items-start pt-nav">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <form
            className="card p-4 shadow"
            onSubmit={handleSubmit}
            style={{ width: 380, background: 'rgba(255,255,255,0.9)' }}
          >
            <h4 className="text-center mb-3">Giriş Yap</h4>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta"
              className="form-control mb-2"
              autoComplete="email"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifre"
              className="form-control mb-2"
              autoComplete="current-password"
              required
            />

            <div className="text-end mb-3">
              <Link
                href="/sifremi-unuttum"
                className="text-primary"
                style={{ fontSize: '0.9rem' }}
              >
                Şifremi Unuttum?
              </Link>
            </div>

            {err && <div className="alert alert-danger py-2">{err}</div>}

            <button type="submit" className="btn btn-primary w-100">
              Giriş Yap
            </button>

            <div className="text-center mt-3">
              <span className="me-2">Hesabın yok mu?</span>
              <Link href="/uyegiris">Üye Ol</Link>
            </div>
          </form>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --nav-h: 74px;
        }

        .pt-nav {
          padding-top: var(--nav-h);
        }

        .page-bg {
          position: fixed;
          inset: 0 ;
          z-index: 0;
          background: url('ChatGPT Image 1 Eki 2025 12_13_11.png') no-repeat center center;
          background-size: cover;
          background-attachment: fixed;
        }

        /* Koyu filtre istersen */
        .page-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
        }

        @supports (-webkit-touch-callout: none) {
          .page-bg {
            background-attachment: scroll;
          }
        }
      `}</style>
    </>
  );
}
