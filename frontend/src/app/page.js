'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Utensils, Plane, Zap, Film, Box, Trash2, Plus, Wallet, Edit3 } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [rates, setRates] = useState({ USD: 1, INR: 83, EUR: 0.92 });
  const [currency, setCurrency] = useState('USD');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    description: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] 
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/expenses/';

  const catConfig = {
    Food: { color: '#fb7185', bg: 'bg-rose-50', icon: <Utensils size={20} className="text-rose-500" /> },
    Travel: { color: '#60a5fa', bg: 'bg-blue-50', icon: <Plane size={20} className="text-blue-500" /> },
    Utilities: { color: '#fbbf24', bg: 'bg-amber-50', icon: <Zap size={20} className="text-amber-500" /> },
    Entertainment: { color: '#a78bfa', bg: 'bg-violet-50', icon: <Film size={20} className="text-violet-500" /> },
    Other: { color: '#94a3b8', bg: 'bg-slate-50', icon: <Box size={20} className="text-slate-500" /> },
  };

  const fetchData = async () => {
    try {
      const expRes = await axios.get(API_URL);
      if (Array.isArray(expRes.data)) {
        setExpenses(expRes.data);
      } else {
        console.error("Invalid data format:", expRes.data);
        setExpenses([]);
      }
      const rateRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setRates(rateRes.data.rates);
    } catch (error) { console.error("API Error:", error); setExpenses([]); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountInUSD = currency === 'USD' ? formData.amount : (parseFloat(formData.amount) / rates[currency]).toFixed(2);
    try {
      if (editingId) { await axios.put(`${API_URL}${editingId}/`, { ...formData, amount: amountInUSD }); setEditingId(null); }
      else { await axios.post(API_URL, { ...formData, amount: amountInUSD }); }
      setFormData({ description: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => { await axios.delete(`${API_URL}${id}/`); fetchData(); };
  const handleEdit = (exp) => { setFormData({ ...exp }); setCurrency('USD'); setEditingId(exp.id); };
  const convert = (amt) => (amt * rates[currency]).toLocaleString(undefined, { minimumFractionDigits: 2 });
  
  // Safe reduce
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const total = safeExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="min-h-screen bg-[#F1F5F9] px-6 py-12 flex flex-col items-center font-sans text-slate-900">
      <div className="w-full max-w-5xl space-y-10">
        <header className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
          <div className="bg-slate-900 px-10 py-8 flex justify-between items-center text-white">
            <div className="flex items-center gap-5">
               <div className="bg-indigo-600 p-3.5 rounded-2xl shadow-lg"><Wallet size={28}/></div>
               <div>
                  <h1 className="text-2xl font-black tracking-tight">ExpenseFlow</h1>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Total Spent: {currency} {convert(total)}</p>
               </div>
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-slate-800 px-5 py-2 rounded-xl font-bold text-sm outline-none border-none">
              <option value="USD">USD ($)</option><option value="INR">INR (₹)</option><option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="p-10 md:p-14">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-10 flex items-center gap-2">
               {editingId ? <Edit3 size={18} /> : <Plus size={18} />} {editingId ? 'Modify Record' : 'Quick Add Entry'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-full space-y-6">
                <div className="flex items-center gap-8">
                  <label className="w-32 text-[11px] font-black text-slate-400 uppercase">Description:</label>
                  <input type="text" placeholder="Rent, Groceries..." className="flex-1 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-200 outline-none font-bold text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                </div>
                <div className="flex items-center gap-8">
                  <label className="w-32 text-[11px] font-black text-slate-400 uppercase">Amount:</label>
                  <input type="number" step="0.01" className="flex-1 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-200 outline-none font-bold text-sm" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div className="flex items-center gap-8">
                  <label className="w-32 text-[11px] font-black text-slate-400 uppercase">Category:</label>
                  <select className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {Object.keys(catConfig).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="mt-8 bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                {editingId ? 'Update Record' : 'Confirm Entry'}
              </button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-white flex flex-col items-center h-[650px]">
            <h3 className="text-xl font-black text-slate-800 mb-12 self-start underline decoration-indigo-200 underline-offset-8">Analytics</h3>
            <div className="w-full max-w-[280px] relative mb-12">
              <Doughnut data={{
                labels: Object.keys(catConfig),
                datasets: [{
                  data: Object.keys(catConfig).map(c => safeExpenses.filter(e => e.category === c).reduce((s, x) => s + parseFloat(x.amount), 0)),
                  backgroundColor: Object.values(catConfig).map(v => v.color),
                  borderWidth: 0,
                }]
              }} options={{ plugins: { legend: { display: false } }, cutout: '82%' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report</span>
                <span className="text-lg font-black text-indigo-600">Insights</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-white flex flex-col h-[650px]">
            <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3 underline decoration-indigo-200 underline-offset-8">Recent History</h3>
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
              {safeExpenses.map(exp => {
                const config = catConfig[exp.category];
                return (
                  <div key={exp.id} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-50 hover:border-indigo-100 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center shadow-inner`}>{config.icon}</div>
                      <div>
                        <p className="font-bold text-slate-800 text-base leading-none mb-1">{exp.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{exp.category} • {exp.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-slate-900 text-sm">{currency} {convert(exp.amount)}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                         <button onClick={() => handleEdit(exp)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                         <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}