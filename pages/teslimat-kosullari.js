import Navbar from "@/components/Navbar";

export default function Teslimatkosullari() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">Teslimat Koşulları</h1>

        <p className="mb-4">
          <strong>1. Sipariş Onayı:</strong><br />
          Sipariş onayı alındıktan sonra ürünler en geç <strong>3 iş günü</strong> içerisinde kargoya verilir.
        </p>

        <p className="mb-4">
          <strong>2. Teslimat Adresi:</strong><br />
          Teslimat, alıcının sipariş sırasında belirttiği adrese yapılır.
        </p>

        <p className="mb-4">
          <strong>3. Teslimat Süresi:</strong><br />
          Teslimat süresi, kargo firmasına ve teslimat adresinin bulunduğu bölgeye bağlı olarak değişiklik gösterebilir.
        </p>

        <p className="mb-4">
          <strong>4. Gecikmeler:</strong><br />
          Kargo firması kaynaklı gecikmelerden Satıcı sorumlu değildir.
        </p>

        <p className="mb-4">
          <strong>5. Hasarlı Ürün Durumu:</strong><br />
          Alıcı, teslimat sırasında ürün paketini mutlaka kontrol etmelidir. Hasarlı veya açılmış ambalajlı ürünleri teslim almamalı ve durumu kargo görevlisine tutanakla bildirmelidir.
        </p>
      </div>
    </>
  );
}
