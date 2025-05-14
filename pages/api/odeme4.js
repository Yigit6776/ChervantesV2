import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://api.iyzipay.com'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST isteği kabul edilir.' });
  }

  const {
    isim,
    soyisim,
    email,
    fiyat,
    adres,
    kartAdSoyad,
    kartNumara,
    kartAy,
    kartYil,
    kartCVC,
  } = req.body;

  const finalFiyat = fiyat.toString();
  const finalKartYil = kartYil.length === 2 ? '20' + kartYil : kartYil;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: finalFiyat,
    paidPrice: finalFiyat,
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: 'B67832',
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,

    paymentCard: {
      cardHolderName: kartAdSoyad,
      cardNumber: kartNumara,
      expireMonth: kartAy,
      expireYear: finalKartYil,
      cvc: kartCVC,
      registerCard: '0',
    },

    buyer: {
      id: 'BY789',
      name: isim,
      surname: soyisim,
      gsmNumber: '+905350000000', // gerçek numara önerilir
      email: email,
      identityNumber: '12345678901', // 11 haneli gerçek TC önerilir
      lastLoginDate: '2024-01-01 12:00:00',
      registrationDate: '2023-12-01 12:00:00',
      registrationAddress: adres,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '85.34.78.112',
      city: 'İstanbul',
      country: 'Turkey',
      zipCode: '34742',
    },

    shippingAddress: {
      contactName: `${isim} ${soyisim}`,
      city: 'İstanbul',
      country: 'Turkey',
      address: adres,
      zipCode: '34742',
    },

    billingAddress: {
      contactName: `${isim} ${soyisim}`,
      city: 'İstanbul',
      country: 'Turkey',
      address: adres,
      zipCode: '34742',
    },

    basketItems: [
      {
        id: 'BI101',
        name: 'Ürün Adı',
        category1: 'Oto Yedek Parça',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: finalFiyat,
      },
    ],
  };

  iyzipay.payment.create(request, (err, result) => {
    if (err) {
      console.error('🔥 İyzico Ödeme Hatası:', err.message || err);
      return res.status(500).json({ error: err });
    }

    console.log("✅ Ödeme Sonucu:", result.status, result.errorMessage || "");
    return res.status(200).json(result);
  });
}
