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
      text: `Halo! Saya asisten AI untuk SOP "${sop.judul}". Ada yang ingin ditanyakan tentang dokumen ini?`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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
        text: getBotResponse(message, sop),
        isBot: true,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage: string, sop: SOP) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('ringkasan') || msg.includes('apa isi')) {
      return `Ringkasan SOP ini: ${sop.ringkasan}`;
    }
    
    if (msg.includes('versi') || msg.includes('update')) {
      return `SOP ini saat ini versi ${sop.versi}, diunggah oleh ${sop.diunggah_oleh} pada ${sop.tanggal}.`;
    }
    
    if (msg.includes('kategori') || msg.includes('departemen')) {
      return `SOP ini termasuk kategori "${sop.kategori}" untuk departemen ${sop.departemen}.`;
    }
    
    if (msg.includes('tag')) {
      return `Tag yang terkait: ${sop.tag.join(', ')}`;
    }
    
    return `Terima kasih atas pertanyaannya tentang "${sop.judul}". Silakan lihat dokumen lengkap di viewer atau tanyakan hal spesifik lainnya.`;
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
          {/* Messages */}
          <div className="h-64 overflow-y-auto space-y-3 pr-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.isBot 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p>{msg.text}</p>
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