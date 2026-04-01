import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.post('register/', { email, password });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.email) {
        setError('An account with this email already exists.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>

        <div style={s.logo}>🏡</div>
        <h2 style={s.title}>NestFinder</h2>
        <p style={s.subtitle}>Create your account</p>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <form onSubmit={handleRegister}>
          <input
            style={s.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={s.input}
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button style={s.button} type="submit">Create account</button>
        </form>

        <p style={s.linkText}>
          Already have an account? <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7f5' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '360px', border: '1px solid #e5e7eb' },
  logo: { textAlign: 'center', fontSize: '32px', marginBottom: '8px' },
  title: { textAlign: 'center', fontSize: '20px', fontWeight: '500', color: '#1a1a2e', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#6b7280', fontSize: '13px', marginBottom: '24px' },
  input: { width: '100%', padding: '10px 12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding: '10px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  error: { backgroundColor: '#FCEBEB', color: '#A32D2D', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' },
  success: { backgroundColor: '#EAF3DE', color: '#3B6D11', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' },
  linkText: { textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6b7280' },
  link: { color: '#1D9E75', textDecoration: 'none', fontWeight: '500' },
};

export default Register;