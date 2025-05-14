'use client';

import React, { useState, useEffect } from 'react';
import { useSepet } from '../context/SepetContext';
import Navbar from '@/components/Navbar';
import { db } from '../src/firebaseConfig';
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

async function getNextOrderNumber() {
  const counterRef = doc(db, 'counters', 'orders');
  let nextNumber;
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    if (!snap.exists()) {
      tx.set(counterRef, { lastOrder: 1 });
      nextNumber = 1;
    } else {
      const { lastOrder } = snap.data();
      nextNumber = lastOrder + 1;
      tx.update(counterRef, { lastOrder: nextNumber });
    }
  });
  return nextNumber;
}

export default function Odeme() {
  const { sepet } = useSepet();
  const [formData, setFormData] = useState({
    adSoyad: '',
    email: '',
    telefon: '',
    il: '',
    ilce: '',
    mahalle: '',
    adresDetay: '',
    postaKodu: '',
    kartAdSoyad: '',
    kartNumara: '',
    kartAy: '',
    kartYil: '',
    kartCVC: '',
  });
  const [localSepet, setLocalSepet] = useState([]);

  useEffect(() => {
    setLocalSepet(sepet);
  }, [sepet]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const toplamTutar = localSepet.reduce(
        (sum, u) => sum + Number(u.fiyat) * (u.adet || 1),
        0
      );

     const response = await fetch('/api/odeme4', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isim: formData.adSoyad.split(' ')[0],
          soyisim: formData.adSoyad.split(' ').slice(1).join(' ') || '-',
          email: formData.email,
          fiyat: toplamTutar.toFixed(2),
          adres: `${formData.mahalle}, ${formData.ilce}, ${formData.il}`,
          kartAdSoyad: formData.kartAdSoyad,
          kartNumara: formData.kartNumara,
          kartAy: formData.kartAy,
          kartYil: formData.kartYil,
          kartCVC: formData.kartCVC,
        }),
      });

      const result = await response.json();

      if (result.status === 'success' || result.paymentStatus === 'SUCCESS') {
        const num = await getNextOrderNumber();
        const orderId = String(num).padStart(4, '0');

        const orderData = {
          orderNumber: `sparis${orderId}`,
          sepet: localSepet,
          toplamTutar,
          formData,
          createdAt: serverTimestamp(),
        };

        const orderDocRef = doc(db, 'Sparisler', orderId);
        await setDoc(orderDocRef, orderData);

        alert(`✅ Ödeme başarılı. Sipariş numaranız: sparis${orderId}`);
      } else {
        alert('❌ Ödeme başarısız!');
        console.error('Ödeme hatası:', result);
      }
    } catch (err) {
      console.error('HATA:', err);
      alert('❌ Ödeme sırasında hata oluştu!');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <form className="row" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <h4>Adres Bilgileri</h4>
            <div className="row g-3">
              {[['Ad Soyad', 'adSoyad'], ['E-Posta', 'email'], ['Telefon', 'telefon'], ['İl', 'il'], ['İlçe', 'ilce'], ['Mahalle', 'mahalle'], ['Posta Kodu', 'postaKodu'], ['Adres Detayı', 'adresDetay']].map(([label, name], idx) => (
                <div className={idx < 6 ? 'col-md-6' : 'col-12'} key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    name={name}
                    className="form-control"
                    onChange={handleChange}
                    required={name !== 'postaKodu'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <h4>Kart Bilgileri</h4>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Kart Üzerindeki İsim</label>
                <input name="kartAdSoyad" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label">Kart Numarası</label>
                <input name="kartNumara" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Son Kullanma Ay</label>
                <select name="kartAy" className="form-select" onChange={handleChange} required>
                  <option value="">Ay Seçin</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const val = String(i + 1).padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Son Kullanma Yıl</label>
                <select name="kartYil" className="form-select" onChange={handleChange} required>
                  <option value="">Yıl Seçin</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Güvenlik Kodu (CVC)</label>
                <input name="kartCVC" className="form-control" onChange={handleChange} required />
              </div>

              <div className="text-center mt-3">
                <p className="text-muted">
                  💳 <strong>Test Kart:</strong> 5528790000000008 - 12/30 - 123
                </p>
                <img
                  src="/iyzico-logo-pack/iyzico-logo-pack/footer_iyzico_ile_ode/Colored/logo_band_colored@2x.png"
                  alt="ödeme logoları"
                  style={{ maxWidth: '400px', marginTop: '10px' }}
                />
              </div>
            </div>
          </div>

          <div className="col-12 mt-4">
            <button className="btn btn-success w-100" type="submit">
              Ödeme Yap ve Siparişi Tamamla
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
