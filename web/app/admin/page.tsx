"use client";

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para controlar o Modal (Janelinha)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', duration: '', price: '' });

  // 1. LER: Busca os serviços
  useEffect(() => {
    fetch('http://localhost:3000/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  // 2. EXCLUIR: Chama a rota DELETE
  const handleDelete = async (id: string) => {
    if(confirm("Deseja realmente excluir este serviço?")) {
      try {
        await fetch(`http://localhost:3000/services/${id}`, { method: 'DELETE' });
        // Atualiza a tela removendo o serviço excluído sem precisar dar F5
        setServices(services.filter(service => service.id !== id));
      } catch (error) {
        alert("Erro ao excluir serviço.");
      }
    }
  };

  // Prepara o modal para criar NOVO serviço
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', duration: '', price: '' });
    setIsModalOpen(true);
  };

  // Prepara o modal para EDITAR serviço existente
  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({ 
      name: service.name, 
      duration: String(service.duration), 
      price: String(service.price) 
    });
    setIsModalOpen(true);
  };

  // 3. SALVAR: Decide se chama POST (Novo) ou PATCH (Editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    
    // Converte os textos do formulário para números pro banco de dados
    const payload = {
      name: formData.name,
      duration: Number(formData.duration),
      price: Number(formData.price),
    };

    try {
      if (editingId) {
        // Rota PATCH: Editando
        await fetch(`http://localhost:3000/services/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        // Atualiza a lista na tela
        setServices(services.map(s => s.id === editingId ? { ...s, ...payload } : s));
      } else {
        // Rota POST: Criando novo
        const res = await fetch('http://localhost:3000/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const newService = await res.json();
        
        // Adiciona o novo serviço na tela
        setServices([...services, newService]);
      }
      setIsModalOpen(false); // Fecha o modal
    } catch (error) {
      alert("Erro ao salvar o serviço.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      
      {/* Header do Admin */}
      <nav className="w-full bg-zinc-950 text-white p-6 mb-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-teal-400">BarberHub</span> | Painel do Gestor
          </h1>
          <button 
            onClick={handleAddNew}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all"
          >
            <Plus size={18} /> Novo Serviço
          </button>
        </div>
      </nav>

      {/* Tabela de Serviços */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="p-4 font-bold text-zinc-600 text-sm">Serviço</th>
                <th className="p-4 font-bold text-zinc-600 text-sm">Duração</th>
                <th className="p-4 font-bold text-zinc-600 text-sm">Preço</th>
                <th className="p-4 font-bold text-zinc-600 text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Carregando...</td></tr>
              ) : services.map((service) => (
                <tr key={service.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 font-bold text-zinc-900">{service.name}</td>
                  <td className="p-4 text-zinc-600">{service.duration} min</td>
                  <td className="p-4 text-zinc-900 font-medium">R$ {Number(service.price).toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="p-2 text-zinc-400 hover:text-teal-600 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA ADICIONAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-zinc-100">
              <h2 className="font-bold text-lg text-zinc-900">
                {editingId ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Nome do Serviço</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-zinc-300 rounded-lg px-4 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  placeholder="Ex: Corte Degradê"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Duração (min)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full border border-zinc-300 rounded-lg px-4 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    placeholder="Ex: 30"
                  />
                </div>
                
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-zinc-300 rounded-lg px-4 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    placeholder="Ex: 45.00"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-teal-500 hover:bg-teal-600 transition-all flex items-center gap-2"
                >
                  <Save size={18} /> Salvar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </main>
  );
}