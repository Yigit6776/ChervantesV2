'use client'; 

import Link from 'next/link';
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
import { useRouter } from 'next/navigation';

import { Montserrat, Open_Sans } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-open-sans',
});

async function getNextOrderNumber() {
  const counterRef = doc(db, 'counters', 'orders');
  let nextNumber;
  try {
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
  } catch (error) {
    console.error('Firebase Transaction Error (getNextOrderNumber):', error);
    throw new Error('Sipariş numarası alınırken Firebase hatası oluştu: ' + error.message);
  }
}

export default function Odeme() {
  const { sepet, clearSepet } = useSepet();
  const router = useRouter();
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setLocalSepet(sepet);
    // Sepet boşsa yönlendirme mantığı burada olmamalı, aksi takdirde ödeme sonrası boşalan sepetle kullanıcıyı geri atabilir
    // if (sepet.length === 0 && !isProcessingPayment) {
    //     router.push('/home2');
    // }
  }, [sepet, isProcessingPayment]);

  const handleChange = (e) => {
    // Kart numarası ve CVC için özel işlem
    if (e.target.name === 'kartNumara') {
      const value = e.target.value.replace(/\D/g, '').slice(0, 16); // Sadece rakam ve max 16 karakter
      setFormData({ ...formData, [e.target.name]: value });
    } else if (e.target.name === 'kartCVC') {
      const value = e.target.value.replace(/\D/g, '').slice(0, 3); // Sadece rakam ve max 3 karakter
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localSepet.length === 0) {
        alert('Sepetinizde ürün bulunmamaktadır. Lütfen ürün ekleyiniz.');
        return;
    }

    setIsProcessingPayment(true); // Ödeme işlemi başladı

    try {
      const toplamTutar = localSepet.reduce(
        (sum, u) => sum + Number(u.fiyat) * (u.adet || 1),
        0
      );

      const paymentPayload = {
        isim: formData.adSoyad.split(' ')[0],
        soyisim: formData.adSoyad.split(' ').slice(1).join(' ') || '-',
        email: formData.email,
        fiyat: toplamTutar.toFixed(2),
        adres: `${formData.mahalle}, ${formData.ilce}, ${formData.il}, ${formData.adresDetay}`, // Adres detayını da ekledim
        telefon: formData.telefon, 
        kartAdSoyad: formData.kartAdSoyad,
        kartNumara: formData.kartNumara,
        kartAy: formData.kartAy,
        kartYil: formData.kartYil,
        kartCVC: formData.kartCVC,
        il: formData.il,
        ilce: formData.ilce,
        mahalle: formData.mahalle,
        postaKodu: formData.postaKodu,
        sepet: localSepet // Sepeti de API'ye gönderiyoruz!
      };

      console.log('ADIM 1: Ödeme API isteği gönderiliyor...', paymentPayload);
      const response = await fetch('/api/odeme4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload),
      });

      if (!response.ok) {
          let errorBody = {};
          let rawErrorText = '';
          try {
              rawErrorText = await response.text(); 
              errorBody = JSON.parse(rawErrorText); 
          } catch (jsonError) {
              console.error('API yanıtı JSON olarak ayrılamadı veya boş:', jsonError, 'Yanıt metni:', rawErrorText);
              errorBody.message = rawErrorText || 'API\'den boş veya geçersiz yanıt alındı.';
          }
          const errorMessage = errorBody.message || 'Bilinmeyen API hatası.';
          console.error('ADIM 2a: Ödeme API yanıtı (HTTP Hata):', response.status, errorBody);
          alert(`❌ Ödeme işlemi başarısız oldu (HTTP ${response.status}). Lütfen tekrar deneyin. Detay: ${errorMessage.substring(0, 200)}`);
          return; 
      }

      const result = await response.json();
      console.log('ADIM 2b: Ödeme API yanıtı (JSON - TAM SONUÇ):', JSON.stringify(result, null, 2)); 

      const isPaymentSuccess = result && (
          (typeof result.status === 'string' && result.status.toLowerCase() === 'success') ||
          (typeof result.paymentStatus === 'string' && result.paymentStatus.toLowerCase() === 'success')
      );
      
      console.log('ADIM 2c: isPaymentSuccess kontrol sonucu:', isPaymentSuccess);

      if (isPaymentSuccess) {
        console.log('ADIM 3: Ödeme Başarılı olarak algılandı. Sipariş Numarası alınıyor...');
        const num = await getNextOrderNumber();
        const orderId = String(num).padStart(4, '0');
        console.log('ADIM 4: Oluşturulan Sipariş Numarası:', orderId);

        const orderData = {
            orderNumber: `sparis${orderId}`,
            sepet: localSepet.map(item => ({
                id: item.id,
                urunAdi: item.urunAdi,
                fiyat: item.fiyat,
                adet: item.adet || 1,
            })),
            toplamTutar,
            formData: {
                adSoyad: formData.adSoyad,
                email: formData.email,
                telefon: formData.telefon,
                il: formData.il,
                ilce: formData.ilce,
                mahalle: formData.mahalle,
                adresDetay: formData.adresDetay,
                postaKodu: formData.postaKodu,
            },
            createdAt: serverTimestamp(),
            paymentStatus: result.paymentStatus || result.status || 'SUCCESS',
            paymentReference: result.referenceId || result.conversationId || null,
        };

        console.log('ADIM 5: Firebase\'e sipariş kaydediliyor...', orderData);
        const orderDocRef = doc(db, 'Sparisler', orderId);
        await setDoc(orderDocRef, orderData);
        console.log('ADIM 6: Sipariş Firebase\'e başarıyla kaydedildi.');

        // Sepet temizleme işlemini ayrı bir try-catch bloğuna alalım
        try {
          clearSepet();
          console.log('ADIM 7: Sepet temizlendi.');
        } catch (clearErr) {
          console.error('Sepet temizlenirken hata oluştu:', clearErr);
          // Sepet temizlenemese bile akışı devam ettirelim
        }
        
        // Admin SMS gönder - sabit numara
        try {
            console.log('ADIM 8: Admin SMS gönderiliyor...');
            const smsResponse = await fetch('/api/sms', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: '+905443759482', // kendi numaran buraya
                message: `Yeni bir sipariş alındı. Sipariş numarası: sparis${orderId}, Toplam Tutar: ${toplamTutar} TL.`,
              }),
            });
            const smsResult = await smsResponse.json();
            if (smsResponse.ok && smsResult.success) {
                console.log('ADIM 9: Admin SMS başarıyla gönderildi.');
            } else {
                console.warn('ADIM 9: Admin SMS gönderilirken bir sorun oluştu:', smsResult.error || 'Bilinmeyen hata');
            }
        } catch (smsErr) {
            console.error('ADIM 9: Admin SMS gönderme sırasında hata:', smsErr);
        }

        alert(`✅ Ödeme başarılı! Sipariş numaranız: sparis${orderId}.`);
        console.log('ADIM 10: Yönlendirme yapılıyor...'); 
        router.push('/home2'); 
        
      } else {
        // Eğer isPaymentSuccess false ise, buraya düşeriz.
        // Bu, Iyzico'nun ödemeyi onaylamadığı anlamına gelir.
        const errorMessage = result.errorMessage || result.message || 'Ödeme sağlayıcısı başarısız veya bilinmeyen bir durum döndürdü.';
        alert(`❌ Ödeme başarısız! Lütfen bilgilerinizi kontrol edin veya farklı bir kart deneyin. Hata: ${errorMessage}`);
        console.error('Ödeme API yanıtı başarılı olarak yorumlanamadı:', result);
      }
    } catch (err) {
      console.error('GENEL HATA YAKALANDI:', err);
      let userErrorMessage = 'Ödeme sırasında beklenmeyen bir hata oluştu! Lütfen tekrar deneyin.';
      if (err.message) {
        if (err.message.includes('Firebase')) {
          userErrorMessage = 'Siparişiniz kaydedilirken bir sorun oluştu. Lütfen yöneticinize başvurun.';
        } else if (err.message.includes('Failed to fetch')) {
          userErrorMessage = 'Sunucuyla bağlantı kurulamadı. İnternet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.';
        } else if (err.message.includes('Sipariş numarası alınırken Firebase hatası oluştu')) {
          userErrorMessage = 'Sipariş numarası oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
        }
      }
      alert(`❌ ${userErrorMessage}`);
    } finally {
      setIsProcessingPayment(false); // İşlem bittiğinde yükleme durumunu kapat
      console.log('ADIM SONU: Ödeme işlemi tamamlandı veya finally bloğu çalıştı.');
    }
  };

  const calculateTotalPrice = () => {
    return localSepet.reduce((sum, u) => sum + Number(u.fiyat) * (u.adet || 1), 0).toFixed(2);
  };

  return (
    <>
      <Navbar />
      <div className={`container mt-5 mb-5 ${openSans.className}`}>
        <h2 className={`text-center mb-4 ${montserrat.className}`}>Ödeme Bilgileri</h2>

        {localSepet.length === 0 && !isProcessingPayment ? (
          <div className="alert alert-warning text-center" role="alert">
            Sepetinizde ürün bulunmamaktadır. Lütfen <Link href="/home2">ürünleri inceleyin</Link>.
          </div>
        ) : (
          <form className="row g-4" onSubmit={handleSubmit}>
            <div className="col-md-7">
              <h4 className={`mb-3 ${montserrat.className}`}>Adres Bilgileri</h4>
              <div className="row g-3">
                {[
                  ['Ad Soyad', 'adSoyad', 'text'],
                  ['E-Posta', 'email', 'email'],
                  ['Telefon', 'telefon', 'tel'],
                  ['İl', 'il', 'text'],
                  ['İlçe', 'ilce', 'text'],
                  ['Mahalle', 'mahalle', 'text'],
                  ['Posta Kodu', 'postaKodu', 'text', false],
                  ['Adres Detayı', 'adresDetay', 'textarea', true, 3]
                ].map(([label, name, type, required = true, rows = 1], idx) => (
                  <div className={name === 'adresDetay' ? 'col-12' : (idx < 6 ? 'col-md-6' : 'col-12')} key={name}>
                    <label htmlFor={name} className="form-label">{label}</label>
                    {type === 'textarea' ? (
                      <textarea
                        id={name}
                        name={name}
                        className="form-control"
                        onChange={handleChange}
                        rows={rows}
                        required={required}
                        value={formData[name] || ''} 
                      ></textarea>
                    ) : (
                      <input
                        id={name}
                        name={name}
                        type={type}
                        className="form-control"
                        onChange={handleChange}
                        required={required}
                        value={formData[name] || ''} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-5">
              <h4 className={`mb-3 ${montserrat.className}`}>Sipariş Özeti ve Kart Bilgileri</h4>
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Sepet Özeti</h5>
                  <ul className="list-group list-group-flush">
                    {localSepet.map((urun) => (
                      <li key={urun.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {urun.urunAdi} ({urun.adet || 1} adet)
                        </div>
                        <span className="fw-bold">{((urun.fiyat || 0) * (urun.adet || 1)).toFixed(2)} TL</span>
                      </li>
                    ))}
                    <li className="list-group-item d-flex justify-content-between align-items-center fw-bold text-primary">
                      <span>Toplam Tutar:</span>
                      <span className="fs-5">{calculateTotalPrice()} TL</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="kartAdSoyad" className="form-label">Kart Üzerindeki İsim Soyisim</label>
                  <input id="kartAdSoyad" name="kartAdSoyad" type="text" className="form-control" onChange={handleChange} required value={formData.kartAdSoyad || ''} />
                </div>

                <div className="col-12">
                  <label htmlFor="kartNumara" className="form-label">Kart Numarası</label>
                  <input id="kartNumara" name="kartNumara" type="text" inputMode="numeric" pattern="[0-9]{13,16}" placeholder="XXXX XXXX XXXX XXXX" className="form-control" onChange={handleChange} required maxLength="16" value={formData.kartNumara || ''} />
                </div>

                <div className="col-md-6">
                  <label htmlFor="kartAy" className="form-label">Son Kullanma Ay</label>
                  <select id="kartAy" name="kartAy" className="form-select" onChange={handleChange} required value={formData.kartAy || ''}>
                    <option value="">Ay Seçin</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const val = String(i + 1).padStart(2, '0');
                      return <option key={val} value={val}>{val}</option>;
                    })}
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="kartYil" className="form-label">Son Kullanma Yıl</label>
                  <select id="kartYil" name="kartYil" className="form-select" onChange={handleChange} required value={formData.kartYil || ''}>
                    <option value="">Yıl Seçin</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>

                <div className="col-12">
                  <label htmlFor="kartCVC" className="form-label">Güvenlik Kodu (CVC)</label>
                  <input id="kartCVC" name="kartCVC" type="text" inputMode="numeric" pattern="[0-9]{3,4}" className="form-control" onChange={handleChange} required maxLength="3" value={formData.kartCVC || ''} />
                </div>

                <div className="col-12 text-center mt-3">
                  <img
                    src="/iyzico-logo-pack/iyzico-logo-pack/footer_iyzico_ile_ode/Colored/logo_band_colored@2x.png"
                    alt="Güvenli Ödeme İşlemleri"
                    className="img-fluid"
                    style={{ maxWidth: '300px', opacity: 0.9 }}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 mt-4">
              <button
                className="btn btn-primary btn-lg w-100 py-3"
                type="submit"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? '⏳ Ödeme Yapılıyor...' : `💳 ${calculateTotalPrice()} TL Ödeme Yap ve Siparişi Tamamla`}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}