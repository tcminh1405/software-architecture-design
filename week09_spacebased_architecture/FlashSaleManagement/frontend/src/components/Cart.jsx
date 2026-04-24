import React from 'react';
import { ShoppingCart, CreditCard, Trash2, Tag } from 'lucide-react';

const Cart = ({ cart, products, onCheckout }) => {
  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === id);
    return { ...product, quantity: qty };
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total > 0 ? 30000 : 0;
  const discount = total > 5000000 ? 500000 : 0; // Giảm 500k cho đơn trên 5M

  return (
    <div className="bg-[#1e293b] rounded-[2.5rem] p-8 sticky top-32 shadow-2xl border border-white/5">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-orange-500/20 p-3 rounded-2xl">
          <ShoppingCart className="text-orange-500" size={24} />
        </div>
        <h2 className="text-2xl font-black text-white italic">GIỎ HÀNG</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-500 font-light">Chưa có "deal" nào được chọn</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-white/5 group hover:border-orange-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-orange-500">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">{(item.price/1000000).toFixed(1)}M / cái</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-orange-400 text-sm">{(item.price * item.quantity / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 p-6 rounded-3xl space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tạm tính</span>
              <span className="text-white font-bold">{(total/1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Phí vận chuyển</span>
              <span className="text-green-400 font-bold">MIỄN PHÍ</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-orange-500 italic">
                   <Tag size={12} /> <span>SBA_WELCOME</span>
                </div>
                <span className="text-orange-500 font-bold">-{(discount/1000000).toFixed(1)}M</span>
              </div>
            )}
            <div className="pt-4 border-t border-white/5 flex justify-between">
              <span className="text-lg font-black text-white italic">TỔNG CỘNG</span>
              <span className="text-2xl font-black text-orange-500 italic truncate">
                {((total - discount)/1000000).toFixed(1)}M
              </span>
            </div>
          </div>

          <button 
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <CreditCard size={20} />
            THANH TOÁN NGAY
          </button>
        </>
      )}

      <div className="mt-8 flex items-center justify-center gap-2">
         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Dữ liệu Real-time qua Redis Data Grid
         </p>
      </div>
    </div>
  );
};

export default Cart;
