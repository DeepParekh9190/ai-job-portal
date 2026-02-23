import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients } from '../../redux/slices/adminSlice';
import { 
  Building2, 
  Search, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Globe
} from 'lucide-react';
import Loader from '../../components/common/Loader';

const ManageClients = () => {
  const dispatch = useDispatch();
  const { clients, loading, pagination } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllClients({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-gold/10 text-gold border-gold/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading && clients.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gold/10 rounded-lg">
                <Building2 className="text-gold w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Global Partners</span>
            </div>
            <h1 className="text-4xl font-bold font-display text-white">Manage <span className="text-gold">Clients</span></h1>
            <p className="text-gray-400 mt-2">Oversee employer accounts, company data, and platform verification.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search companies or contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all"
            />
          </div>
        </header>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client._id} className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.08] transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Building2 size={120} />
               </div>

               <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-midnight-800 border border-white/10 flex items-center justify-center p-3">
                     {client.company?.logo?.url ? (
                        <img src={client.company.logo.url} alt="" className="w-full h-full object-contain" />
                     ) : (
                        <Building2 className="text-gray-600 w-8 h-8" />
                     )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(client.verificationStatus)}`}>
                    {client.verificationStatus}
                  </span>
               </div>

               <div className="mb-8 relative z-10">
                  <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{client.company?.name || client.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                     <span className="flex items-center gap-1.5 text-xs text-gray-400"><MapPin size={12} className="text-gray-600" /> {client.company?.location?.city || 'N/A'}</span>
                     <span className="flex items-center gap-1.5 text-xs text-gray-400"><Globe size={12} className="text-gray-600" /> {client.company?.industry || 'Others'}</span>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5 space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-gray-500 flex items-center gap-2"><Mail size={14} /> Contact Person</span>
                     <span className="text-gray-300 font-medium">{client.contactPerson?.name || client.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-gray-500 flex items-center gap-2"><ShieldCheck size={14} /> Active Jobs</span>
                     <span className="text-gold font-bold">{client.stats?.activeJobs || 0}</span>
                  </div>
               </div>

               <div className="mt-8 flex gap-3 relative z-10">
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                     <ExternalLink size={14} /> Profile
                  </button>
                  <button className="flex-1 py-3 bg-gold/10 border border-gold/20 rounded-xl text-xs font-bold text-gold hover:bg-gold hover:text-midnight-900 transition-all flex items-center justify-center gap-2">
                     Actions <ChevronRight size={14} />
                  </button>
               </div>

               {client.verificationStatus === 'pending' && (
                  <div className="absolute top-4 left-4">
                     <div className="bg-gold p-1 rounded-full animate-bounce">
                        <AlertCircle size={12} className="text-midnight-900" />
                     </div>
                  </div>
               )}
            </div>
          ))}
        </div>

        {clients.length === 0 && !loading && (
          <div className="py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
             <ShieldAlert size={64} className="text-gray-700 mx-auto mb-6" />
             <h3 className="text-2xl font-bold text-white mb-2">No clients found</h3>
             <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any enterprise accounts matching your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClients;
