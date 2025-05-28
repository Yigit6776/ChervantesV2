'use client';

import React from 'react';
import { useSepet } from '../context/SepetContext';
import Navbar from '@/components/Navbar';

const Sepet = () => {
  const {
    sepet,
    sepeteEkle,
    sepettenCikar,
    sepetiBosalt,
    urunuTamamenSil,
  } = useSepet();

  const toplamFiyat = sepet.reduce(
    (total, urun) => total + Number(urun.fiyat) * (urun.adet || 1),
    0
  );

  const urunArttir = async (urun) => {
    await sepeteEkle(urun);
    window.location.href = '/sepet'; // 🔥 Artık .html olarak yönlendirme yok
  };

  const urunAzalt = async (urun) => {
    await sepettenCikar(urun.id);
    window.location.href = '/sepet';
  };

  const urunSil = async (urunId) => {
    await urunuTamamenSil(urunId);
    window.location.href = '/sepet';
  };

  const tumunuSil = async () => {
    await sepetiBosalt();
    window.location.href = '/sepet';
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h4 className="mb-3">Sepetiniz</h4>

        {sepet.length === 0 ? (
          <p className="text-muted">Sepetiniz boş.</p>
        ) : (
          <>
            <ul className="list-group">
              {sepet.map((urun, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ gap: '10px' }}
                >
                  <div className="d-flex align-items-center" style={{ flexGrow: 1 }}>
                    {urun.fotograflar && urun.fotograflar.length > 0 && (
                      <img
                        src={urun.fotograflar[0]}
                        alt={urun.urunAdi}
                        className="rounded"
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          marginRight: '10px',
                        }}
                      />
                    )}
                    <span>{urun.urunAdi}</span>
                  </div>

                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => urunAzalt(urun)}
                    >
                      -
                    </button>
                    <span className="mx-2">{urun.adet || 1}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary ms-1"
                      onClick={() => urunArttir(urun)}
                    >
                      +
                    </button>

                    <button
                      className="btn btn-sm btn-danger ms-3"
                      onClick={() => urunSil(urun.id)}
                    >
                      🗑
                    </button>
                  </div>

                  <div>
                    <span className="text-muted me-3">
                      ₺{Number(urun.fiyat)} x {Number(urun.adet || 1)} ={' '}
                      <strong>
                        ₺{Number(urun.fiyat) * Number(urun.adet || 1)}
                      </strong>
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-end mt-3">
              <strong>Toplam Tutar: ₺{toplamFiyat.toFixed(2)}</strong>
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <button className="btn btn-danger" onClick={tumunuSil}>
                Sepeti Temizle 🧹
              </button>

              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = '/odeme')} // 👈 dikkat
              >
                Sepeti Onayla
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sepet;