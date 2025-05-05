import Navbar from "@/components/Navbar";

export default function Kvkk() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">Gizlilik Politikası ve Kişisel Verilerin Korunması</h1>

        <p className="mb-4">
          <strong>1. Veri Sorumlusu:</strong><br />
          6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu sıfatıyla hareket eden
          Yiğit Akdeniz - Chervantes Otomotiv, www.chervantes.com üzerinden toplanan kişisel verilerin
          işlenmesinden sorumludur.
        </p>

        <p className="mb-4">
          <strong>2. Toplanan Veriler:</strong><br />
          Sipariş işlemleri veya üyelik sırasında ad, soyad, e-posta, telefon, teslimat adresi ve ödeme bilgileri gibi veriler toplanabilir.
        </p>

        <p className="mb-4">
          <strong>3. İşleme Amaçları:</strong><br />
          Bu veriler; siparişin hazırlanması, ödeme işlemleri, müşteri desteği, kullanıcı hesabı yönetimi ve yasal yükümlülüklerin yerine getirilmesi için işlenir.
        </p>

        <p className="mb-4">
          <strong>4. Üçüncü Taraflarla Paylaşım:</strong><br />
          Veriler sadece hizmetin gerektirdiği ölçüde İyzico, kargo firmaları ve resmi kurumlarla paylaşılır.
          Ticari amaçla 3. kişilerle paylaşılmaz.
        </p>

        <p className="mb-4">
          <strong>5. Verilerin Saklanması:</strong><br />
          Veriler Firebase sunucularında saklanır. Sipariş bilgileri 10 yıl, kullanıcı verileri silme talebine kadar saklanır.
        </p>

        <p className="mb-4">
          <strong>6. Çerez Kullanımı:</strong><br />
          Web sitemizde kullanıcı deneyimini artırmak için çerezler kullanılmaktadır. Çerezler tarayıcı ayarlarından kontrol edilebilir.
        </p>

        <p className="mb-4">
          <strong>7. Kullanıcı Hakları:</strong><br />
          KVKK madde 11’e göre kullanıcılar verilerine erişme, düzeltme, silme veya işlenmesini durdurma hakkına sahiptir.
          Talepler <a href="mailto:chervantesholding@gmail.com" className="text-blue-600 underline">chervantesholding@gmail.com</a> adresine iletilebilir.
        </p>

        <p className="mb-4">
          <strong>8. Güvenlik Önlemleri:</strong><br />
          Veriler; SSL sertifikası, yetkilendirme sistemleri ve erişim loglamaları ile korunur.
        </p>
      </div>
    </>
  );
}
