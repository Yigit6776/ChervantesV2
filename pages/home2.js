"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../src/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home2() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        const snapshot = await getDocs(collection(db, "urunler"));
        const urunListesi = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUrunler(urunListesi);
      } catch (error) {
        console.error("🔥 Firebase Hatası:", error);
      }
      setLoading(false);
    };

    fetchUrunler();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container mt-5 text-black">
        {loading && <p className="text-center">⏳ Yükleniyor...</p>}
        <div className="row">
          {urunler.map((urun) => {
            const kapakFotograf =
              Array.isArray(urun.fotograflar) && urun.fotograflar.length > 0
                ? urun.fotograflar[0]
                : "/placeholder.png";

            return (
              <div
                key={urun.id}
                className="col-md-4 d-flex align-items-stretch mb-4"
              >
                <div className="card shadow-sm w-100 d-flex flex-column justify-content-between">
                  <Link href={`/urun/${urun.id}`} className="text-center p-3">
                    <img
                      src={kapakFotograf}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                      alt={urun.urunAdi}
                      className="img-fluid"
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{urun.urunAdi}</h5>
                      <p className="card-text text-muted" style={{ minHeight: "48px" }}>
                        {urun.aciklama
                          ? urun.aciklama.length > 100
                            ? `${urun.aciklama.substring(0, 100)}...`
                            : urun.aciklama
                          : "Açıklama mevcut değil."}
                      </p>
                    </div>
                    <div className="mt-2">
                      <h6 className="text-success fw-bold">{urun.fiyat} TL</h6>
                      <Link
                        href={`/urun/${urun.id}`}
                        className="btn btn-primary btn-sm mt-2"
                      >
                        Detayları Gör
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🧾 Footer Bilgilendirme Alanı */}
        <footer className="mt-5 py-5 border-top bg-white text-black">
          <div className="container">
            <div className="row text-start text-sm-center small">
              <div className="col-12 col-md-4 mb-3">
                <h6 className="fw-bold">Bilgilendirme</h6>
                <ul className="list-unstyled">
                  <li><Link href="/mesafeli-satis-sozlesmesi" className="text-black text-decoration-none">Mesafeli Satış Sözleşmesi</Link></li>
                  <li><Link href="/kvkk" className="text-black text-decoration-none">Gizlilik Politikası (KVKK)</Link></li>
                  <li><Link href="/iade-iptal" className="text-black text-decoration-none">İade ve İptal</Link></li>
                  <li><Link href="/teslimat-kosullari" className="text-black text-decoration-none">Teslimat Koşulları</Link></li>
                  <li><Link href="/on-bilgilendirme" className="text-black text-decoration-none">Ön Bilgilendirme Formu</Link></li>
                </ul>
              </div>

              <div className="col-12 col-md-4 mb-3">
                <h6 className="fw-bold">Bize Ulaşın</h6>
                <ul className="list-unstyled">
                  <li><Link href="/iletisim" className="text-black text-decoration-none">İletişim</Link></li>
                </ul>
              </div>

              <div className="col-12 col-md-4 mb-3 text-center">
                <h6 className="fw-bold">Chervantes</h6>
                <p className="small mb-0">© 2025 Chervantes.com</p>
                <p className="small">Tüm Hakları Saklıdır.</p>


    


              </div>
            <center>

             <img
  src="/iyzico-logo-pack/iyzico-logo-pack/footer_iyzico_ile_ode/Colored/logo_band_colored@3x.png
"
  alt="d"
  style={{ maxWidth: "400px", marginTop: "10px" }}
/>     
                </center>

            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
