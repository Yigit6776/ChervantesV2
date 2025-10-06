'use client';

import React from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../src/firebaseConfig";
import { useRouter } from "next/router";
import Navbar from "../src/components/Navbar";

export default function Profil() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const displayName = currentUser
    ? currentUser.displayName || currentUser.email?.split("@")[0]
    : "Profil";

  const email = currentUser?.email ?? "-";
  const uid   = currentUser?.uid   ?? "-";

  const initials = (displayName || "K")
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/uyegiris");
    } catch (error) {
      alert("Çıkış yaparken hata oluştu: " + error.message);
    }
  };

  return (
    <>
      <Navbar />

      {/* sayfa arka planı + ince koyu overlay */}
      <div className="profil-page">
        <div className="profil-overlay" />

        {/* ortalanmış kart */}
        <div className="profil-wrap">
          <div className="profil-card">
            <div className="profil-head">
              <div className="profil-avatar"><span>{initials}</span></div>
              <div className="profil-title">
                <h1 className="profil-name">{displayName}</h1>
                <div className="profil-mail">{email}</div>
              </div>
            </div>

            <div className="profil-info">
              <div className="info-row">
                <span className="info-label">E-posta</span>
                <span className="info-value">{email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Kullanıcı ID</span>
                <span className="info-value text-break">{uid}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-danger w-100">🚪 Çıkış Yap</button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root { --nav-h: 74px; }

        /* 🔧 Bu sayfada Navbar'ın global body padding'ini sıfırla */
        body { padding-top: 0 !important; }
        html { scroll-padding-top: 0 !important; }

        /* tam ekran arka plan */
        .profil-page{
          min-height: 100vh;
          background: url("ChatGPT Image 1 Eki 2025 12_13_11.png") center/cover no-repeat fixed;
          position: relative;
        }
        .profil-overlay{
          position: fixed;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.45));
          pointer-events: none;
          z-index: 0;
        }

        /* içerik: navbar yüksekliği kadar aşağıdan başlasın */
        .profil-wrap{
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: calc(var(--nav-h) + 24px) 16px 24px; /* üstte navbar payı */
          box-sizing: border-box;
        }

        /* kare hissi veren kart */
        .profil-card{
          width: 100%;
          max-width: 440px;
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 22px;
          border-radius: 18px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(10px) saturate(130%);
          box-shadow: 0 20px 40px rgba(0,0,0,.35);
          color: #fff;
        }

        .profil-head{
          display: flex;
          gap: 14px;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,.15);
          padding-bottom: 12px;
        }
        .profil-avatar{
          width: 64px; height: 64px;
          border-radius: 14px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.3);
          display: grid; place-items: center;
          font-weight: 800; font-size: 24px; color: #fff;
          letter-spacing: .5px;
        }
        .profil-title{ line-height: 1.2; }
        .profil-name{ font-size: 22px; margin: 0; font-weight: 800; }
        .profil-mail{ font-size: 13px; opacity: .9; }

        .profil-info{
          display: grid;
          gap: 10px;
          margin-top: 4px;
          flex: 1;
        }
        .info-row{
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 10px;
          align-items: center;
          background: rgba(0,0,0,.18);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px;
          padding: 10px 12px;
        }
        .info-label{ font-size: 12px; opacity: .85; }
        .info-value{ font-size: 14px; font-weight: 600; }

        .btn-danger{
          border-radius: 12px;
          padding-block: 10px;
          font-weight: 700;
          letter-spacing: .2px;
          box-shadow: 0 6px 16px rgba(220,53,69,.35);
        }

        @media (max-width: 420px){
          .profil-card{ aspect-ratio: auto; }
        }
      `}</style>
    </>
  );
}
