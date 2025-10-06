// pages/iletisim.js (veya Contact sayfan)
'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="bg-light min-vh-100">
        {/* HERO */}
        <section className="container py-5 text-center">
          <h1 className="display-6 fw-bold text-dark">Bize Ulaşın</h1>
          <p className="text-muted mt-2">
            Sipariş, kargo ya da ürünle ilgili her konuda ekibimiz hızlıca dönüş yapar.
          </p>
        </section>

        {/* CONTENT */}
        <section className="container pb-5">
          {/* Sadece ortalamak için: */}
          <div className="row g-4 justify-content-center">
            {/* SOL: İLETİŞİM BİLGİLERİ */}
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h2 className="h5 fw-semibold mb-3 text-center">İletişim Bilgileri</h2>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">
                      <div className="small text-secondary text-uppercase">Telefon</div>
                      <Link href="tel:05443759482" className="link-dark fw-medium">
                        0544 375 9482
                      </Link>
                    </li>
                    <li className="list-group-item px-0">
                      <div className="small text-secondary text-uppercase">E-posta</div>
                      <Link
                        href="mailto:chervantesholding@gmail.com"
                        className="link-dark fw-medium text-wrap"
                      >
                        chervantesholding@gmail.com
                      </Link>
                    </li>
                    <li className="list-group-item px-0">
                      <div className="small text-secondary text-uppercase">Çalışma Saatleri</div>
                      <div className="fw-medium">Hafta içi 09:00 — 18:00</div>
                    </li>
                    <li className="list-group-item px-0">
                      <div className="small text-secondary text-uppercase">Merkez</div>
                      <div className="fw-medium">Zonguldak / Türkiye</div>
                    </li>
                  </ul>

                  <div className="row row-cols-1 row-cols-sm-3 g-2 mt-4">
                    <div className="col">
                      <Link href="https://wa.me/905443759482" className="btn btn-dark w-100">
                        WhatsApp
                      </Link>
                    </div>
                    <div className="col">
                      <Link href="tel:05443759482" className="btn btn-outline-secondary w-100">
                        Ara
                      </Link>
                    </div>
                    <div className="col">
                      <Link
                        href="mailto:chervantesholding@gmail.com"
                        className="btn btn-outline-secondary w-100"
                      >
                        E-posta
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ: FORM (ileride ekleyeceksen buraya) */}
          </div>
        </section>
      </main>

      <style jsx global>{`
        :root {
          --nav-h: 74px; /* navbar yüksekliği */
        }
        .contact-page {
          padding-top: var(--nav-h);
        }
      `}</style>
    </>
  );
}
