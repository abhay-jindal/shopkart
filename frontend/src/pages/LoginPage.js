import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth, useToast } from '../context';
import Header from '../components/Header';

const LoginPage = () => {
  const { login } = useAuth();
  const { showError } = useToast();

  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('referer') || '/';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post('/auth/login', values);
        login(res.data.access_token, res.data.token_type);
        window.location.href = redirectTo;
      } catch (err) {
        showError('Invalid email or password! Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Header centerNavigation={() => null} />
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-100 px-4">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg">
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-4">Sign in to Shopkart</h1>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && <p className="text-xs text-red-600 mt-1">{formik.errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && <p className="text-xs text-red-600 mt-1">{formik.errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-black text-white text-sm py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <span className="text-gray-400 text-xs mt-4 text-center cursor-pointer">By Signing In, I agree to Terms & Conditions, and privacy policy</span>
          <p className="text-xs text-center text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-black hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </>

  );
};

export default LoginPage;