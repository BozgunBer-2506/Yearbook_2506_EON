import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const API = 'https://yearbook2506eon-production.up.railway.app/api/auth';

const LoginPage = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [message, setMessage] = useState({ text: '', error: false });
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
    const msg = (text, error = false) => setMessage({ text, error });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        msg('');
        try {
            const res = await axios.post(`${API}/login`, {
                email: form.email,
                password: form.password,
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            msg('Anmeldung erfolgreich…');
            setTimeout(() => onLoginSuccess(), 1000);
        } catch (err) {
            msg(err.response?.data?.error || 'Anmeldung fehlgeschlagen.', true);
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        msg('');
        try {
            const res = await axios.post(`${API}/register`, {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            msg('Registrierung erfolgreich…');
            setTimeout(() => onLoginSuccess(), 1000);
        } catch (err) {
            msg(err.response?.data?.error || 'Registrierung fehlgeschlagen.', true);
        }
        setLoading(false);
    };

    return (
        <div className="lp-root">
            {/* Stars */}
            <div className="lp-stars" aria-hidden="true">
                {Array.from({ length: 80 }, (_, i) => (
                    <div key={i} className="lp-star" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: Math.random() * 2 + 0.5,
                        height: Math.random() * 2 + 0.5,
                        animationDelay: `${Math.random() * 5}s`,
                    }} />
                ))}
            </div>

            <div className="lp-glow-teal" />
            <div className="lp-glow-purple" />

            <div className="lp-card">
                {/* Header */}
                <div className="lp-header">
                    <div className="lp-logo">EON</div>
                    <div className="lp-title">Jahrbuch 25-06</div>
                    <div className="lp-subtitle">Agile Softwareentwicklung · Linux & Cloud</div>
                </div>

                {/* Tab Toggle */}
                <div className="lp-tabs">
                    <button
                        className={`lp-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); msg(''); }}
                    >Anmelden</button>
                    <button
                        className={`lp-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => { setMode('register'); msg(''); }}
                    >Registrieren</button>
                </div>

                {/* Login Form */}
                {mode === 'login' && (
                    <form className="lp-form" onSubmit={handleLogin}>
                        <div className="lp-field">
                            <label className="lp-label">E-Mail</label>
                            <input className="lp-input" type="email" placeholder="deine@email.de"
                                value={form.email} onChange={set('email')} required />
                        </div>
                        <div className="lp-field">
                            <label className="lp-label">Passwort</label>
                            <input className="lp-input" type="password" placeholder="••••••••"
                                value={form.password} onChange={set('password')} required />
                        </div>
                        <button className="lp-btn" type="submit" disabled={loading}>
                            {loading ? <span className="lp-spinner" /> : 'Anmelden ›'}
                        </button>
                        <p className="lp-switch">
                            Noch kein Konto?{' '}
                            <span onClick={() => { setMode('register'); msg(''); }}>Jetzt registrieren</span>
                        </p>
                    </form>
                )}

                {/* Register Form */}
                {mode === 'register' && (
                    <form className="lp-form" onSubmit={handleRegister}>
                        <div className="lp-row">
                            <div className="lp-field">
                                <label className="lp-label">Vorname</label>
                                <input className="lp-input" type="text" placeholder="Max"
                                    value={form.firstName} onChange={set('firstName')} required />
                            </div>
                            <div className="lp-field">
                                <label className="lp-label">Nachname</label>
                                <input className="lp-input" type="text" placeholder="Mustermann"
                                    value={form.lastName} onChange={set('lastName')} required />
                            </div>
                        </div>
                        <div className="lp-field">
                            <label className="lp-label">E-Mail</label>
                            <input className="lp-input" type="email" placeholder="deine@email.de"
                                value={form.email} onChange={set('email')} required />
                        </div>
                        <div className="lp-field">
                            <label className="lp-label">Passwort <span className="lp-hint">(min. 6 Zeichen)</span></label>
                            <input className="lp-input" type="password" placeholder="••••••••"
                                value={form.password} onChange={set('password')} required minLength={6} />
                        </div>
                        <button className="lp-btn" type="submit" disabled={loading}>
                            {loading ? <span className="lp-spinner" /> : 'Konto erstellen ›'}
                        </button>
                        <p className="lp-switch">
                            Bereits registriert?{' '}
                            <span onClick={() => { setMode('login'); msg(''); }}>Anmelden</span>
                        </p>
                    </form>
                )}

                {/* Message */}
                {message.text && (
                    <div className={`lp-msg ${message.error ? 'lp-msg-error' : 'lp-msg-success'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;