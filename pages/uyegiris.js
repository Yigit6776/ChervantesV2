'use client';

import React, { useState } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Navbar from "@/components/Navbar";

export default function Register() {
  // /public içine koyduğun görselin yolu
  const backgroundUrl = "\ChatGPT Image 1 Eki 2025 06_45_56.png";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await addDoc(collection(db, "forum"), {
        uid: user.uid,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        timestamp: serverTimestamp(),
      });

      alert("Kayıt başarıyla tamamlandı!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        birthDate: "",
        gender: "",
      });
    } catch (err) {
      alert("Kayıt hatası: " + err.message);
    }
  };

  return (
    <>
      <Navbar />

      {/* Tam ekran sabit arka plan */}
      <div
        className="page-bg"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
        aria-hidden
      />
      {/* Karartma */}
      <div className="page-overlay" aria-hidden />

      <main className="register-page d-flex justify-content-center align-items-start">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div
            className="card p-4 shadow-lg"
            style={{
              width: 380,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "saturate(120%) blur(2px)",
            }}
          >
            <h4 className="text-center mb-3">Üye Kayıt</h4>

            <form onSubmit={handleSubmit}>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ad"
                required
                className="form-control mb-2"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Soyad"
                required
                className="form-control mb-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-posta"
                required
                className="form-control mb-2"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Şifre"
                required
                className="form-control mb-2"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Telefon"
                required
                className="form-control mb-2"
              />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="form-control mb-2"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="form-select mb-2"
              >
                <option value="">Cinsiyet seç</option>
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
                <option value="Diğer">Diğer</option>
              </select>

              <button type="submit" className="btn btn-primary w-100">
                Kayıt Ol
              </button>
            </form>

            <Link href="/login" className="btn btn-secondary w-100 mt-2">
              Zaten üyeyim, giriş yap
            </Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        /* Sayfa kenar boşluklarını sıfırla */
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
        }

        header, nav, .navbar {
          margin: 0 !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        .page-bg {
          position: fixed;
          inset: 0;
          z-index: -2;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-attachment: fixed;
        }

        .page-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35));
          pointer-events: none;
        }

        .register-page {
          min-height: 100vh;
          margin-top: 0;
          padding-top: 0;
          background: transparent;
        }

        @supports (-webkit-touch-callout: none) {
          .page-bg { background-attachment: scroll; }
        }
      `}</style>
    </>
  );
}
