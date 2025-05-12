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
  setDoc
} from 'firebase/firestore';

// Sayaç fonksiyonu: her çağrıldığında bir sonraki numarayı alır
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
    adSoyad: '', email: '', telefon: '',
    il: '', ilce: '', mahalle: '',
    adresDetay: '', postaKodu: '',
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
      // toplam tutar
      const toplamTutar = localSepet.reduce(
        (sum, u) => sum + Number(u.fiyat) * (u.adet||1),
        0
      );
      // artırılan order numarası
      const num = await getNextOrderNumber();
      // "0001" formatına getir
      const orderId = String(num).padStart(4, '0');

      const orderData = {
        orderNumber: `sparis${orderId}`,    // örn. "sparis0001"
        sepet: localSepet,
        toplamTutar,
        formData,
        createdAt: serverTimestamp(),
      };

      // sıralı ID ile doküman oluştur
      const orderDocRef = doc(db, 'Sparisler', orderId);
      await setDoc(orderDocRef, orderData);

      alert(`Sipariş başarıyla oluşturuldu. Numaranız: ${orderId}`);
    } catch (err) {
      console.error('Sipariş kaydı hatası:', err);
      alert('Sipariş kaydı yapılamadı!');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <h3>Adres Bilgileri</h3>
            <form className="row g-3" onSubmit={handleSubmit}>
              {[
                ['Ad Soyad','adSoyad'],
                ['E-Posta','email'],
                ['Telefon','telefon'],
                ['İl','il'],
                ['İlçe','ilce'],
                ['Mahalle','mahalle'],
                ['Posta Kodu','postaKodu'],
                ['Adres Detayı','adresDetay']
              ].map(([label,name],idx)=>(
                <div
                  className={idx<6?'col-md-6':'col-12'}
                  key={name}
                >
                  <label className="form-label">{label}</label>
                  <input
                    name={name}
                    className="form-control"
                    onChange={handleChange}
                    required={name!=='postaKodu'}
                  />
                </div>
              ))}
              <div className="col-12">
                <button className="btn btn-success w-100" type="submit">
                  Ödeme Yap
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
            <p className="text-muted">Kart ödeme formu (placeholder) 💳</p>
          </div>
        </div>



<div className="text-center mt-5 mb-20">
  <img
    src="/iyzico-logo-pack/iyzico-logo-pack/footer_iyzico_ile_ode/Colored/logo_band_colored@2x.png"
    alt="ödeme logoları"
    style={{ maxWidth: "400px", marginTop: "10px" }}
  />
</div>


      </div>
    </>
  );
}
