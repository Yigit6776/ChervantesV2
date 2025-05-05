import Navbar from "@/components/Navbar";

export default function Onbilgilendirmeformu() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">Ön Bilgilendirme Formu</h1>

        <p className="mb-4">
          <strong>1. TARAFLAR:</strong><br />
          Satıcı: Yiğit Akdeniz <br />
          İnternet Sitesi: www.chervantes.com <br />
          Telefon: 0544 375 9482 <br />
          E-posta: chervantesholding@gmail.com <br />
          Alıcı: Ürün siparişi sırasında bilgileri giren kullanıcı.
        </p>

        <p className="mb-4">
          <strong>2. SÖZLEŞMENİN KONUSU:</strong><br />
          İşbu sözleşmenin konusu, Alıcının Satıcıya ait internet sitesi üzerinden elektronik incelemeler sonucu verdiği siparişlerin değerlendirilmesi ve teslimine ilişkin hak ve yükümlülüklerinin belirlenmesidir.
        </p>

        <p className="mb-4">
          <strong>3. ÜRÜN BİLGİLERİ:</strong><br />
          Ürünlerin türü, cinsi, miktarı, satış bedeli, ödeme şekli ve tüm vergiler dahil toplam satış bedeli siparişin kaydedilmesiyle kesinleşir.
        </p>

        <p className="mb-4">
          <strong>4. TESLİMAT:</strong><br />
          Teslimat, Alıcının sipariş sırasında belirttiği adrese kargo yoluyla yapılacaktır. Teslim süresi en geç 7 iş günüdür.
        </p>

        <p className="mb-4">
          <strong>5. CAYMA HAKKI:</strong><br />
          Alıcı, ürünün tesliminden itibaren 14 (ondört) gün içerisinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir.
        </p>

        <p className="mb-4">
          <strong>6. CAYMA HAKKININ KULLANILMASI:</strong><br />
          Cayma hakkı kapsamında yapılan iadelerde kargo ücreti alıcıya aittir. Cayma hakkını kullanması için bu süre içinde Satıcıya yazılı olarak veya kalıcı veri saklayıcısı ile bildirimde bulunulması yeterlidir.
        </p>

        <p className="mb-4">
          <strong>7. YETKİLİ MAHKEME:</strong><br />
          İşbu sözleşmeden doğabilecek uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığı tarafından belirlenen parasal sınırlara göre Alıcının ve Satıcının bulunduğu yerdeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
        </p>
      </div>
    </>
  );
}
