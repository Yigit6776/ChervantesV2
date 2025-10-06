import Navbar from "@/components/Navbar";

export default function Iadeiptal() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">İade ve İptal Sözleşmesi</h1>

        <p className="mb-4">
          <strong>1. Cayma Hakkı:</strong><br />
          Alıcı, ürünün tesliminden itibaren <strong>14 gün</strong> içinde hiçbir gerekçe göstermeden cayma hakkına sahiptir.
        </p>

        <p className="mb-4">
          <strong>2. İade Şartları:</strong><br />
          İade edilecek ürün; orijinal ambalajında, kullanılmamış ve tekrar satılabilir durumda olmalıdır.
        </p>

        <p className="mb-4">
          <strong>3. İade Süreci:</strong><br />
          İade talebi <strong>chervantesholding@gmail.com</strong> adresine iletilmelidir. Ürün, Satıcının belirttiği adrese gönderilmelidir.
        </p>

        <p className="mb-4">
          <strong>4. Kargo Ücreti:</strong><br />
          Cayma hakkı kapsamında yapılan iade kargolarının ücreti <strong>alıcıya aittir</strong>.
        </p>

        <p className="mb-4">
          <strong>5. Ücret İadesi:</strong><br />
          İade edilen ürün Satıcıya ulaştıktan sonra en geç <strong>14 iş günü</strong> içinde ürün bedeli, ödemenin yapıldığı yöntemle iade edilir.
        </p>
      </div>
       <style jsx global>{`
        :root {
          --nav-h: 74px; /* navbar yüksekliği */
        }

        .contact-page {
          padding-top: var(--nav-h);
        }
      `
      }</style>
    </>
  );
}
