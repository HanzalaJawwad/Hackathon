
import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

const getIntroMessage = (): Message => ({
  id: 0,
  text: "Hello! Welcome to the Smart Attendance System. I can help you understand how this facial recognition attendance system works. Ask me about registering students, taking attendance, checking history, or data management.",
  sender: 'bot'
});

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([getIntroMessage()]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    default: "I'm sorry, I don't have information about that. Try asking about registering students, taking attendance, viewing history, or data management.",
    greeting: ["Hello!", "Hi there!", "How can I help you today?"],
    "register": "To register students, go to the 'Register Students' tab. You'll need to take multiple photos of each student's face. These are used to train the facial recognition system.",
    "attendance": "To take attendance, go to the 'Take Attendance' tab and click 'Start Attendance'. The system will scan for faces and recognize registered students automatically. After 20 seconds of stopping attendance, logs are saved automatically.",
    "history": "The 'Attendance History' tab shows all past attendance records. You can view details by date, download reports, and see attendance statistics.",
    "backup": "In the 'Data Management' tab, you can backup all your data or restore from a previous backup. This ensures you never lose student registration or attendance information.",
    "how it works": "This system uses facial recognition technology to identify students. It compares faces in real-time video with pre-registered face data to mark attendance automatically."
  };

  const findBestResponse = (query: string): string => {
    query = query.toLowerCase();
    
    // Check for greetings
    if (/^(hi|hello|hey|greetings)/i.test(query)) {
      const randomIndex = Math.floor(Math.random() * botResponses.greeting.length);
      return botResponses.greeting[randomIndex];
    }
    
    // Check for keywords in the query
    if (query.includes('register') || query.includes('add student') || query.includes('new student')) {
      return botResponses.register;
    }
    if (query.includes('attendance') || query.includes('take attendance') || query.includes('record')) {
      return botResponses.attendance;
    }
    if (query.includes('history') || query.includes('past') || query.includes('record') || query.includes('log')) {
      return botResponses.history;
    }
    if (query.includes('backup') || query.includes('restore') || query.includes('data') || query.includes('management')) {
      return botResponses.backup;
    }
    if (query.includes('how') || query.includes('work') || query.includes('function')) {
      return botResponses["how it works"];
    }
    
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length,
      text: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate "typing" delay before bot responds
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 1,
        text: findBestResponse(input),
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 shadow-lg bg-attendance-primary hover:bg-attendance-primary/90" 
            size="icon"
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-[90%] max-w-[400px] h-[500px] mx-auto rounded-t-lg flex flex-col">
          <Card className="border-none shadow-none rounded-none h-full flex flex-col">
            <CardHeader className="px-4 py-3 flex flex-row items-center border-b">
              <Bot className="mr-2 h-5 w-5 text-attendance-primary" />
              <div>
                <h3 className="text-lg font-semibold">Attendance Assistant</h3>
                <p className="text-sm text-muted-foreground">Ask me about the system</p>
              </div>
              <DrawerClose className="ml-auto">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.sender === "user" 
                        ? "bg-attendance-primary text-white" 
                        : "bg-muted"
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="p-3 border-t">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ChatBot;
