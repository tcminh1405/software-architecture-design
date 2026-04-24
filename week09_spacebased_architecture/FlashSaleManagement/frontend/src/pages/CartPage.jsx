import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, CreditCard, ShieldCheck } from 'lucide-react';

const CartPage = ({ cart, products, onCheckout }) => {
  const navigate = useNavigate();
  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === id);
    return { ...product, quantity: qty };
  }).filter(item => item.quantity > 0);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = total > 5000000 ? 500000 : 0;

  const handleCheckout = async () => {
    const success = await onCheckout();
    if (success) navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 font-bold text-sm mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> QUAY LẠI CỬA HÀNG
      </Link>

      <div className="flex items-center gap-4 mb-12">
         <div className="bg-orange-100 p-4 rounded-3xl">
            <ShoppingBag className="text-orange-600" size={32} />
         </div>
         <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">GIỎ HÀNG CỦA BẠN</h2>
            <p className="text-slate-400 font-medium">Bạn đang có {cartItems.length} sản phẩm trong giỏ</p>
         </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[3rem] py-20 text-center shadow-xl shadow-slate-200/50">
          <p className="text-slate-400 font-medium text-lg mb-8">Giỏ hàng của bạn đang trống rỗng...</p>
          <Link to="/" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-orange-500 transition-all shadow-xl shadow-slate-900/20">
            SĂN SALE NGAY
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center">
                   <ShoppingBag className="text-slate-200" size={40} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 text-lg group-hover:text-orange-500 transition-colors">{item.name}</h3>
                  <p className="text-sm text-slate-400 font-medium mb-4">{item.description}</p>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 gap-4">
                        <button className="text-slate-400 hover:text-slate-900 font-bold">-</button>
                        <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                        <button className="text-slate-400 hover:text-slate-900 font-bold">+</button>
                     </div>
                     <span className="text-xs text-slate-300 font-bold">x {(item.price/1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-xl text-slate-900 italic">{(item.price * item.quantity / 1000000).toFixed(1)}M</p>
                   <button className="mt-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
             <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 sticky top-32">
                <h3 className="text-xl font-black text-slate-900 mb-8 italic">TỔNG ĐƠN HÀNG</h3>
                
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-100">
                   <div className="flex justify-between text-sm font-medium text-slate-500">
                      <span>Tạm tính</span>
                      <span className="text-slate-900">{(total/1000000).toFixed(1)}M</span>
                   </div>
                   <div className="flex justify-between text-sm font-medium text-slate-500">
                      <span>Vận chuyển</span>
                      <span className="text-green-600 font-black">MIỄN PHÍ</span>
                   </div>
                   {discount > 0 && (
                      <div className="flex justify-between text-sm font-medium text-orange-600">
                         <span>Giảm giá SBA Elite</span>
                         <span className="font-black">-{(discount/1000000).toFixed(1)}M</span>
                      </div>
                   )}
                </div>

                <div className="flex justify-between items-end mb-10">
                   <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Tổng cộng</span>
                   <span className="text-4xl font-black text-orange-600 italic tracking-tighter">
                      {((total - discount)/1000000).toFixed(1)}M
                   </span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 active:scale-95"
                >
                  <CreditCard size={20} /> THANH TOÁN
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                   <ShieldCheck size={14} className="text-green-500" /> Thanh toán bảo mật 100%
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
