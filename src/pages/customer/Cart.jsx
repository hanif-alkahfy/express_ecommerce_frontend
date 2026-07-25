import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import formatCurrency from '../../utils/formatCurrency';

const SHIPPING_COST = 10000;
const FREE_SHIPPING_THRESHOLD = 100000;
const TAX_RATE = 0.1;

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const maxStock = item.stock || item.stock_quantity || 99;
  const isOutOfStock = maxStock === 0;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < maxStock) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const clamped = Math.max(1, Math.min(value, maxStock));
    onUpdateQuantity(item.id, clamped);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {item.image_url || item.image ? (
          <img
            src={item.image_url || item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
          {item.name}
        </Link>
        
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(item.price)} each
        </p>

        {isOutOfStock && (
          <p className="text-sm text-red-600 mt-1">Out of stock</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={maxStock}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-14 h-8 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= maxStock}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="self-start sm:self-center p-2 text-gray-400 hover:text-red-600 transition-colors"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function CartSummary({ subtotal, onCheckout, isAuthenticated, isEmpty }) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="text-xs text-gray-500">
            Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="text-gray-900">{formatCurrency(tax)}</span>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={onCheckout}
          disabled={isEmpty}
          className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Proceed to Checkout
        </button>
        
        <Link
          to="/products"
          className="block w-full py-3 px-4 text-center border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeItem}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={totalAmount}
            onCheckout={handleCheckout}
            isAuthenticated={isAuthenticated}
            isEmpty={items.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
