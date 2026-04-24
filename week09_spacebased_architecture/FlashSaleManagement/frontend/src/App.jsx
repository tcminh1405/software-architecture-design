import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartPage from './pages/CartPage.jsx';
import { Timer, Zap, ChevronRight } from 'lucide-react';

const PRODUCT_SERVICE = 'http://localhost:8081';
const CART_SERVICE = 'http://localhost:8082';
const ORDER_SERVICE = 'http://localhost:8083';
const INVENTORY_SERVICE = 'http://localhost:8084';

function HomePage({ products, stock, addToCart, timeLeft, formatTime }) {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Banner */}
      <div className="mb-12 bg-orange-500 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-2xl shadow-orange-500/30 text-white">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="z-10 text-center md:text-left mb-10 md:mb-0">
             <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-black mb-6">
                <Zap size={14} className="fill-white" /> HÀNG CHÍNH HÃNG 100%
             </div>
             <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none">FLASH SALE<br/>SIÊU CẤP</h2>
             <p className="text-orange-100 text-lg font-medium opacity-90">Ưu đãi độc quyền chỉ có tại hệ thống SBA Elite</p>
          </div>
          <div className="z-10 bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 border border-orange-100">
             <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Kết thúc sau</span>
             <div className="flex gap-4 items-center">
                <Timer className="text-orange-500" size={28} />
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{formatTime(timeLeft)}</span>
             </div>
             <button className="mt-4 flex items-center gap-2 text-orange-600 font-black text-sm hover:gap-4 transition-all">
                XEM TẤT CẢ <ChevronRight size={16} />
             </button>
          </div>
      </div>

      <div className="flex items-center justify-between mb-8">
         <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">DÀNH RIÊNG CHO BẠN</h2>
         <div className="flex gap-2">
            <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors">←</div>
            <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">→</div>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(p => (
          <ProductCard 
            key={p.id} 
            product={p} 
            stock={stock[p.id] || 0} 
            onAddToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [stock, setStock] = useState({});
  const [userId] = useState(`user_${Math.floor(Math.random() * 1000)}`);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    loadData();
    const stockTimer = setInterval(loadStock, 2000);
    const countdownTimer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => {
       clearInterval(stockTimer);
       clearInterval(countdownTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const loadData = async () => {
    try {
      const res = await axios.get(`${PRODUCT_SERVICE}/products`);
      setProducts(res.data);
      setLoading(false);
      loadStock();
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
      setLoading(false);
    }
  };

  const loadStock = async () => {
    try {
      const res = await axios.get(`${PRODUCT_SERVICE}/products`);
      const newStock = {};
      for (const p of res.data) {
        const sRes = await axios.get(`${INVENTORY_SERVICE}/stock/${p.id}`);
        newStock[p.id] = sRes.data.stock;
      }
      setStock(newStock);
    } catch (err) {}
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${CART_SERVICE}/cart`, { userId, productId, quantity: 1 });
      const currentQty = cart[productId] || 0;
      setCart({ ...cart, [productId]: currentQty + 1 });
    } catch (err) {
      alert('Lỗi thêm vào giỏ hàng');
    }
  };

  const checkout = async () => {
    try {
      const res = await axios.post(`${ORDER_SERVICE}/checkout`, { userId });
      alert(`🎉 Đặt hàng thành công! Mã đơn hàng: ${res.data.orderId}`);
      setCart({});
      loadStock();
      return true;
    } catch (err) {
      alert(`❌ Lỗi: ${err.response?.data?.error || 'Không thể đặt hàng'}`);
      return false;
    }
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-2xl text-orange-500 italic">SBA ELITE IS LOADING...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 font-['Outfit']">
        <Header cartCount={cartCount} userId={userId} />
        
        <Routes>
          <Route path="/" element={
            <HomePage 
              products={products} 
              stock={stock} 
              addToCart={addToCart} 
              timeLeft={timeLeft} 
              formatTime={formatTime} 
            />
          } />
          <Route path="/cart" element={
            <CartPage 
              cart={cart} 
              products={products} 
              onCheckout={checkout} 
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
