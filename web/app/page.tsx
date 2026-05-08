"use client";

import { useEffect, useState } from 'react';
import { Clock, Banknote, CalendarCheck, X, Search, CalendarDays } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Appointment {
  id: string;
  name: string;
  date: string;
  time: string;
  service: { name: string };
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal de NOVO Agendamento
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '' });

  // Estados do Modal de VER Agendamentos
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [checkPhone, setCheckPhone] = useState('');
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // 1. SALVAR AGENDAMENTO NO BANCO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceId: selectedService?.id
        }),
      });

      if (res.ok) {
        alert("✅ Agendamento realizado com sucesso!");
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', date: '', time: '' });
      }
    } catch (error) {
      alert("Erro ao salvar agendamento.");
    }
  };

  // 2. BUSCAR AGENDAMENTOS POR TELEFONE
  const handleCheckAppointments = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:3000/appointments?phone=${checkPhone}`);
      const data = await res.json();
      setUserAppointments(data);
    } catch (error) {
      alert("Erro ao buscar agendamentos.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] pb-20">
      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-gray-100 mb-8 shadow-sm text-center">
        <div className="max-w-[800px] mx-auto px-6 py-4 flex justify-between items-center">
          <img src="/BarberHub_Logo.png" alt="Logo" className="h-10 w-auto" />
          <button 
            onClick={() => setIsMyAppointmentsOpen(true)}
            className="bg-[#00c2a8] hover:bg-[#00a892] text-white text-[11px] font-bold py-2 px-5 rounded-md uppercase transition-all shadow-sm active:scale-95"
          >
            Meus agendamentos
          </button>
        </div>
      </nav>

      <div className="max-w-[600px] mx-auto px-6">
        {/* HEADER PERFIL */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-full border border-gray-100 overflow-hidden shadow-sm bg-white">
             <img src="/logo_cliente.png" alt="San Marco" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] text-gray-400 font-medium mb-1">Seja bem vindo(a) ao</p>
            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tighter">San Marco</h1>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-6 text-zinc-900 uppercase">Serviços</h2>

        {/* LISTA DE SERVIÇOS */}
        <div className="flex flex-col gap-4">
          {loading ? <p className="text-center text-gray-400 italic">Carregando...</p> : services.map((service) => (
            <div key={service.id} className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl flex justify-between items-center group hover:bg-zinc-100 transition-all">
              <div className="space-y-3">
                <h3 className="font-bold text-[17px] text-zinc-950">{service.name}</h3>
                <div className="space-y-1.5 text-[14px] font-medium text-zinc-700">
                  <div className="flex items-center gap-3"><Clock size={16} /> {service.duration} min</div>
                  <div className="flex items-center gap-3"><Banknote size={16} /> a partir de R$ {Number(service.price).toFixed(2).replace('.', ',')}</div>
                </div>
              </div>
              <button onClick={() => handleOpenModal(service)} className="bg-[#00c2a8] hover:bg-[#00a892] text-white font-bold text-[13px] py-3 px-7 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95">
                <CalendarCheck size={19} /> Reservar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL NOVO AGENDAMENTO */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b bg-zinc-50">
              <div>
                <h2 className="font-bold text-lg">Agendar {selectedService.name}</h2>
                <p className="text-sm text-teal-600 font-medium">R$ {Number(selectedService.price).toFixed(2)}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-800"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" required placeholder="Seu Nome" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#00c2a8]" />
              <input type="tel" required placeholder="WhatsApp (ex: 11999999999)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#00c2a8]" />
              <div className="flex gap-4">
                <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-3/5 border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#00c2a8]" />
                <input type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-2/5 border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#00c2a8]" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-[#00c2a8] hover:bg-[#00a892] shadow-lg">Confirmar Reserva</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MEUS AGENDAMENTOS (AGORA COM RESULTADOS) */}
      {isMyAppointmentsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b bg-zinc-50 flex justify-between items-center">
              <h2 className="font-bold text-lg">Meus Agendamentos</h2>
              <button onClick={() => { setIsMyAppointmentsOpen(false); setUserAppointments([]); setCheckPhone(''); }} className="text-zinc-400 hover:text-zinc-800"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCheckAppointments} className="p-5 border-b flex gap-2">
              <input 
                type="tel" 
                required 
                placeholder="Seu WhatsApp" 
                value={checkPhone}
                onChange={(e) => setCheckPhone(e.target.value)}
                className="flex-1 border border-zinc-300 rounded-lg px-4 py-2 outline-none focus:border-[#00c2a8]" 
              />
              <button type="submit" className="bg-zinc-900 text-white p-2.5 rounded-lg hover:bg-black transition-all">
                {isSearching ? '...' : <Search size={20} />}
              </button>
            </form>

            <div className="p-5 overflow-y-auto space-y-3">
              {userAppointments.length > 0 ? userAppointments.map((app) => (
                <div key={app.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
                  <p className="font-bold text-zinc-900">{app.service.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-zinc-600 font-medium">
                    <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-[#00c2a8]" /> {app.date.split('-').reverse().join('/')}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#00c2a8]" /> {app.time}</span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-zinc-400 text-sm py-10">
                  {checkPhone ? "Nenhum horário encontrado para este número." : "Digite seu número para consultar seus horários."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}