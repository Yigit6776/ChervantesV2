import React, { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useSepet } from "../../context/SepetContext";
import { useAuth } from "../../context/AuthContext";
/* eslint-disable @next/next/no-html-link-for-pages */

const Navbar = () => {
  const [kategoriler, setKategoriler] = useState([]);
  const [loading, setLoading] = useState(true);

  const { sepet } = useSepet();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchKategoriler = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Kategoriler"));
        if (!snapshot.empty) {
          const kategoriListesi = snapshot.docs.map((doc) => ({
            id: doc.id,
            kategoriAdi: doc.data().KategoriAdi,
          }));
          setKategoriler(kategoriListesi);
        }
      } catch (error) {
        console.error("Firestore hata:", error);
      }
      setLoading(false);
    };

    fetchKategoriler();
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
      </Head>

      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">Chervantes</a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-dark"
                  href="#"
                  id="kategoriMenu"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Kategoriler
                </a>
                <ul className="dropdown-menu" aria-labelledby="kategoriMenu">
                  {loading && <li><span className="dropdown-item">Yükleniyor...</span></li>}
                  {!loading && kategoriler.map((kategori) => (
                    <li key={kategori.id}>
                      <a className="dropdown-item" href={`/kategori/${kategori.id}`}>
                        {kategori.kategoriAdi}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/iletisim">Hakkımızda</a>
              </li>
            </ul>

            <div className="ms-auto d-flex align-items-center">
              <a href="/sepet" className="nav-link position-relative me-3">
                Sepetim
                {sepet.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {sepet.length}
                  </span>
                )}
              </a>

              {currentUser ? (
                <a href="/profil" className="nav-link">Profilim</a>
              ) : (
                <a href="/uyegiris" className="nav-link">Üye Ol</a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: "80px" }}></div>

      <style jsx global>{`
        .navbar {
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
};

export default Navbar;
