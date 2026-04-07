import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, FileText, Scale, Clock, 
  AlertTriangle, Download, Trash2, Eye,
  CheckCircle2, AlertCircle, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Case {
  id: number;
  case_type: string;
  severity: string;
  question: string;
  next_step: string;
  expected_hearing: string;
  reminder_date: string;
  created_at: string;
}

interface Document {
  id: number;
  doc_type: string;
  content: string;
  created_at: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [casesRes, docsRes] = await Promise.all([
        api.get('/cases/my-cases'),
        api.get('/documents/my-documents')
      ]);
      setCases(casesRes.data);
      setDocs(docsRes.data);
    } catch (e) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const deleteCase = async (id: number) => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      await api.delete(`/cases/${id}`);
      toast.success("Case deleted");
      setCases(cases.filter(c => c.id !== id));
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const stats = [
    { label: 'Total Cases', value: cases.length, icon: Scale, color: 'text-neon-blue' },
    { label: 'Critical Cases', value: cases.filter(c => c.severity === 'CRITICAL').length, icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Documents', value: docs.length, icon: FileText, color: 'text-neon-gold' },
    { label: 'Days Active', value: '12', icon: Clock, color: 'text-green-400' },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">Welcome back, {user?.full_name}</h1>
            <p className="text-white/40">Manage your legal cases and documents in one place.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-6 py-3 flex items-center gap-3 border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-gold to-neon-blue" />
              <div>
                <p className="text-xs font-bold">{user?.full_name}</p>
                <p className="text-[10px] text-white/40">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 border-white/10 flex items-center gap-6"
            >
              <div className={`p-4 bg-white/5 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved Cases Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl">Saved Cases</h3>
                <CheckCircle2 className="w-5 h-5 text-neon-blue" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5">
                      <th className="px-6 py-4 font-bold">Case Type</th>
                      <th className="px-6 py-4 font-bold">Severity</th>
                      <th className="px-6 py-4 font-bold">Next Step</th>
                      <th className="px-6 py-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {cases.length > 0 ? cases.map((c) => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold">{c.case_type}</p>
                          <p className="text-[10px] text-white/40">{new Date(c.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <SeverityBadge severity={c.severity} />
                        </td>
                        <td className="px-6 py-4 text-white/60">{c.next_step}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-neon-blue"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => deleteCase(c.id)} className="p-2 hover:bg-white/5 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-white/20 italic">No cases saved yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar: Documents & Reminders */}
          <div className="space-y-8">
            <div className="glass p-6 border-white/10">
              <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neon-gold" />
                Recent Documents
              </h3>
              <div className="space-y-4">
                {docs.length > 0 ? docs.map((doc) => (
                  <div key={doc.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-white/40" />
                      <div>
                        <p className="text-xs font-bold">{doc.doc_type}</p>
                        <p className="text-[10px] text-white/30">{new Date(doc.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )) : (
                  <p className="text-xs text-white/20 italic">No documents generated.</p>
                )}
              </div>
            </div>

            <div className="glass p-6 border-white/10 border-red-400/20">
              <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-400" />
                Reminders
              </h3>
              <div className="space-y-4">
                {cases.filter(c => new Date(c.reminder_date) <= new Date()).map(c => (
                  <div key={c.id} className="p-4 bg-red-400/5 rounded-xl border border-red-400/10 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-400">Action Required</p>
                      <p className="text-[10px] text-white/60">Follow up on: {c.case_type}</p>
                    </div>
                  </div>
                ))}
                {cases.filter(c => new Date(c.reminder_date) <= new Date()).length === 0 && (
                  <p className="text-xs text-white/20 italic">No urgent reminders.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors: any = {
    CRITICAL: 'text-red-400 border-red-400/30 bg-red-400/10',
    HIGH: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    MEDIUM: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    LOW: 'text-green-400 border-green-400/30 bg-green-400/10',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${colors[severity] || colors.LOW}`}>
      {severity}
    </span>
  );
};

const DashboardSkeleton = () => (
  <div className="pt-32 pb-20 px-4 animate-pulse">
    <div className="max-w-7xl mx-auto">
      <div className="h-12 w-1/3 bg-white/5 rounded-lg mb-4" />
      <div className="h-4 w-1/4 bg-white/5 rounded-lg mb-12" />
      <div className="grid grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map(i => <div key={i} className="glass h-24 border-white/5" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 glass h-96 border-white/5" />
        <div className="glass h-96 border-white/5" />
      </div>
    </div>
  </div>
);

export default DashboardPage;
