import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../context';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const addressSchema = Yup.object().shape({
  alias: Yup.string().required('Alias is required'),
  address_line1: Yup.string().required('Address line is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip_code: Yup.number().required('ZIP code is required'),
});

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    axios.get('/account/addresses', { requireAuth: true })
      .then(res => setAddresses(res.data))
      .catch(() => showError('Failed to fetch addresses'));
  }, []);

  const formik = useFormik({
    initialValues: {
      alias: '',
      address_line1: '',
      city: '',
      state: '',
      zip_code: null,
    },
    validationSchema: addressSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingIndex !== null) {
          const { id } = addresses[editingIndex];
          const updated = await axios.put(`/account/addresses/${id}`, values);
          const copy = [...addresses];
          copy[editingIndex] = updated.data;
          setAddresses(copy);
          showSuccess('Address updated successfully');
        } else {
          const res = await axios.post('/account/addresses', values, { requireAuth: true });
          setAddresses(prev => [...prev, res.data]);
          showSuccess('Address added successfully');
        }
        resetForm();
        setEditingIndex(null);
      } catch {
        showError('Save failed');
      }
    },
  });

  const startEdit = (index) => {
    setEditingIndex(index);
    formik.setValues(addresses[index]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/account/addresses/${id}`, { requireAuth: true });
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      showSuccess('Address deleted successfully');
    } catch {
      showError('Delete failed');
    }
  };

  const centerNavigation = () => {
    return (
      <div className="flex gap-6 items-center text-sm font-medium text-gray-700">
        <Link to="/addresses" className="hover:text-black">Manage Addresses</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-800">

      <Header centerNavigation={centerNavigation} />
      <div className="max-w-4xl mx-auto py-5 px-2">
        {/* Form */}
        <div className="bg-white p-5  mb-8">
          <h2 className="text-base font-medium mb-4">{editingIndex !== null ? 'Edit Address' : 'Add Address'}</h2>
          <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <input
                name="alias"
                placeholder="Alias (e.g. Home)"
                className="border px-3 py-1.5 rounded w-full"
                value={formik.values.alias}
                onChange={formik.handleChange}
              />
              {formik.touched.alias && formik.errors.alias && (
                <div className="text-red-500 text-xs">{formik.errors.alias}</div>
              )}
            </div>
            <div>
              <input
                name="address_line1"
                placeholder="Address Line 1"
                className="border px-3 py-1.5 rounded w-full"
                value={formik.values.address_line1}
                onChange={formik.handleChange}
              />
              {formik.touched.address_line1 && formik.errors.address_line1 && (
                <div className="text-red-500 text-xs">{formik.errors.address_line1}</div>
              )}
            </div>
            <div>
              <input
                name="city"
                placeholder="City"
                className="border px-3 py-1.5 rounded w-full"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
              {formik.touched.city && formik.errors.city && (
                <div className="text-red-500 text-xs">{formik.errors.city}</div>
              )}
            </div>
            <div>
              <input
                name="state"
                placeholder="State"
                className="border px-3 py-1.5 rounded w-full"
                value={formik.values.state}
                onChange={formik.handleChange}
              />
              {formik.touched.state && formik.errors.state && (
                <div className="text-red-500 text-xs">{formik.errors.state}</div>
              )}
            </div>
            <div>
              <input
                name="zip_code"
                type='number'
                placeholder="ZIP Code"
                className="border px-3 py-1.5 rounded w-full"
                value={formik.values.zip_code}
                onChange={formik.handleChange}
              />
              {formik.touched.zip_code && formik.errors.zip_code && (
                <div className="text-red-500 text-xs">{formik.errors.zip_code}</div>
              )}
            </div>
            <div className="col-span-2 mt-3">
              <button
                type="submit"
                className="bg-black text-white text-sm px-4 py-1.5 rounded hover:bg-gray-900"
              >
                {editingIndex !== null ? 'Update address' : 'Add address'}
              </button>
            </div>
          </form>

          <hr className="mt-10 py-2" />
          {/* Table */}

          <h2 className="text-base font-medium mb-4">Your addresses</h2>
          {addresses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 rounded-lg">
                  <tr>
                    <th className="px-4 py-2 text-left">Alias</th>
                    <th className="px-4 py-2 text-left">Address</th>
                    <th className="px-4 py-2 text-left">City</th>
                    <th className="px-4 py-2 text-left">State</th>
                    <th className="px-4 py-2 text-left">ZIP</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {addresses.map((address, index) => (
                    <tr key={address.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 font-medium">{address.alias}</td>
                      <td className="px-4 py-2">{address.address_line1}</td>
                      <td className="px-4 py-2">{address.city}</td>
                      <td className="px-4 py-2">{address.state}</td>
                      <td className="px-4 py-2">{address.zip_code}</td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => startEdit(index)}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <main className="flex flex-col items-center justify-center h-[calc(100vh-32rem)] text-center px-6">

              <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-address-found-illustration-download-in-svg-png-gif-file-formats--location-app-finding-permission-results-empty-state-error-pack-design-development-illustrations-3613886.png" alt="Empty Cart" className="w-32 h-32 mb-4" />
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-8">
                {/* Discover premium products at affordable prices. Seamless shopping experience inspired by elegance and simplicity. */}
                No addresses found! Please add an address for smooth checkout experience.
              </p>

            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;