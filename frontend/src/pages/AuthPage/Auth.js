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

  // Obtener idioma actual
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';

  // Textos según idioma
  const texts = {
    login: {
      title: currentLanguage === 'en' ? 'Sign In' : 'Iniciar Sesión',
      button: currentLanguage === 'en' ? 'Log In' : 'Entrar'
    },
    register: {
      title: currentLanguage === 'en' ? 'Create Account' : 'Crear Cuenta',
      button: currentLanguage === 'en' ? 'Register' : 'Registrarse',
      name: currentLanguage === 'en' ? 'Name' : 'Nombre',
      apellidos: currentLanguage === 'en' ? 'Last Name' : 'Apellidos',
      telefono: currentLanguage === 'en' ? 'Phone' : 'Teléfono',
      direccion: currentLanguage === 'en' ? 'Address' : 'Dirección',
      codigo_postal: currentLanguage === 'en' ? 'Postal Code' : 'Código Postal',
      poblacion: currentLanguage === 'en' ? 'City' : 'Población',
      provincia: currentLanguage === 'en' ? 'Province' : 'Provincia',
      pais: currentLanguage === 'en' ? 'Country' : 'País'
    },
    recover: {
      title: currentLanguage === 'en' ? 'Recover Password' : 'Recuperar Contraseña',
      button: currentLanguage === 'en' ? 'Send Link' : 'Enviar enlace'
    },
    common: {
      email: currentLanguage === 'en' ? 'Email' : 'Correo electrónico',
      password: currentLanguage === 'en' ? 'Password' : 'Contraseña',
      haveAccount: currentLanguage === 'en' ? 'Already have an account? Sign in' : '¿Ya tienes cuenta? Inicia sesión',
      noAccount: currentLanguage === 'en' ? "Don't have an account? Register" : '¿No tienes cuenta? Regístrate',
      forgotPassword: currentLanguage === 'en' ? 'Forgot your password?' : '¿Olvidaste tu contraseña?',
      successLogin: currentLanguage === 'en' ? 'Login successful' : 'Inicio de sesión exitoso',
      successRegister: currentLanguage === 'en' ? 'User registered successfully' : 'Usuario registrado correctamente',
      successRecover: currentLanguage === 'en' ? 'Recovery token sent to email' : 'Se ha enviado el token de recuperación al correo',
      error: currentLanguage === 'en' ? 'An unexpected error occurred' : 'Ocurrió un error inesperado'
    }
  };

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
          alert(texts.common.successLogin);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.reload();
        } else {
          alert(`${currentLanguage === 'en' ? 'Error' : 'Error'}: ${data.message}`);
        }
      } else if (mode === 'register') {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: form.name,
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
          alert(texts.common.successRegister);
          setMode('login');
        } else {
          alert(`${currentLanguage === 'en' ? 'Error' : 'Error'}: ${data.message}`);
        }
      } else if (mode === 'recover') {
        const response = await fetch('http://localhost:3000/api/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email }),
        });

        const data = await response.json();
        if (response.ok) {
          alert(texts.common.successRecover);
        } else {
          alert(`${currentLanguage === 'en' ? 'Error' : 'Error'}: ${data.message}`);
        }
      }
    } catch (err) {
      console.error('Error en el formulario:', err);
      alert(texts.common.error);
    }
  };

  const getTitle = () => {
    if (mode === 'login') return texts.login.title;
    if (mode === 'register') return texts.register.title;
    return texts.recover.title;
  };

  const getButtonText = () => {
    if (mode === 'login') return texts.login.button;
    if (mode === 'register') return texts.register.button;
    return texts.recover.button;
  };

  return (
    <div className="auth-container">
      <h2>{getTitle()}</h2>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <input
              type="text"
              name="name"
              placeholder={texts.register.name}
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellidos"
              placeholder={texts.register.apellidos}
              value={form.apellidos}
              onChange={handleChange}
            />
            <input
              type="text"
              name="telefono"
              placeholder={texts.register.telefono}
              value={form.telefono}
              onChange={handleChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder={texts.register.direccion}
              value={form.direccion}
              onChange={handleChange}
            />
            <input
              type="text"
              name="codigo_postal"
              placeholder={texts.register.codigo_postal}
              value={form.codigo_postal}
              onChange={handleChange}
            />
            <input
              type="text"
              name="poblacion"
              placeholder={texts.register.poblacion}
              value={form.poblacion}
              onChange={handleChange}
            />
            <input
              type="text"
              name="provincia"
              placeholder={texts.register.provincia}
              value={form.provincia}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pais"
              placeholder={texts.register.pais}
              value={form.pais}
              onChange={handleChange}
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder={texts.common.email}
          value={form.email}
          onChange={handleChange}
          required
        />

        {mode !== 'recover' && (
          <input
            type="password"
            name="password"
            placeholder={texts.common.password}
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">
          {getButtonText()}
        </button>
      </form>

      <div className="auth-links">
        {mode !== 'login' && (
          <span onClick={() => setMode('login')}>{texts.common.haveAccount}</span>
        )}
        {mode !== 'register' && (
          <span onClick={() => setMode('register')}>{texts.common.noAccount}</span>
        )}
        {mode !== 'recover' && (
          <span onClick={() => setMode('recover')}>{texts.common.forgotPassword}</span>
        )}
      </div>
    </div>
  );
};

export default Auth;