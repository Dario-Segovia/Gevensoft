import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'recover'
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    codigo_postal: '',
    poblacion: '',
    provincia: '',
    pais: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Inicio de sesión exitoso');
          localStorage.setItem('user', JSON.stringify(data.user)); // Guarda el usuario
          window.location.reload(); // Esto recarga la página y actualiza el Header
        } else {
          alert(`Error: ${data.message}`);
        }
      } else if (mode === 'register') {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: form.name, // <-- Cambia 'name' por 'nombre'
            apellidos: form.apellidos,
            email: form.email,
            password: form.password,
            telefono: form.telefono,
            direccion: form.direccion,
            codigo_postal: form.codigo_postal,
            poblacion: form.poblacion,
            provincia: form.provincia,
            pais: form.pais,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Usuario registrado correctamente');
          setMode('login');
        } else {
          alert(`Error: ${data.message}`);
        }
      } else if (mode === 'recover') {
        const response = await fetch('http://localhost:3000/api/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Se ha enviado el token de recuperación al correo');
        } else {
          alert(`Error: ${data.message}`);
        }
      }
    } catch (err) {
      console.error('Error en el formulario:', err);
      alert('Ocurrió un error inesperado');
    }
  };

  return (
    <div className="auth-container">
      <h2>
        {mode === 'login'
          ? 'Iniciar Sesión'
          : mode === 'register'
          ? 'Crear Cuenta'
          : 'Recuperar Contraseña'}
      </h2>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              value={form.apellidos}
              onChange={handleChange}
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
            />
            <input
              type="text"
              name="codigo_postal"
              placeholder="Código Postal"
              value={form.codigo_postal}
              onChange={handleChange}
            />
            <input
              type="text"
              name="poblacion"
              placeholder="Población"
              value={form.poblacion}
              onChange={handleChange}
            />
            <input
              type="text"
              name="provincia"
              placeholder="Provincia"
              value={form.provincia}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pais"
              placeholder="País"
              value={form.pais}
              onChange={handleChange}
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        {mode !== 'recover' && (
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">
          {mode === 'login'
            ? 'Entrar'
            : mode === 'register'
            ? 'Registrarse'
            : 'Enviar enlace'}
        </button>
      </form>

      <div className="auth-links">
        {mode !== 'login' && (
          <span onClick={() => setMode('login')}>¿Ya tienes cuenta? Inicia sesión</span>
        )}
        {mode !== 'register' && (
          <span onClick={() => setMode('register')}>¿No tienes cuenta? Regístrate</span>
        )}
        {mode !== 'recover' && (
          <span onClick={() => setMode('recover')}>¿Olvidaste tu contraseña?</span>
        )}
      </div>
    </div>
  );
};

export default Auth;
