import { useState } from 'react';
import {
  Plus, Search, ShoppingBag, Share2, TrendingUp, Package,
  MoreVertical, Eye, Pencil, Trash2, Send, X, Check,
} from 'lucide-react';
import { type Product } from '@/data/mockData';
import { useProducts } from '@/lib/hooks';

export default function Catalog() {
  const { list: products, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [preview, setPreview] = useState<Product | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const cats = Array.from(new Set(products.map((p) => p.category)));
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalShares = products.reduce((s, p) => s + p.shares, 0);
  const totalOrders = products.reduce((s, p) => s + p.orders, 0);
  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Total Products" value={products.length.toString()} />
        <MiniStat label="In Stock" value={inStockCount.toString()} />
        <MiniStat label="Catalog Shares" value={totalShares.toLocaleString()} />
        <MiniStat label="Orders via WhatsApp" value={totalOrders.toLocaleString()} />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
        <button className="bg-whatsapp-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCatFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
            !catFilter ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              catFilter === c ? 'bg-whatsapp-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group">
            <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              {!p.inStock && (
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <span className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg">Out of Stock</span>
                </div>
              )}
              {p.originalPrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {Math.round((1 - p.price / p.originalPrice) * 100)}% OFF
                </span>
              )}
              <div className="absolute top-2 right-2 relative">
                <button
                  onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                  className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center text-slate-500 hover:text-slate-700"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openMenu === p.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                    <div className="absolute right-0 top-9 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-32">
                      <button onClick={() => { setPreview(p); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => { deleteProduct(p.id); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="p-3">
              <span className="text-[10px] text-slate-400 font-medium">{p.category}</span>
              <p className="text-sm font-semibold text-slate-700 mt-0.5 line-clamp-1">{p.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-base font-bold text-slate-800">₹{p.price.toLocaleString()}</span>
                {p.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {p.shares} shares</span>
                <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {p.orders} orders</span>
              </div>
              <button className="mt-3 w-full bg-whatsapp-50 text-whatsapp-700 text-xs font-semibold py-2 rounded-lg hover:bg-whatsapp-100 transition flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Share on WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-400 mt-4">No products found</p>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/5] bg-slate-100">
              <img src={preview.image} alt={preview.name} className="w-full h-full object-cover" />
              <button onClick={() => setPreview(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <span className="text-xs text-slate-400 font-medium">{preview.category}</span>
              <h3 className="font-bold text-slate-800 text-lg mt-0.5">{preview.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl font-bold text-slate-800">₹{preview.price.toLocaleString()}</span>
                {preview.originalPrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through">₹{preview.originalPrice.toLocaleString()}</span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                      {Math.round((1 - preview.price / preview.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${preview.inStock ? 'text-whatsapp-600' : 'text-red-500'}`}>
                {preview.inStock ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                {preview.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <Share2 className="w-4 h-4 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 mt-1">{preview.shares}</p>
                  <p className="text-[10px] text-slate-400">WhatsApp Shares</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <ShoppingBag className="w-4 h-4 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 mt-1">{preview.orders}</p>
                  <p className="text-[10px] text-slate-400">Orders</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setPreview(null)} className="flex-1 text-sm font-medium text-slate-600 border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50">
                  Close
                </button>
                <button className="flex-1 text-sm font-semibold text-white bg-whatsapp-500 py-2.5 rounded-lg hover:bg-whatsapp-600 flex items-center justify-center gap-1.5">
                  <Send className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
