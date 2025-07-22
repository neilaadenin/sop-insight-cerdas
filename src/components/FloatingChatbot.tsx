import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { SOP } from '@/types/sop';

interface FloatingChatbotProps {
  sop: SOP;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ sop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Halo! Saya asisten AI untuk SOP "${sop.judul}". Silakan tanyakan apa saja tentang dokumen ini. Berikut beberapa pertanyaan yang bisa Anda ajukan:`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const samplePrompts = [
    "Apa saja langkah-langkah dalam SOP ini?",
    "Siapa saja PIC yang bertanggung jawab?",
    "Berapa lama waktu pelaksanaan prosedur ini?",
    "Apa tujuan utama dari SOP ini?"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(userMessage.text, sop),
        isBot: true,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getBotResponse = (userMessage: string, sop: SOP) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('langkah') || msg.includes('step') || msg.includes('proses')) {
      if (sop.judul.includes('Rekrutmen')) {
        return `Langkah-langkah dalam SOP Rekrutmen:\n1) Analisis kebutuhan SDM\n2) Posting lowongan\n3) Screening CV\n4) Interview HR dan User\n5) Background check\n6) Offering letter\n7) Onboarding\n\nSetiap tahap memiliki timeline dan PIC yang jelas.`;
      } else if (sop.judul.includes('Penggajian')) {
        return `Proses penggajian meliputi:\n1) Pengumpulan data kehadiran\n2) Kalkulasi gaji dan tunjangan\n3) Perhitungan potongan\n4) Review Finance Manager\n5) Transfer gaji\n6) Distribusi slip gaji\n7) Pelaporan pajak`;
      } else {
        return `Langkah-langkah utama dalam SOP ini mencakup persiapan dokumen, koordinasi dengan PIC terkait, eksekusi sesuai timeline, dan dokumentasi hasil.`;
      }
    }
    
    if (msg.includes('pic') || msg.includes('penanggung jawab') || msg.includes('siapa')) {
      if (sop.judul.includes('Rekrutmen')) {
        return `PIC yang bertanggung jawab:\n• HR Recruiter (screening dan interview awal)\n• Line Manager (interview user)\n• HR Generalist (onboarding)\n\nKoordinasi keseluruhan ditangani oleh Head of HR.`;
      } else if (sop.judul.includes('Penggajian')) {
        return `Tim yang terlibat:\n• Payroll Specialist (kalkulasi)\n• Finance Manager (review & approval)\n• Tax Officer (pelaporan pajak)\n• IT Support (sistem banking)`;
      } else {
        return `PIC utama adalah HR Generalist, IT Support, dan Line Manager. Setiap tahap memiliki koordinator yang bertanggung jawab.`;
      }
    }
    
    if (msg.includes('waktu') || msg.includes('berapa lama') || msg.includes('timeline')) {
      if (sop.judul.includes('Rekrutmen')) {
        return `Timeline maksimal 30 hari kerja dari posting hingga kandidat bergabung. Untuk posisi urgent bisa dipercepat dengan approval khusus Head of HR.`;
      } else if (sop.judul.includes('Penggajian')) {
        return `Proses payroll dimulai tanggal 1-20 setiap bulan, dengan transfer gaji maksimal tanggal 25. Pelaporan pajak dilakukan sebelum tanggal 10 bulan berikutnya.`;
      } else {
        return `Seluruh proses harus diselesaikan maksimal 7 hari kerja. Monitoring dilakukan selama 30 hari pertama untuk memastikan efektivitas.`;
      }
    }
    
    if (msg.includes('tujuan') || msg.includes('untuk apa') || msg.includes('kenapa')) {
      if (sop.judul.includes('Rekrutmen')) {
        return `Tujuan SOP ini adalah memastikan proses rekrutmen yang terstruktur, transparan, dan efisien untuk mendapatkan kandidat terbaik sesuai kebutuhan perusahaan.`;
      } else if (sop.judul.includes('Penggajian')) {
        return `SOP ini bertujuan memastikan proses payroll yang akurat, tepat waktu, dan sesuai dengan ketentuan perpajakan untuk menjaga kepuasan karyawan dan compliance perusahaan.`;
      } else {
        return `Tujuan utama adalah memastikan proses yang konsisten, efisien, dan dapat dipertanggungjawabkan di seluruh unit kerja.`;
      }
    }
    
    if (msg.includes('ringkasan') || msg.includes('apa isi')) {
      return `Ini adalah ringkasan lengkap SOP. Silakan cek panel "Ringkasan AI" di samping viewer untuk mendapatkan detail lengkap terstruktur.`;
    }
    
    if (msg.includes('versi') || msg.includes('update')) {
      return `SOP ini saat ini versi ${sop.versi}, diunggah oleh ${sop.diunggah_oleh} pada ${sop.tanggal}. Anda bisa melihat riwayat versi lengkap dengan klik tombol "Riwayat Versi".`;
    }
    
    return `Terima kasih atas pertanyaannya tentang "${sop.judul}". Coba tanyakan tentang langkah-langkah, PIC, timeline, atau tujuan SOP ini untuk mendapat jawaban yang lebih spesifik.`;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Bot className="w-4 h-4" />
              <span>Asisten SOP</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Sample Prompts */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          
          {/* Messages */}
          <div className="h-64 overflow-y-auto space-y-3 pr-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.isBot 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Tanyakan tentang SOP ini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingChatbot;