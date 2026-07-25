import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import formatCurrency from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const SHIPPING_COST = 10000;
const FREE_SHIPPING_THRESHOLD = 100000;
const TAX_RATE = 0.1;

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        recipientName: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = totalAmount;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          recipientName: formData.recipientName,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,
        },
        paymentMethod: 'qris',
      };

      const orderResponse = await orderService.checkout(orderData);
      const { orderId } = orderResponse.data.data;

      const paymentResponse = await paymentService.initiatePayment(orderId);
      const { paymentUrl } = paymentResponse.data.data;

      clearCart();
      window.location.href = paymentUrl;
    } catch (err) {
      setIsLoading(false);
      const message = err.response?.data?.message || err.response?.data?.error || 'Checkout failed. Please try again.';
      
      if (err.response?.status === 400 && err.response?.data?.error?.includes('stock')) {
        setError('Some items are out of stock. Please update your cart.');
      } else {
        setError(message);
      }
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              
              <Input
                id="recipientName"
                name="recipientName"
                label="Recipient Name"
                value={formData.recipientName}
                onChange={handleChange}
                error={errors.recipientName}
                required
              />

              <Input
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="81234567890"
                required
              />

              <div className="mb-4">
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-900">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full address"
                  required
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-900">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions for delivery"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="flex items-center gap-3 p-4 border-2 border-blue-600 rounded-lg bg-blue-50">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">QRIS</p>
                  <p className="text-sm text-gray-500">Scan QR code to pay</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Place Order & Pay
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    {item.image_url || item.image ? (
                      <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="text-gray-900">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link to="/cart" className="block mt-4 text-center text-sm text-gray-600 hover:text-gray-900">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
