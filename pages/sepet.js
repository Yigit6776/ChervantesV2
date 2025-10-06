'use client';

import React, { useEffect } from 'react';
import { useSepet } from '../context/SepetContext';
import Navbar from '@/components/Navbar';

const Sepet = () => {
  const {
    sepet, sepeteEkle, sepettenCikar, sepetiBosalt, urunuTamamenSil,
  } = useSepet();

  const toplamFiyat = sepet.reduce(
    (total, urun) => total + Number(urun.fiyat) * (urun.adet || 1),
    0
  );

  const urunArttir = async (urun) => { await sepeteEkle(urun); window.location.href = '/sepet'; };
  const urunAzalt = async (urun) => { await sepettenCikar(urun.id); window.location.href = '/sepet'; };
  const urunSil   = async (id)   => { await urunuTamamenSil(id);   window.location.href = '/sepet'; };
  const tumunuSil = async ()     => { await sepetiBosalt();        window.location.href = '/sepet'; };

  // ←––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Bu sayfadayken body'nin global padding-top'unu kapat
  useEffect(() => {
    document.body.classList.add('no-body-pad');
    return () => document.body.classList.remove('no-body-pad');
  }, []);
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––→

  return (
    <>
      <Navbar />
      <div className="sepet-page">
        <div className="sepet-overlay" />

        <div className="sepet-wrap">
          <div className="container sepet-content">
            <h4 className="mb-3">Sepetiniz</h4>

            {sepet.length === 0 ? (
              <p className="text-muted">Sepetiniz boş.</p>
            ) : (
              <>
                <ul className="list-group">
                  {sepet.map((urun, i) => (
                    <li key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ gap: 10 }}>
                      <div className="d-flex align-items-center" style={{ flexGrow: 1 }}>
                        {urun.fotograflar?.[0] && (
                          <img src={urun.fotograflar[0]} alt={urun.urunAdi}
                               className="rounded"
                               style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 10 }} />
                        )}
                        <span>{urun.urunAdi}</span>
                      </div>

                      <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => urunAzalt(urun)}>-</button>
                        <span className="mx-2">{urun.adet || 1}</span>
                        <button className="btn btn-sm btn-outline-secondary ms-1" onClick={() => urunArttir(urun)}>+</button>
                        <button className="btn btn-sm btn-danger ms-3" onClick={() => urunSil(urun.id)}>🗑</button>
                      </div>

                      <div>
                        <span className="text-muted me-3">
                          ₺{Number(urun.fiyat)} x {Number(urun.adet || 1)} = <strong>
                          ₺{Number(urun.fiyat) * Number(urun.adet || 1)}</strong>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="text-end mt-3">
                  <strong>Toplam Tutar: ₺{toplamFiyat.toFixed(2)}</strong>
                </div>

                <div className="mt-4 d-flex justify-content-between">
                  <button className="btn btn-danger" onClick={tumunuSil}>Sepeti Temizle 🧹</button>
                  <button className="btn btn-primary" onClick={() => (window.location.href = '/odeme')}>Sepeti Onayla</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root { --nav-h: 74px; }

        /* Navbar global padding-top'unu bu sayfada kapat */
        body.no-body-pad { padding-top: 0 !important; }

        .sepet-page {
          min-height: 100vh;
          /* İçerik navbarın altında başlasın */
          padding-top: var(--nav-h);
          background: url("ChatGPT Image 2 Eki 2025 08_53_02.png") center/cover no-repeat fixed;
          position: relative;
        }

        .sepet-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.40);
          z-index: 0;
        }

        .sepet-wrap {
          position: relative;
          z-index: 1;
          min-height: calc(100vh - var(--nav-h));
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .sepet-content {
          background: rgba(255,255,255,0.9);
          border-radius: 12px;
          padding: 20px;
          width: 100%;
          max-width: 900px;
          box-shadow: 0 10px 30px rgba(0,0,0,.3);
        }
      `}</style>
    </>
  );
};

export default Sepet;
