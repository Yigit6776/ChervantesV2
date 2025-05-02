import React, { useState } from "react";
import { auth } from "../src/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Giriş başarılı!");
      router.push("/");
    } catch (error) {
      alert("Giriş hatası: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <form className="card p-4 shadow" onSubmit={handleSubmit}>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-posta"
            required
            className="form-control mb-2"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifre"
            required
            className="form-control mb-2"
          />

          {/* Şifremi Unuttum Linki */}
          <div className="text-end mb-3">
            <a href="/sifremi-unuttum" className="text-primary" style={{ fontSize: "0.9rem" }}>
              Şifremi Unuttum?
            </a>
          </div>

          <button type="submit" className="btn btn-primary w-100">Giriş Yap</button>
        </form>
      </div>
    </>
  );
};

export default Login;
