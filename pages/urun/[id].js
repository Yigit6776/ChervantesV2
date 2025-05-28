// pages/urunDetay.js
'use client';
// pages/urun/[[id]].js (veya urunDetay.js)

import Link from 'next/link'; // <<-- Bu satırı dosyanın en üstüne ekleyin

// ... diğer kodlar ...
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../src/firebaseConfig"; // Firebase config yolunu kontrol edin
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { useSepet } from "../../context/SepetContext"; // SepetContext yolunu kendi projenizin yapısına göre kontrol edin
// "next/image" bileşeni kaldırıldığı için artık import edilmesine gerek yok.
// FaChevronLeft ve FaChevronRight artık Bootstrap Carousel içinde kullanılmayacak
// Bootstrap Icons kullanacağız

const UrunDetay = () => {
  const router = useRouter();
  const { id } = router.query;
  const [urun, setUrun] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sepeteEkle } = useSepet();

  useEffect(() => {
    if (!id) return;

    const fetchUrun = async () => {
      try {
        const urunRef = doc(db, "urunler", id);
        const urunSnap = await getDoc(urunRef);
        if (urunSnap.exists()) {
          const data = urunSnap.data();
          setUrun({ id: urunSnap.id, ...data });
        } else {
          console.error("🔥 Ürün bulunamadı!");
        }
      } catch (error) {
        console.error("🔥 Firestore Hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUrun();
  }, [id]);

  const handleSepeteEkle = () => {
    if (urun) {
      sepeteEkle(urun);
      alert("✅ Ürün sepete eklendi!");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mt-3 text-muted">Ürün yükleniyor...</p>
          </div>
        ) : urun ? (
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <div className="row g-4">

              {/* Ürün Görseli - Bootstrap Carousel (şimdi <img> ile) */}
              <div className="col-lg-6">
                {urun.fotograflar && urun.fotograflar.length > 0 ? (
                  <div id="urunCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                    {/* Carousel Göstergeleri (noktalar) */}
                    {urun.fotograflar.length > 1 && (
                      <div className="carousel-indicators">
                        {urun.fotograflar.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            data-bs-target="#urunCarousel"
                            data-bs-slide-to={idx}
                            className={idx === 0 ? "active" : ""}
                            aria-current={idx === 0 ? "true" : ""}
                            aria-label={`Slide ${idx + 1}`}
                          ></button>
                        ))}
                      </div>
                    )}
                    <div className="carousel-inner rounded-3 shadow-sm">
                      {urun.fotograflar.map((foto, idx) => (
                        <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`} style={{ height: '500px' }}>
                          <img
                            src={foto}
                            className="d-block w-100 h-100 object-fit-contain img-fluid" // img-fluid eklendi
                            alt={urun.urunAdi || `Ürün Görseli ${idx + 1}`}
                            style={{ objectFit: 'contain' }} // CSS object-fit kullanıldı
                          />
                        </div>
                      ))}
                    </div>
                    {urun.fotograflar.length > 1 && (
                      <>
                        {/* Önceki Buton */}
                        <button className="carousel-control-prev" type="button" data-bs-target="#urunCarousel" data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        {/* Sonraki Buton */}
                        <button className="carousel-control-next" type="button" data-bs-target="#urunCarousel" data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="d-flex justify-content-center align-items-center bg-light rounded-3" style={{ height: '500px' }}>
                    <p className="text-muted">Görsel bulunamadı.</p>
                  </div>
                )}
              </div>

              {/* Ürün Bilgileri */}
              <div className="col-lg-6 d-flex flex-column justify-content-between">
                <div>
                  <h1 className="display-5 fw-bold text-primary mb-3">{urun.urunAdi}</h1>
                  <hr className="my-4" />

                  <h4 className="mb-3 text-secondary">Ürün Açıklaması:</h4>
                  <div className="text-muted lh-base mb-4">
                    {urun?.aciklama && typeof urun.aciklama === "string" ? (
                      urun.aciklama.split("\n").map((satir, index) => (
                        <p key={index} className="mb-2">
                          <i className="bi bi-arrow-right-circle-fill text-success me-2"></i>
                          {satir}
                        </p>
                      ))
                    ) : (
                      <p>Bu ürün hakkında açıklama bulunmamaktadır.</p>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <h2 className="display-4 fw-bold text-success mb-4">₺{Number(urun.fiyat).toFixed(2)}</h2>
                  <button
                    className="btn btn-primary btn-lg w-100 py-3 rounded-pill shadow-sm"
                    onClick={handleSepeteEkle}
                  >
                    <i className="bi bi-cart-plus-fill me-2"></i> Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-danger text-center py-5" role="alert">
            <h4 className="alert-heading">⚠️ Ürün bulunamadı!</h4>
            <p>Aradığınız ürün mevcut değil veya silinmiş olabilir.</p>
            <hr />
        <p className="mb-0">Ana sayfaya dönmek için <Link href="/home2" className="alert-link">buraya tıklayın</Link>.</p>

          </div>
        )}
      </div>
    </>
  );
};

export default UrunDetay;