import Navbar from "@/components/Navbar";

export default function MesafeliSatisSozlesmesi() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">Mesafeli Satış Sözleşmesi</h1>

        <p>
          İşbu Mesafeli Satış Sözleşmesi, aşağıda bilgileri verilen Satıcı ile
          internet sitesi üzerinden ürün/hizmet satın alan Alıcı arasında, 6502
          sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere
          Dair Yönetmelik uyarınca kurulmuştur.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. TARAFLAR</h2>
        <p><strong>Satıcı:</strong> Yiğit Akdeniz</p>
        <p><strong>İnternet Sitesi:</strong> www.chervantes.com</p>
        <p><strong>Telefon:</strong> 0544 375 9482</p>
        <p><strong>E-posta:</strong> chervantesholding@gmail.com</p>
        <p><strong>Alıcı:</strong> Ürün siparişi sırasında bilgileri giren kullanıcı.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. SÖZLEŞMENİN KONUSU</h2>
        <p>
          İşbu sözleşmenin konusu, Alıcının Satıcıya ait internet sitesi
          üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve
          teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. ÜRÜN BİLGİLERİ</h2>
        <p>
          Ürünlerin cinsi, türü, adedi, satış bedeli, ödeme şekli ve tüm vergiler
          dahil toplam satış bedeli sipariş ekranında belirtilmiştir.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. TESLİMAT</h2>
        <p>
          Teslimat, Alıcının sipariş sırasında belirttiği adrese kargo yoluyla
          yapılacaktır. Teslimat süresi en geç 7 iş günüdür.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. CAYMA HAKKI</h2>
        <p>
          Alıcı, malın tesliminden itibaren 14 (ondört) gün içinde herhangi bir
          gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma hakkı kapsamında
          yapılan iade kargolarının ücreti alıcıya aittir.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. CAYMA HAKKININ KULLANILMASI</h2>
        <p>
          Cayma hakkının kullanılması için bu süre içinde Satıcıya yazılı olarak
          veya kalıcı veri saklayıcısı ile bildirimde bulunulması yeterlidir.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. YETKİLİ MAHKEME</h2>
        <p>
          İşbu sözleşmeden doğabilecek uyuşmazlıklarda, Gümrük ve Ticaret
          Bakanlığı tarafından belirlenen parasal sınırlara göre Alıcının ve
          Satıcının bulunduğu yerdeki Tüketici Hakem Heyetleri ve Tüketici
          Mahkemeleri yetkilidir.
        </p>
      </div>
    </>
  );
}
