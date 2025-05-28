// pages/home2.js
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../src/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS importu

export default function Home2() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Hata durumu için state

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        const snapshot = await getDocs(collection(db, "urunler"));
        const urunListesi = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUrunler(urunListesi);
      } catch (err) {
        console.error("🔥 Firebase Hatası:", err);
        setError("Ürünler yüklenirken bir sorun oluştu."); // Hata mesajını ayarla
      } finally {
        setLoading(false);
      }
    };

    fetchUrunler();
  }, []);

  return (
    <>
      <Navbar />

      {/* Sayfa Üstü Banner / Tanıtım Alanı */}
      <section className="bg-gradient-primary-to-secondary py-5 text-white shadow-sm hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">
                Chervantese Hoş Geldiniz!
              </h1>
              <p className="lead animate__animated animate__fadeInUp animate__delay-1s">
                En kaliteli ürünleri en uygun fiyatlarla keşfedin. Geniş ürün yelpazemizle beklentilerinizi aşın.
              </p>
              <Link href="/urunler" className="btn btn-light btn-lg rounded-pill shadow-lg mt-3 animate__animated animate__zoomIn animate__delay-2s">
                <i className="bi bi-shop me-2"></i> Şimdi Alışverişe Başla
              </Link>
            </div>
            <div className="col-lg-5 d-flex justify-content-center animate__animated animate__fadeInRight animate__delay-1s">
              {/* Buraya mağazanızı veya ürünleri temsil eden şık bir görsel eklenebilir */}
              {/* Örneğin: <img src="/hero-image.png" alt="Alışveriş Keyfi" className="img-fluid rounded-4 shadow-lg" style={{ maxWidth: '400px' }} /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Ürün Listeleme Alanı */}
      <div className="container my-5">
        <h2 className="text-center mb-5 fw-bold text-dark section-title animate__animated animate__fadeIn">
          Öne Çıkan Ürünler
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mt-3 text-muted">Ürünler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center py-5 rounded-3 shadow-sm" role="alert">
            <h4 className="alert-heading">⚠️ Hata Oluştu!</h4>
            <p>{error}</p>
            <p className="mb-0">Lütfen internet bağlantınızı kontrol edin veya sayfayı yenileyin.</p>
          </div>
        ) : urunler.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 product-grid"> {/* Responsive grid */}
            {urunler.map((urun) => {
              const kapakFotograf =
                Array.isArray(urun.fotograflar) && urun.fotograflar.length > 0
                  ? urun.fotograflar[0]
                  : "/placeholder.png"; // `public` klasöründe bu resmin olduğundan emin olun

              return (
                <div key={urun.id} className="col"> {/* Her kart bir sütun alır */}
                  <div className="card h-100 shadow-sm border-0 rounded-4 product-card-home transform-on-hover"> {/* Card Stilleri */}
                    <Link href={`/urun/${urun.id}`} className="d-block text-decoration-none p-3 product-image-wrapper">
                      <img
                        src={kapakFotograf}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                        alt={urun.urunAdi}
                        className="img-fluid rounded-3 product-image-fit" // Daha iyi uyum ve köşeler
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    </Link>
                    <div className="card-body d-flex flex-column text-center p-3">
                      <h5 className="card-title fw-bold text-dark mb-2 text-truncate">{urun.urunAdi}</h5> {/* Ürün adı */}
                      <p className="card-text text-muted mb-3 flex-grow-1 product-description-short">
                        {urun.aciklama
                          ? urun.aciklama.length > 70 // Daha kısa açıklama uzunluğu
                            ? `${urun.aciklama.substring(0, 70)}...`
                            : urun.aciklama
                          : "Açıklama mevcut değil."}
                      </p>
                      <div className="mt-auto pt-3 border-top">
                        <h6 className="text-success fw-bolder fs-4 mb-3">₺{Number(urun.fiyat).toFixed(2)}</h6> {/* Fiyatı daha belirgin */}
                        <Link
                          href={`/urun/${urun.id}`}
                          className="btn btn-primary btn-md w-100 rounded-pill shadow-sm view-details-btn" // Buton stilini iyileştir
                        >
                          <i className="bi bi-info-circle me-2"></i> Detayları Gör
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="alert alert-info text-center py-5 rounded-3 shadow-sm" role="alert">
            <h4 className="alert-heading">ℹ️ Ürün Bulunamadı!</h4>
            <p>Maalesef şu anda görüntülenecek ürün bulunmamaktadır. Yakında yeni ürünler eklenecektir!</p>
          </div>
        )}
      </div>

      {/* 🧾 Footer Bilgilendirme Alanı */}
      <footer className="mt-5 py-5 border-top bg-dark text-white"> {/* Footer arka planı koyu */}
        <div className="container">
          <div className="row text-center text-md-start"> {/* İçerik hizalaması */}
            <div className="col-12 col-md-4 mb-4">
              <h6 className="fw-bold mb-3 text-white">Chervantes</h6>
              <p className="small text-white-50">
                Kalite ve güvenin adresi. En iyi alışveriş deneyimi için her zaman yanınızdayız.
              </p>
            </div>

            <div className="col-12 col-md-4 mb-4">
              <h6 className="fw-bold mb-3 text-white">Bilgilendirme</h6>
              <ul className="list-unstyled">
                <li><Link href="/mesafeli-satis-sozlesmesi" className="text-white-50 text-decoration-none hover-white">Mesafeli Satış Sözleşmesi</Link></li>
                <li><Link href="/kvkk" className="text-white-50 text-decoration-none hover-white">Gizlilik Politikası (KVKK)</Link></li>
                <li><Link href="/iade-iptal" className="text-white-50 text-decoration-none hover-white">İade ve İptal</Link></li>
                <li><Link href="/teslimat-kosullari" className="text-white-50 text-decoration-none hover-white">Teslimat Koşulları</Link></li>
                <li><Link href="/on-bilgilendirme" className="text-white-50 text-decoration-none hover-white">Ön Bilgilendirme Formu</Link></li>
              </ul>
            </div>

            <div className="col-12 col-md-4 mb-4">
              <h6 className="fw-bold mb-3 text-white">Bize Ulaşın</h6>
              <ul className="list-unstyled">
                <li><Link href="/iletisim" className="text-white-50 text-decoration-none hover-white">İletişim Formu</Link></li>
                <li className="text-white-50"><i className="bi bi-envelope-fill me-2"></i> info@chervantes.com</li>
                <li className="text-white-50"><i className="bi bi-phone-fill me-2"></i> +90 5XX XXX XX XX</li>
              </ul>
              <div className="mt-3">
                <a href="#" className="text-white me-3 fs-5"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white me-3 fs-5"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-white fs-5"><i className="bi bi-instagram"></i></a>
              </div>
            </div>
          </div>
          <hr className="border-secondary mt-4 mb-3" />
          <div className="text-center small text-white-50">
            <p className="mb-0">© {new Date().getFullYear()} Chervantes.com</p>
            <p>Tüm Hakları Saklıdır.</p>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <img
              src="/iyzico-logo-pack/iyzico-logo-pack/footer_iyzico_ile_ode/Colored/logo_band_colored@3x.png"
              alt="İyzico Güvenli Ödeme"
              className="img-fluid"
              style={{ maxWidth: "300px" }} // İyzico logosunu küçült
            />
          </div>
        </div>
      </footer>

      {/* Özel CSS Stilleri */}
      <style jsx>{`
        /* Hero Section Gradient */
        .bg-gradient-primary-to-secondary {
          background: linear-gradient(to right, #007bff, #6610f2); /* Bootstrap primary ve indigo renkleri */
        }
        .hero-section {
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Section Title */
        .section-title {
          position: relative;
          display: inline-block;
          padding-bottom: 10px;
        }
        .section-title::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background-color: var(--bs-primary); /* Bootstrap primary rengi */
          border-radius: 2px;
        }

        /* Product Card Enhancements */
        .product-grid {
          /* Daha iyi bir kart akışı için özel margin/padding düzenlemesi */
        }
        .product-card-home {
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          border: 1px solid rgba(0, 0, 0, 0.05); /* Çok hafif kenarlık */
        }
        .product-card-home:hover {
          transform: translateY(-8px); /* Hafif yukarı kalkma efekti */
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.25) !important; /* Daha belirgin gölge */
        }
        .product-image-wrapper {
          height: 220px; /* Resim kapsayıcısına sabit yükseklik */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden; /* Taşmayı engelle */
        }
        .product-image-fit {
          transition: transform 0.3s ease-in-out;
        }
        .product-card-home:hover .product-image-fit {
          transform: scale(1.08); /* Resmin hafifçe büyüme efekti */
        }
        .product-description-short {
          font-size: 0.95rem;
          line-height: 1.4;
          color: #6c757d; /* Koyu gri tonu */
        }
        .view-details-btn {
            background-color: var(--bs-primary); /* Bootstrap primary rengi */
            border-color: var(--bs-primary);
            font-weight: 500;
            transition: all 0.3s ease-in-out;
        }
        .view-details-btn:hover {
            background-color: var(--bs-primary-dark); /* Daha koyu primary rengi */
            border-color: var(--bs-primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }

        /* Footer Link Hover Effect */
        .hover-white:hover {
            color: #fff !important; /* Beyaz renge dönüş */
        }
        .text-white-50 {
            color: rgba(255, 255, 255, 0.5) !important; /* Daha soluk beyaz */
        }

        /* Animation Classes (Animate.css gerektirir, eğer kuruluysa) */
        /* Eğer animate.css kullanmıyorsanız bu sınıfları kaldırabilirsiniz */
        /* @import 'animate.css'; */
      `}</style>
      {/* Animate.css kütüphanesini kullanıyorsanız, buraya veya _app.js'e ekleyebilirsiniz: */}
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" /> */}
    </>
  );
}