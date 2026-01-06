import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  senderId: 'me' | 'other';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  contactName: string;
  contactInitial: string;
  verified?: boolean;
  onBack: () => void;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Привет! Как дела?',
    senderId: 'other',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read'
  },
  {
    id: 2,
    text: 'Привет! Всё отлично, спасибо! А у тебя как?',
    senderId: 'me',
    timestamp: new Date(Date.now() - 3000000),
    status: 'read'
  },
  {
    id: 3,
    text: 'Тоже хорошо! Вижу, ты любишь путешествия. Куда недавно ездила?',
    senderId: 'other',
    timestamp: new Date(Date.now() - 2400000),
    status: 'read'
  },
  {
    id: 4,
    text: 'Да, обожаю! Недавно была в Грузии, невероятная страна 🏔️',
    senderId: 'me',
    timestamp: new Date(Date.now() - 1800000),
    status: 'read'
  },
  {
    id: 5,
    text: 'Ого, здорово! Давно хочу туда съездить. Что посоветуешь посмотреть?',
    senderId: 'other',
    timestamp: new Date(Date.now() - 900000),
    status: 'read'
  }
];

export default function ChatWindow({ contactName, contactInitial, verified, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue.trim(),
      senderId: 'me',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg)
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg)
      );
    }, 1500);

    simulateResponse();
  };

  const simulateResponse = () => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Интересно! Расскажи поподробнее 😊',
        'Звучит круто!',
        'Я тоже так думаю',
        'Может встретимся как-нибудь?',
        'Ты такая интересная! 💕'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        senderId: 'other',
        timestamp: new Date(),
        status: 'read'
      };

      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'только что';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
    if (diff < 86400000) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>

        <Avatar className="w-10 h-10 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
            {contactInitial}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">{contactName}</h2>
            {verified && (
              <Icon name="BadgeCheck" size={16} className="text-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isTyping ? 'печатает...' : 'в сети'}
          </p>
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Icon name="MoreVertical" size={20} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`max-w-[75%] ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                {message.senderId === 'other' && (
                  <Avatar className="w-8 h-8 mb-1">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                      {contactInitial}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    message.senderId === 'me'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                      : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                </div>

                <div className={`flex items-center gap-1 mt-1 px-2 ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.senderId === 'me' && message.status && (
                    <Icon
                      name={message.status === 'read' ? 'CheckCheck' : 'Check'}
                      size={14}
                      className={message.status === 'read' ? 'text-primary' : 'text-muted-foreground'}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-secondary rounded-2xl px-4 py-3 rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="bg-white border-t p-4 sticky bottom-0">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-full mb-1">
            <Icon name="Plus" size={20} />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Напишите сообщение..."
              className="pr-20 rounded-full border-2 focus-visible:ring-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Icon name="Smile" size={18} />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={inputValue.trim() === ''}
            className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 mb-1"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Будьте вежливы и уважительны 💕
        </p>
      </div>
    </div>
  );
}
