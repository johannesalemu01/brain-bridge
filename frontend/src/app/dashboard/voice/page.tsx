"use client";

import { useEffect, useState, useRef } from "react";
import { voiceApi } from "@/lib/api";
import { Mic, Globe, Loader2, Volume2, Save, Play, Square, Languages, ArrowRight, BrainCircuit } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
        toast.error(`Voice error: ${event.error}`);
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
      await fetchHistory();
      playAudio(data.data.aiResponse, language, data.data.session._id);
    } catch {
      toast.error("Failed to process question. Try typing if voice fails.");
    } finally {
      setProcessing(false);
      setTranscript("");
    }
  };

  const playAudio = (text: string, lang: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
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
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Voice Learning</h1>
          <p className="text-white/60">Multilingual AI Tutoring in Amharic & English.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl glass">
           <button 
             onClick={() => setLanguage("en")}
             className={cn(
               "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300",
               language === "en" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-white/40 hover:text-white"
             )}
           >
             ENG
           </button>
           <button 
             onClick={() => setLanguage("am")}
             className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                language === "am" ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "text-white/40 hover:text-white"
             )}
           >
             አማርኛ
           </button>
        </div>
      </div>

      <Card className="p-0 border-white/5 overflow-hidden">
        <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center relative min-h-[450px]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] -z-10" />
           
           {!isRecording && !processing && (
               <div className="mb-12 animate-in fade-in zoom-in-95 duration-500">
                   <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <Languages className="w-10 h-10 text-white/30" />
                   </div>
                   <h2 className="text-3xl font-bold text-white mb-3">
                       {language === 'am' ? "በአማርኛ ይጠይቁ" : "Ask Question by Voice"}
                   </h2>
                   <p className="text-white/40 text-lg max-w-sm mx-auto">Tap to speak. AI will explain naturally with audio.</p>
               </div>
           )}

           {isRecording && (
               <div className="mb-12 w-full max-w-2xl animate-in fade-in duration-300">
                   <div className="flex items-end justify-center gap-1.5 h-20 mb-10">
                       {[...Array(24)].map((_, i) => (
                           <div key={i} className="w-1.5 bg-teal-400 rounded-full animate-voice-pulse" style={{ animationDelay: `${i * 0.08}s` }} />
                       ))}
                   </div>
                   <p className="text-2xl text-white font-medium italic tracking-tight">"{transcript || "Listening to your question..."}"</p>
               </div>
           )}
           
           {processing && (
               <div className="mb-12 flex flex-col items-center justify-center min-h-[160px] animate-in fade-in duration-300">
                   <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-6" />
                        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-3 w-6 h-6 text-amber-400" />
                   </div>
                   <p className="text-amber-300 font-bold tracking-widest uppercase text-xs">AI Synthesis Processing...</p>
               </div>
           )}

           {!processing && (
               <button 
                 onClick={isRecording ? handleStopRecording : handleStartRecording}
                 className={cn(
                   "w-28 h-28 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/20 transition-all duration-500 cursor-pointer group active:scale-90",
                   isRecording 
                   ? 'bg-rose-500 hover:bg-rose-600 scale-110 shadow-rose-500/40' 
                   : 'bg-gradient-to-tr from-amber-600 to-orange-600 hover:scale-105'
                 )}
               >
                 {isRecording ? (
                   <Square className="w-10 h-10 text-white fill-white animate-pulse" />
                 ) : (
                   <Mic className={cn("w-12 h-12 text-white group-hover:scale-110 transition-transform", !isRecording && "drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]")} />
                 )}
               </button>
           )}

           {!isRecording && transcript && !processing && (
               <form onSubmit={handleManualSubmit} className="mt-12 w-full max-w-xl group relative animate-in slide-in-from-bottom-4 duration-500">
                   <input 
                     type="text" 
                     value={transcript}
                     onChange={e => setTranscript(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 pr-20 text-white text-lg focus:outline-none focus:border-amber-500/50 shadow-2xl transition-all"
                     placeholder="Type or edit your question..."
                   />
                   <Button type="submit" variant="premium" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl">
                       <ArrowRight className="w-6 h-6" />
                   </Button>
               </form>
           )}
        </div>
      </Card>

      <div className="mt-16">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Recent Sessions</h2>
         </div>
         
         {sessions.length === 0 ? (
             <Card className="p-12 text-center border-dashed border-white/10 bg-white/[0.02]">
                <p className="text-white/30 font-medium">No voice tutoring history found.</p>
             </Card>
         ) : (
             <div className="grid gap-6">
                 {sessions.map(s => (
                     <Card key={s._id} className="p-0 border-white/5 overflow-hidden hover:border-white/10 transition-colors">
                         <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                             <div className="flex-1 space-y-4">
                                 <div className="flex items-center gap-3">
                                     <span className={cn(
                                         "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                         s.language === 'am' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                     )}>
                                         {s.language === 'am' ? 'Amharic' : 'English'}
                                     </span>
                                     <span className="text-white/30 text-xs font-medium">{new Date(s.createdAt).toLocaleString()}</span>
                                 </div>
                                 <h3 className="text-xl font-bold text-white leading-tight underline decoration-white/0 decoration-2 underline-offset-4 group-hover:decoration-amber-500/50 transition-all">"{s.transcript}"</h3>
                                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5 relative group">
                                     <div className="flex items-center gap-2 mb-3 text-amber-400/60 font-bold text-[10px] uppercase tracking-widest">
                                         <BrainCircuit className="w-3.5 h-3.5" /> AI Explanation
                                     </div>
                                     <p className="text-white/80 leading-relaxed text-sm">{s.aiResponse}</p>
                                 </div>
                             </div>
                             
                             <div className="flex md:flex-col gap-3 justify-center min-w-[160px]">
                                 {speaking === s._id ? (
                                     <Button onClick={stopAudio} variant="destructive" className="w-full h-12 flex items-center gap-2 shadow-lg shadow-rose-500/20">
                                         <Square className="w-4 h-4 fill-current" /> Stop Audio
                                     </Button>
                                 ) : (
                                     <Button onClick={() => playAudio(s.aiResponse, s.language, s._id)} variant="secondary" className="w-full h-12 flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10">
                                         <Volume2 className="w-4 h-4" /> Listen Again
                                     </Button>
                                 )}
                                 
                                 <Button 
                                     onClick={() => handleSaveToQA(s._id)} 
                                     variant="outline" 
                                     disabled={s.savedToQA}
                                     className={cn(
                                         "w-full h-12 flex items-center gap-2 border-white/10 transition-all",
                                         s.savedToQA ? "opacity-50 pointer-events-none" : "text-teal-400 border-teal-500/20 hover:bg-teal-500/10 hover:border-teal-500/30"
                                     )}
                                 >
                                     <Save className="w-4 h-4" /> {s.savedToQA ? "Shared to Q&A" : "Share Feature"}
                                 </Button>
                             </div>
                         </div>
                     </Card>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
}
