"use client";

import { useEffect, useState, useRef } from "react";
import { voiceApi } from "@/lib/api";
import { Mic, Globe, Loader2, Volume2, Save, Play, Square, Languages } from "lucide-react";
import toast from "react-hot-toast";

// Speech Recognition Type (Web Speech API)
const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

export default function VoicePage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("am"); // Default Amharic
  const [processing, setProcessing] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  
  const fetchHistory = async () => {
    try {
      const { data } = await voiceApi.getHistory();
      setSessions(data.data.sessions);
    } catch {
      // Handle error implicitly
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleStartRecording = () => {
    if (!SpeechRecognition) {
      toast.error("Voice recognition not supported in this browser. Try Chrome.");
      return;
    }
    
    setTranscript("");
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === "am" ? "am-ET" : "en-US";
    
    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };
    
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsRecording(false);
      if (event.error !== 'no-speech') {
        toast.error(\`Voice error: \${event.error}\`);
      }
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      // Automatically submit when done speaking
      if (recognitionRef.current?.submitOnEnd) {
        submitVoice(recognitionRef.current.finalText);
      }
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.submitOnEnd = true;
      recognitionRef.current.finalText = transcript;
      recognitionRef.current.stop();
    }
  };

  const submitVoice = async (textToSubmit: string) => {
    if (!textToSubmit.trim()) return;
    
    setProcessing(true);
    try {
      const { data } = await voiceApi.ask({
        transcript: textToSubmit,
        language
      });
      // After getting response, fetch history to show the new session
      await fetchHistory();
      // Auto-play response
      playAudio(data.data.aiResponse, language, data.data.session._id);
    } catch {
      toast.error("Failed to process question. Try typing if voice fails.");
    } finally {
      setProcessing(false);
      setTranscript("");
    }
  };

  // Text-to-Speech using Web Speech API
  const playAudio = (text: string, lang: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // Stop anything playing
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "am" ? "am-ET" : "en-US";
    
    utterance.onstart = () => setSpeaking(id);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setSpeaking(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(transcript) submitVoice(transcript);
  };

  const handleSaveToQA = async (id: string) => {
      try {
          await voiceApi.saveToQA(id);
          toast.success("Saved to public Q&A knowledge base!");
          fetchHistory();
      } catch {
          toast.error("Failed to save to Q&A");
      }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Voice Learning</h1>
          <p className="text-white/60">Ask questions naturally and get audio responses.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 glass rounded-xl">
           <button 
             onClick={() => setLanguage("en")}
             className={\`px-3 py-1.5 rounded-lg text-sm font-medium transition-all \${language === "en" ? "bg-violet-500 text-white" : "text-white/60 hover:text-white"}\`}
           >
             ENG
           </button>
           <button 
             onClick={() => setLanguage("am")}
             className={\`px-3 py-1.5 rounded-lg text-sm font-medium transition-all \${language === "am" ? "bg-cyan-500 text-white" : "text-white/60 hover:text-white"}\`}
           >
             አማርኛ
           </button>
           <Globe className="w-4 h-4 text-white/40 ml-2 mr-1" />
        </div>
      </div>

      {/* ── Main Voice Recorder Area ── */}
      <div className="glass p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -z-10" />
         
         {!isRecording && !processing && (
             <div className="mb-8">
                 <Languages className="w-16 h-16 text-white/20 mx-auto mb-4" />
                 <h2 className="text-2xl font-bold text-white mb-2">
                     {language === 'am' ? "እንዴት ልረዳዎት እችላለሁ?" : "How can I help you today?"}
                 </h2>
                 <p className="text-white/50">Tap the microphone and start speaking</p>
             </div>
         )}

         {isRecording && (
             <div className="mb-8 w-full max-w-2xl">
                 <div className="flex items-end justify-center gap-1 h-16 mb-8">
                     {[...Array(20)].map((_, i) => (
                         <div key={i} className="voice-bar" style={{ animationDelay: \`\${i * 0.1}s\` }} />
                     ))}
                 </div>
                 <p className="text-xl text-white font-medium italic">"{transcript || "Listening..."}"</p>
             </div>
         )}
         
         {processing && (
             <div className="mb-8 flex flex-col items-center justify-center h-48 w-full max-w-2xl">
                 <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
                 <p className="text-violet-300 font-medium">Generating AI Voice Answer...</p>
             </div>
         )}

         {!processing && (
             <button 
               onClick={isRecording ? handleStopRecording : handleStartRecording}
               className={\`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer \${
                 isRecording 
                   ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/50 animate-pulse' 
                   : 'bg-gradient-to-r from-violet-600 to-cyan-600 hover:scale-105 shadow-violet-500/30'
               }\`}
             >
               {isRecording ? <Square className="w-8 h-8 text-white fill-white" /> : <Mic className="w-10 h-10 text-white" />}
             </button>
         )}

         {!isRecording && transcript && !processing && (
             <form onSubmit={handleManualSubmit} className="mt-8 w-full max-w-xl group relative">
                 <input 
                   type="text" 
                   value={transcript}
                   onChange={e => setTranscript(e.target.value)}
                   className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 pr-16 text-white focus:outline-none focus:border-violet-500/50"
                 />
                 <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-500 rounded-lg text-white">
                     <ArrowRight className="w-5 h-5" />
                 </button>
             </form>
         )}
      </div>

      {/* ── History ── */}
      <div className="mt-12">
         <h2 className="text-xl font-bold text-white mb-6">Recent Conversations</h2>
         {sessions.length === 0 ? (
             <p className="text-white/40 italic">No voice history yet.</p>
         ) : (
             <div className="space-y-4">
                 {sessions.map(s => (
                     <div key={s._id} className="glass p-5 flex flex-col md:flex-row gap-5">
                         <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                 <span className={\`badge \${s.language === 'am' ? 'badge-cyan' : 'badge-purple'}\`}>
                                     {s.language === 'am' ? 'Amharic' : 'English'}
                                 </span>
                                 <span className="text-white/40 text-xs">{new Date(s.createdAt).toLocaleTimeString()}</span>
                             </div>
                             <p className="text-white font-medium mb-3 pl-4 border-l-2 border-white/10">"{s.transcript}"</p>
                             <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                 <p className="text-white/80 leading-relaxed text-sm">{s.aiResponse}</p>
                             </div>
                         </div>
                         <div className="flex md:flex-col gap-2 justify-end">
                             {speaking === s._id ? (
                                 <button onClick={stopAudio} className="btn-secondary px-3 py-2 flex items-center gap-2 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30">
                                     <Square className="w-4 h-4 fill-current" /> Stop
                                 </button>
                             ) : (
                                 <button onClick={() => playAudio(s.aiResponse, s.language, s._id)} className="btn-secondary px-3 py-2 flex items-center gap-2">
                                     <Volume2 className="w-4 h-4" /> Listen
                                 </button>
                             )}
                             {!s.savedToQA && (
                                 <button onClick={() => handleSaveToQA(s._id)} className="btn-secondary px-3 py-2 flex items-center gap-2 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/30">
                                     <Save className="w-4 h-4" /> Share to Q&A
                                 </button>
                             )}
                             {s.savedToQA && (
                                 <span className="inline-flex items-center gap-2 text-xs text-white/40 px-3 py-2">
                                     <Save className="w-3 h-3" /> Shared
                                 </span>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
}
