import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SifreSifirla() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSifirla = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Şifre sıfırlama maili gönderildi. E-postanı kontrol et!");
    } catch (err) {
      setError("❌ Hata: " + err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "450px" }}>
        <h3 className="text-center mb-4">🔐 Şifremi Unuttum</h3>
        <form onSubmit={handleSifirla}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-posta Adresiniz</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="ornek@eposta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Şifreyi Sıfırla
          </button>
        </form>

        {message && (
          <div className="alert alert-success mt-4 text-center" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-4 text-center" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
