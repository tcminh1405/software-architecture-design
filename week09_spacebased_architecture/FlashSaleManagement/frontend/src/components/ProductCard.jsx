import React from 'react';
import { Box, Star, Truck, Heart } from 'lucide-react';

const ProductCard = ({ product, stock, onAddToCart }) => {
  const maxStock = 50;
  const soldPercent = ((maxStock - stock) / maxStock) * 100;

  return (
    <div className="group bg-white border border-slate-100 rounded-[2rem] p-4 hover:border-orange-200 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 relative">
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-orange-600/30">
          -40%
        </span>
      </div>
      
      <button className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-xl text-slate-300 hover:text-red-500 transition-colors shadow-sm">
        <Heart size={18} fill="currentColor" />
      </button>

      <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] mb-6 flex items-center justify-center overflow-hidden relative">
         <Box className="text-slate-200 w-24 h-24 group-hover:scale-110 transition-transform duration-700" />
         <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-green-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-green-500/20">
               <Truck size={12} /> FREE SHIP
            </div>
         </div>
      </div>

      <div className="px-2">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-orange-400 text-orange-400" />)}
          <span className="text-[10px] text-slate-400 font-bold ml-1">4.9 (2.1k)</span>
        </div>

        <h3 className="text-lg font-black text-slate-800 mb-1 leading-tight group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-400 text-xs mb-4 font-medium">{product.description}</p>
        
        <div className="flex items-end gap-2 mb-6">
          <span className="text-2xl font-black text-slate-900">{(product.price/1000000).toFixed(1)}M</span>
          <span className="text-sm text-slate-300 line-through font-bold mb-1">{(product.price * 1.4 / 1000000).toFixed(1)}M</span>
        </div>

        <div className="mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
           <div className="flex justify-between text-[10px] mb-2 font-black">
              <span className="text-orange-600">ĐÃ BÁN {maxStock - stock}</span>
              <span className="text-slate-400">CHỈ CÒN {stock}</span>
           </div>
           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                 className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-1000" 
                 style={{ width: `${soldPercent}%` }}
              ></div>
           </div>
        </div>

        <button 
          onClick={() => onAddToCart(product.id)}
          disabled={stock <= 0}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${stock > 0 ? 'bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-1 active:translate-y-0' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
        >
          {stock > 0 ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
