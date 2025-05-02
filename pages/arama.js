import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebaseConfig";
import Link from "next/link";

const AramaSayfasi = () => {
  const router = useRouter();
  const [kelime, setKelime] = useState("");
  const [urunler, setUrunler] = useState([]);
  const [sonuclar, setSonuclar] = useState([]);

  useEffect(() => {
    if (router.isReady && router.query.kelime) {
      setKelime(router.query.kelime.toString().toLowerCase());
    }
  }, [router.isReady, router.query.kelime]);

  useEffect(() => {
    const fetchUrunler = async () => {
      const snapshot = await getDocs(collection(db, "urunler"));
      const veri = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUrunler(veri);
    };
    fetchUrunler();
  }, []);

  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o");

  useEffect(() => {
    if (kelime && urunler.length > 0) {
      const filtrelenmis = urunler.filter((urun) =>
        normalize(urun.urunAdi || "").includes(normalize(kelime)) ||
        normalize(urun.aciklama || "").includes(normalize(kelime))
      );
      setSonuclar(filtrelenmis);
    }
  }, [kelime, urunler]);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">🔍 “{kelime}” için sonuçlar</h3>

      {sonuclar.length > 0 ? (
        <div className="row">
          {sonuclar.map((urun) => {
            const kapakFotograf =
              Array.isArray(urun.fotograflar) && urun.fotograflar.length > 0
                ? urun.fotograflar[0]
                : "/placeholder.png";

            return (
              <div key={urun.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={kapakFotograf}
                    className="card-img-top"
                    alt={urun.urunAdi}
                    style={{ maxHeight: "250px", objectFit: "contain" }}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{urun.urunAdi}</h5>
                      <p className="card-text text-muted">
                        {urun.aciklama?.substring(0, 80) || "Açıklama bulunamadı"}...
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold text-success">{urun.fiyat} TL</p>
                      <Link href={`/urun/${urun.id}`} className="btn btn-primary btn-sm">
                        Detayları Gör
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>❌ Sonuç bulunamadı.</p>
      )}

      <p className="text-muted mt-3">
        Yüklü Ürün: {urunler.length} — Eşleşen: {sonuclar.length}
      </p>
    </div>
  );
};

export default AramaSayfasi;
