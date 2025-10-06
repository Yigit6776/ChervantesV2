// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useSepet } from "../../context/SepetContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const [kategoriler, setKategoriler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aramaKelime, setAramaKelime] = useState("");

  const { sepet } = useSepet();
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "Kategoriler"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          kategoriAdi: doc.data().KategoriAdi,
        }));
        setKategoriler(list);
      } catch (err) {
        console.error("Firestore hata:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleArama = (e) => {
    e.preventDefault();
    const q = aramaKelime.trim();
    if (q) router.push(`/arama?kelime=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <Head>
        
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
      </Head>

      {/* HER SAYFADA OPak (elevated) navbar */}
      <nav className={`navbar navbar-expand-lg fixed-top cherv-navbar cherv-navbar--elevated`}>
        <div className="container-xl">
          <Link href="/" className="navbar-brand fw-bold">
            CHERVANTES
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="kategoriMenu"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Kategoriler
                </a>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="kategoriMenu">
                  {loading && (
                    <li>
                      <span className="dropdown-item-text text-secondary">Yükleniyor...</span>
                    </li>
                  )}
                  {!loading &&
                    kategoriler.map((k) => (
                      <li key={k.id}>
                        <Link className="dropdown-item" href={`/kategori/${k.id}`}>
                          {k.kategoriAdi}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/iletisim">
                  Hakkımızda
                </Link>
              </li>
            </ul>

           

            <div className="d-flex align-items-center gap-3">
              <Link href="/sepet" className="nav-link position-relative">
                Sepetim
                {Array.isArray(sepet) && sepet.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {sepet.length}
                  </span>
                )}
              </Link>

              {currentUser ? (
                <Link href="/profil" className="btn btn-outline-light btn-sm">
                  Profilim
                </Link>
              ) : (
                <Link href="/uyegiris" className="btn btn-primary btn-sm">
                  Üye Ol
                </Link>
              )}




 <form className="d-flex me-lg-3 my-2 my-lg-0 cherv-search" onSubmit={handleArama}>
              <input
                type="text"
                className="form-control"
                placeholder="Ürün ara..."
                value={aramaKelime}
                onChange={(e) => setAramaKelime(e.target.value)}
              />
              <button className="btn btn-outline-light ms-2" type="submit">
                Ara
              </button>
            </form>





            </div>
          </div>
        </div>
      </nav>

      <style jsx global>{`
      

        /* Tüm sayfalarda üst boşluk (navbar çakışmasın) */
        body { padding-top: var(--nav-h); }
        html { scroll-padding-top: var(--nav-h); }

        .cherv-navbar {
          --bg: rgba(10, 12, 14, 0.72);
          --blur: 8px;  
          --shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
          --text: #ffffffff;
          --muted: #ffffffff;
          backdrop-filter: blur(var(--blur));
          -webkit-backdrop-filter: blur(var(--blur));
          background: var(--bg);
          box-shadow: var(--shadow);
        }
        /* her zaman elevated kullanıyoruz ama class kalsın */
        .cherv-navbar--elevated { }

.cherv-navbar .navbar-brand {
  font-family: 'Cinzel Decorative', 'Trajan Pro', serif;
  font-weight: 900;
  color: var(--text) !important;
  letter-spacing: 0.18em;
  -webkit-text-stroke: 0.5px rgba(0,0,0,0.5);
}

        .cherv-navbar .nav-link {
          color: var(--muted) !important;
          transition: color 0.2s ease, border-color 0.2s ease;
          border-bottom: 2px solid transparent;
          padding-bottom: 0.25rem;
        }
        .cherv-navbar .nav-link:hover,
        .cherv-navbar .nav-link:focus {
          color: var(--text) !important;
          border-color: #e6e6e9;
        }

        .dropdown-menu-dark {
          --bs-dropdown-bg: #121418;
          --bs-dropdown-link-color: #d8d8dc;
          --bs-dropdown-link-hover-bg: #1a1d22;
          --bs-dropdown-link-hover-color: #fff;
          --bs-dropdown-border-color: rgba(255,255,255,0.08);
          border: 1px solid var(--bs-dropdown-border-color);
        }

        .cherv-search .form-control {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .cherv-search .form-control::placeholder { color: #bfc3c9; }
        .cherv-search .form-control:focus {
          background: rgba(255,255,255,0.12);
          border-color: #e6e6e9;
          box-shadow: none;
          color: #fff;
        }

        .container-xl { max-width: 1200px; }
        .navbar-toggler { filter: invert(100%); }
      `}</style>
    </>
  );
}
