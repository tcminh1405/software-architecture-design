import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Search, Bell, ShoppingCart, User } from 'lucide-react';

const Header = ({ cartCount, userId }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 mb-8 py-3">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">SBA FLASH</h1>
            <span className="text-[9px] text-orange-500 uppercase tracking-widest font-black">E-Commerce Elite</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-10">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm deal hot..." 
              className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer relative">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            
            <Link to="/cart" className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer relative group">
              <ShoppingCart size={20} className="text-slate-600 group-hover:text-orange-500" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">ID:</p>
              <p className="text-xs font-black text-slate-900">{userId}</p>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-slate-900/10">
              {userId.split('_')[1][0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
