import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/authSlice';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-16">
        <Film className="w-8 h-8 text-primary" />
      </div>
      <div className="glass-card w-full max-w-md p-8">
        <h1 className="text-3xl font-light mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-transparent border-b border-grey focus:border-white outline-none py-3 px-4 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border-b border-grey focus:border-white outline-none py-3 px-4 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-primary text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Logging in...' : 'Login to your account'}
          </button>
        </form>
        <p className="mt-6 text-center text-grey">
          Don't have an account? <Link to="/signup" className="text-primary ml-2">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
