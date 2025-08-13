"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface FloatingChatbotProps {
  sop?: any; // Make sop optional
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ sop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Halo! Saya asisten AI untuk SOP. Silakan tanyakan apa saja tentang dokumen SOP yang tersedia. Berikut beberapa pertanyaan yang bisa Anda ajukan:`,
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
        text: getBotResponse(userMessage.text),
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

  const getBotResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('langkah') || msg.includes('step') || msg.includes('proses')) {
      return `Langkah-langkah dalam SOP:\n1) Analisis kebutuhan\n2) Persiapan dokumen\n3) Koordinasi dengan PIC terkait\n4) Eksekusi sesuai timeline\n5) Dokumentasi hasil\n\nSetiap tahap memiliki timeline dan PIC yang jelas.`;
    }
    
    if (msg.includes('pic') || msg.includes('penanggung jawab') || msg.includes('siapa')) {
      return `PIC yang bertanggung jawab:\n• HR Generalist\n• IT Support\n• Line Manager\n\nKoordinasi keseluruhan ditangani oleh Manager terkait.`;
    }
    
    if (msg.includes('waktu') || msg.includes('berapa lama') || msg.includes('timeline')) {
      return `Timeline maksimal 7 hari kerja untuk proses standar. Untuk proses urgent bisa dipercepat dengan approval khusus Manager.`;
    }
    
    if (msg.includes('tujuan') || msg.includes('untuk apa') || msg.includes('kenapa')) {
      return `Tujuan utama SOP adalah memastikan proses yang terstruktur, konsisten, dan efisien di seluruh unit kerja. SOP membantu mengurangi kesalahan dan meningkatkan produktivitas.`;
    }
    
    return `Terima kasih atas pertanyaannya. Saya akan membantu Anda memahami SOP yang tersedia. Silakan ajukan pertanyaan lebih spesifik atau pilih dari prompt yang tersedia.`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-4 z-50">
          <Card className="w-96 h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <span>AI Assistant</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 max-h-64">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.isBot
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Prompts */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Pertanyaan cepat:</p>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick(prompt)}
                      className="text-xs h-auto py-1 px-2"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Ketik pesan..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;