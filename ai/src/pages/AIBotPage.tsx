import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Paperclip, Scale, FileText, History, Trash2, 
  AlertCircle, CheckCircle2, Info, Clock, MapPin, 
  ChevronRight, Download, Copy, Save, X, Shield, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyzeLegalIssue, analyzeDocument, generateFIR, generateLegalNotice } from '../services/gemini';
import api from '../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useDropzone } from 'react-dropzone';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: any;
  type: 'text' | 'analysis' | 'doc_analysis' | 'document';
  timestamp: Date;
}

const AIBotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Welcome to Apna-Lawyer. I am your AI Public Defender. Describe your legal situation or upload a document for analysis.",
      type: 'text',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [docModal, setDocModal] = useState<{ title: string, content: string } | null>(null);
  const [history, setHistory] = useState<string[]>(JSON.parse(localStorage.getItem('lexai_history') || '[]'));
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change or analysis starts
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isAnalyzing]);

  // Prevent "rolling down" by ensuring the window doesn't scroll
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFile(acceptedFiles[0]);
    toast.success(`File ${acceptedFiles[0].name} ready for analysis`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false
  });

  const saveToHistory = (query: string) => {
    const newHistory = [query, ...history.filter(q => q !== query)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('lexai_history', JSON.stringify(newHistory));
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text || `Analyzing document: ${uploadedFile?.name}`,
      type: 'text',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAnalyzing(true);

    try {
      if (uploadedFile) {
        // In a real app, we'd extract text from PDF/Image here
        // For this demo, we'll simulate the text extraction
        const analysis = await analyzeDocument("Simulated extracted text from " + uploadedFile.name);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: analysis,
          type: 'doc_analysis',
          timestamp: new Date()
        }]);
        setUploadedFile(null);
      } else {
        saveToHistory(text);
        const analysis = await analyzeLegalIssue(text);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: analysis,
          type: 'analysis',
          timestamp: new Date()
        }]);
        
        // Save case to DB
        await api.post('/cases', {
          case_type: analysis.case_type,
          severity: analysis.severity,
          question: text,
          analysis_json: analysis,
          next_step: analysis.case_timeline.next_step,
          expected_hearing: analysis.case_timeline.expected_next_hearing,
          reminder_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateDoc = async (type: 'FIR' | 'Legal Notice', analysis: any) => {
    setIsGeneratingDoc(true);
    toast.loading(`Generating ${type}...`, { id: 'gen-doc' });
    try {
      const content = type === 'FIR' 
        ? await generateFIR(analysis) 
        : await generateLegalNotice(analysis);
      
      setDocModal({ title: `${type} Draft`, content });
      toast.success(`${type} generated!`, { id: 'gen-doc' });
    } catch (error: any) {
      toast.error(`Failed to generate ${type}`, { id: 'gen-doc' });
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const downloadDoc = () => {
    if (!docModal) return;
    const element = document.createElement("a");
    const file = new Blob([docModal.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${docModal.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    toast.success("Download started");
  };

  return (
    <div className="pt-20 h-screen flex flex-col md:flex-row gap-4 p-4 overflow-hidden bg-dark-base">
      {/* Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-4 h-full overflow-y-auto">
        <div className="glass p-6 border-white/10">
          <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-neon-blue" />
            Upload Evidence
          </h3>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-neon-blue bg-neon-blue/5' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <input {...getInputProps()} />
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-neon-gold" />
                <span className="text-xs truncate max-w-full">{uploadedFile.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-xs text-white/40">Drag & drop PDF or Images here</p>
            )}
          </div>
        </div>

        <div className="glass p-6 border-white/10 flex-1">
          <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-neon-gold" />
            Recent Queries
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.length > 0 ? history.map((q, i) => (
              <button 
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-2 glass glass-hover rounded-lg border-white/5 text-white/60 truncate max-w-full text-left"
              >
                {q}
              </button>
            )) : (
              <p className="text-xs text-white/30 italic">No recent queries</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass border-white/10 flex flex-col h-full relative overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-blue/20 rounded-lg">
              <Scale className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h2 className="font-bold">Apna-Lawyer Assistant</h2>
              <p className="text-xs text-neon-blue">Online & Ready</p>
            </div>
          </div>
        </div>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.type === 'text' ? (
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-neon-gold/10 border border-neon-gold/20' 
                      : 'bg-neon-blue/10 border border-neon-blue/20'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ) : msg.type === 'analysis' ? (
                  <AnalysisCard 
                    analysis={msg.content} 
                    onGenerateFIR={() => handleGenerateDoc('FIR', msg.content)}
                    onGenerateLegalNotice={() => handleGenerateDoc('Legal Notice', msg.content)}
                  />
                ) : (
                  <DocAnalysisCard analysis={msg.content} />
                )}
                <p className="text-[10px] text-white/30 mt-1 px-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isAnalyzing && <AnalysisSkeleton />}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-dark-surface/50">
          <div className="flex gap-4 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Describe your legal situation..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue/50 resize-none max-h-32"
                rows={1}
              />
            </div>
            <button 
              onClick={() => handleSend()}
              disabled={isAnalyzing || (!input.trim() && !uploadedFile)}
              className="p-3 bg-gradient-to-r from-neon-gold to-neon-blue rounded-xl text-dark-base disabled:opacity-50 transition-transform active:scale-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      <AnimatePresence>
        {docModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass w-full max-w-3xl max-h-[80vh] flex flex-col border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-gradient-gold">{docModal.title}</h3>
                <button onClick={() => setDocModal(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-white/5">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/80">
                  {docModal.content}
                </pre>
              </div>
              <div className="p-6 border-t border-white/10 flex gap-4">
                <button 
                  onClick={downloadDoc}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download as Text
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(docModal.content);
                    toast.success("Copied to clipboard");
                  }}
                  className="flex-1 btn-glass py-3 flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" /> Copy to Clipboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnalysisCard = ({ 
  analysis, 
  onGenerateFIR, 
  onGenerateLegalNotice 
}: { 
  analysis: any, 
  onGenerateFIR: () => void,
  onGenerateLegalNotice: () => void
}) => {
  const getSeverityColor = (s: string) => {
    switch (s) {
      case 'CRITICAL': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'HIGH': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      default: return 'text-green-400 border-green-400/30 bg-green-400/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 w-full max-w-2xl"
    >
      {/* Header Card */}
      <div className="glass p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getSeverityColor(analysis.severity)}`}>
            ⚡ {analysis.severity} SEVERITY
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"><Save className="w-4 h-4" /></button>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-serif font-bold mb-2 flex items-center gap-3">
            <div className="p-2 bg-neon-blue/20 rounded-lg">
              <Scale className="w-6 h-6 text-neon-blue" />
            </div>
            {analysis.case_type}
          </h3>
          <div className="p-4 bg-neon-gold/5 border border-neon-gold/10 rounded-xl mb-4">
            <p className="text-sm font-bold text-neon-gold flex items-center gap-2">
              <Info className="w-4 h-4" /> Quick Summary:
            </p>
            <p className="text-sm text-white/90 mt-1">{analysis.simple_summary || analysis.explanation.split('.')[0] + '.'}</p>
          </div>
          <p className="text-sm text-white/60 italic leading-relaxed">"{analysis.explanation}"</p>
        </div>
      </div>

      {/* Step-by-Step Roadmap Card */}
      <div className="glass p-6 border-white/10">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neon-blue" /> Your Legal Roadmap
        </h4>
        <div className="space-y-6 relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/5" />
          {analysis.court_guidance.step_by_step.map((step: string, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 relative z-10"
            >
              <div className="w-8 h-8 rounded-full bg-dark-base border-2 border-neon-blue flex items-center justify-center text-xs font-bold text-neon-blue shrink-0 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                {i + 1}
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex-1 hover:border-white/10 transition-colors">
                <p className="text-sm text-white/80 leading-relaxed">{step}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Laws Card */}
        <div className="glass p-5 border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon-gold" /> Relevant Laws
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.laws.map((law: string, i: number) => (
              <span key={i} className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 text-white/70 rounded-lg">
                {law}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements Card */}
        <div className="glass p-5 border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-neon-blue" /> Documents Needed
          </h4>
          <ul className="space-y-2">
            {analysis.court_guidance.documents_required.map((doc: string, i: number) => (
              <li key={i} className="text-xs text-white/60 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-neon-blue" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeline & Action Card */}
      <div className="glass p-6 border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-gold/10 rounded-xl">
              <Clock className="w-6 h-6 text-neon-gold" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold">Next Immediate Step</p>
              <p className="text-sm font-bold text-white">{analysis.case_timeline.next_step}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:text-right md:flex-row-reverse">
            <div className="p-3 bg-neon-blue/10 rounded-xl">
              <Calendar className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold">Expected Timeline</p>
              <p className="text-sm font-bold text-neon-blue">{analysis.case_timeline.expected_next_hearing}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-3">
          <button 
            onClick={onGenerateFIR}
            className="flex-1 btn-primary py-3 text-xs flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Generate FIR
          </button>
          <button 
            onClick={onGenerateLegalNotice}
            className="flex-1 btn-glass py-3 text-xs flex items-center justify-center gap-2"
          >
            <Scale className="w-4 h-4" /> Legal Notice
          </button>
        </div>

        <p className="text-[8px] text-white/20 text-center uppercase tracking-widest leading-relaxed">
          {analysis.disclaimer}
        </p>
      </div>
    </motion.div>
  );
};

const DocAnalysisCard = ({ analysis }: { analysis: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 border-white/10 space-y-4 w-full max-w-2xl"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-neon-gold/20 rounded-lg">
          <FileText className="w-5 h-5 text-neon-gold" />
        </div>
        <h3 className="font-bold">Document Analysis: {analysis.document_type}</h3>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">{analysis.summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase text-white/40">Key Points</h4>
          <ul className="space-y-1">
            {analysis.key_legal_points.map((p: string, i: number) => (
              <li key={i} className="text-xs text-white/60 flex gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase text-white/40">Risks Identified</h4>
          <ul className="space-y-1">
            {analysis.risks.map((r: string, i: number) => (
              <li key={i} className="text-xs text-red-400/80 flex gap-2">
                <AlertCircle className="w-3 h-3 mt-0.5" /> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const AnalysisSkeleton = () => (
  <div className="glass p-6 border-white/10 space-y-6 w-full max-w-2xl animate-pulse">
    <div className="flex justify-between">
      <div className="h-6 w-32 bg-white/5 rounded-full" />
      <div className="h-6 w-16 bg-white/5 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="h-8 w-3/4 bg-white/5 rounded-lg" />
      <div className="h-4 w-full bg-white/5 rounded-lg" />
      <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
    </div>
    <div className="flex gap-2">
      {[1, 2, 3].map(i => <div key={i} className="h-6 w-20 bg-white/5 rounded-full" />)}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-white/5 rounded-xl" />
      <div className="h-24 bg-white/5 rounded-xl" />
    </div>
    <div className="text-center text-[10px] text-white/10">Apna-Lawyer is analyzing your case...</div>
  </div>
);

export default AIBotPage;
