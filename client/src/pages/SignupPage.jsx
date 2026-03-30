import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../features/authSlice';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setErrorLocal('Passwords do not match');
      return;
    }
    setErrorLocal('');
    dispatch(signupUser({ email, password }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-16">
        <Film className="w-8 h-8 text-primary" />
      </div>
      <div className="glass-card w-full max-w-md p-8">
        <h1 className="text-3xl font-light mb-8">Sign Up</h1>
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
          <input
            type="password"
            placeholder="Repeat Password"
            className="w-full bg-transparent border-b border-grey focus:border-white outline-none py-3 px-4 transition-all"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          {(error || errorLocal) && <p className="text-primary text-sm">{error || errorLocal}</p>}
          <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating account...' : 'Create an account'}
          </button>
        </form>
        <p className="mt-6 text-center text-grey">
          Already have an account? <Link to="/login" className="text-primary ml-2">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
