'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBudgetStore } from '@/store/budgetStore';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  PiggyBank, 
  Heart,
  Lightbulb,
  DollarSign,
  Target,
  Shield,
  History,
  Plus,
  Trash2,
  Menu,
  X
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  category?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to deserialize chat sessions from JSON
const deserializeChatSessions = (data: any): ChatSession[] => {
  if (!data || !data.sessions) return [];
  
  return data.sessions.map((session: any) => ({
    ...session,
    messages: session.messages.map((message: any) => ({
      ...message,
      timestamp: new Date(message.timestamp)
    })),
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt)
  }));
};

export default function WifeFinanceAssistant() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [promptCount, setPromptCount] = useState(0);
  const [longCooldownTime, setLongCooldownTime] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getBudgetSummary, getCategorySpending, transactions } = useBudgetStore();

  const genAI = new GoogleGenerativeAI('AIzaSyDW8D7wg5Q3TJU4j8qnV6ODwcCrWqbyGZM');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  // Get current session
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || null;
  const messages = currentSession?.messages || [];

  const [input, setInput] = useState('');
  
  // Load sessions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wife-finance-sessions');
        if (stored) {
          const parsed = JSON.parse(stored);
          const deserializedSessions = deserializeChatSessions(parsed);
          setSessions(deserializedSessions);
          setCurrentSessionId(parsed.currentSessionId || '');
        } else {
          // Create first session if none exists
          createNewSession();
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        createNewSession();
      }
    }
  }, []);

  // Save sessions to localStorage
  const saveSessions = (newSessions: ChatSession[], newCurrentSessionId: string) => {
    if (typeof window !== 'undefined') {
      try {
        const dataToSave = {
          sessions: newSessions,
          currentSessionId: newCurrentSessionId,
        };
        localStorage.setItem('wife-finance-sessions', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving sessions:', error);
      }
    }
  };

  // Create new session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Obrolan Baru ${sessions.length + 1}`,
      messages: [
        {
          id: '1',
          content: 'Halo! Saya Wife Finance, asisten keuangan pribadi Anda. Saya siap membantu memberikan saran edukatif tentang keuangan, investasi, dan perencanaan finansial. Ada yang bisa saya bantu hari ini?',
          role: 'assistant',
          timestamp: new Date(),
          category: 'welcome'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newSessions = [...sessions, newSession];
    setSessions(newSessions);
    setCurrentSessionId(newSession.id);
    saveSessions(newSessions, newSession.id);
    setIsHistoryOpen(false); // Close history on mobile
  };

  // Switch to existing session
  const switchSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    saveSessions(sessions, sessionId);
    setIsHistoryOpen(false); // Close history on mobile
  };

  // Delete session
  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (sessions.length <= 1) {
      // Don't delete the last session
      return;
    }

    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete session
  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;

    const newSessions = sessions.filter(s => s.id !== sessionToDelete);
    const newCurrentSessionId = sessionToDelete === currentSessionId 
      ? newSessions[0].id 
      : currentSessionId;

    setSessions(newSessions);
    setCurrentSessionId(newCurrentSessionId);
    saveSessions(newSessions, newCurrentSessionId);
    
    setSessionToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Delete all sessions
  const deleteAllSessions = () => {
    setDeleteAllDialogOpen(true);
  };

  // Confirm delete all sessions
  const confirmDeleteAllSessions = () => {
    createNewSession(); // This will replace all sessions with a new one
    setDeleteAllDialogOpen(false);
  };

  // Update session title based on first user message
  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    const newSessions = sessions.map(session => {
      if (session.id === sessionId && session.title.startsWith('Obrolan Baru')) {
        const title = firstMessage.length > 30 
          ? firstMessage.substring(0, 30) + '...' 
          : firstMessage;
        return { ...session, title, updatedAt: new Date() };
      }
      return session;
    });
    setSessions(newSessions);
    saveSessions(newSessions, currentSessionId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cooldown effect for 7 seconds per prompt
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  // Long cooldown effect for 1 minute after 12 prompts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (longCooldownTime > 0) {
      interval = setInterval(() => {
        setLongCooldownTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setPromptCount(0); // Reset prompt count after long cooldown
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [longCooldownTime]);

  const getFinancialContext = () => {
    const summary = getBudgetSummary();
    const categorySpending = getCategorySpending();
    
    return `
Konteks Keuangan Pengguna:
- Total Pemasukan: Rp ${summary.totalIncome.toLocaleString('id-ID')}
- Total Pengeluaran: Rp ${summary.totalExpense.toLocaleString('id-ID')}
- Saldo Saat Ini: Rp ${summary.balance.toLocaleString('id-ID')}
- Jumlah Transaksi: ${transactions.length}

Distribusi Pengeluaran per Kategori:
${categorySpending.filter(item => item.totalAmount > 0).map(item => 
  `- ${item.category.name}: Rp ${item.totalAmount.toLocaleString('id-ID')} (${item.percentage.toFixed(1)}%)`
).join('\n')}
    `.trim();
  };

  const generateFinancialPrompt = (userMessage: string): string => {
    const financialContext = getFinancialContext();
    
    return `Anda adalah Wife Finance, asisten keuangan pribadi yang ramah, cerdas, dan edukatif. Berikan saran keuangan yang praktis dan mudah dipahami.

Karakter Anda:
- Ramah seperti istri yang peduli dengan keuangan keluarga
- Cerdas dan berbasis data
- Memberikan saran edukatif tentang keuangan personal
- Fokus pada investasi, tabungan, dan perencanaan finansial
- Menggunakan bahasa Indonesia yang informal namun tetap profesional
- Memberikan contoh konkret dan actionable advice

${financialContext}

Pertanyaan pengguna: "${userMessage}"

Berikan jawaban yang:
1. Edukatif dan informatif
2. Berbasis data keuangan pengguna jika relevan
3. Praktis dan bisa langsung diterapkan
4. Ramah dan mendukung seperti istra yang peduli
5. Maksimal 3-4 paragraf
6. Gunakan emoji yang sesuai untuk membuatnya lebih menarik

Jawaban:`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !currentSessionId) return;

    // Check cooldowns
    if (cooldownTime > 0) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `Mohon tunggu ${cooldownTime} detik lagi sebelum mengirim pesan berikutnya. ⏰`,
        role: 'assistant',
        timestamp: new Date(),
        category: 'error'
      };
      
      // Update current session with error message
      const updatedSessions = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
            updatedAt: new Date()
          };
        }
        return session;
      });
      setSessions(updatedSessions);
      saveSessions(updatedSessions, currentSessionId);
      return;
    }

    if (longCooldownTime > 0) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `API sedang dalam cooldown istirahat. Mohon tunggu ${Math.floor(longCooldownTime / 60)} menit ${longCooldownTime % 60} detik lagi. 😴`,
        role: 'assistant',
        timestamp: new Date(),
        category: 'error'
      };
      
      // Update current session with error message
      const updatedSessions = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
            updatedAt: new Date()
          };
        }
        return session;
      });
      setSessions(updatedSessions);
      saveSessions(updatedSessions, currentSessionId);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message to current session
    const updatedSessionsWithUser = sessions.map(session => {
      if (session.id === currentSessionId) {
        const newMessages = [...session.messages, userMessage];
        // Update session title if this is the first user message
        if (newMessages.filter(m => m.role === 'user').length === 1) {
          updateSessionTitle(currentSessionId, input);
        }
        return {
          ...session,
          messages: newMessages,
          updatedAt: new Date()
        };
      }
      return session;
    });
    setSessions(updatedSessionsWithUser);
    saveSessions(updatedSessionsWithUser, currentSessionId);
    
    setInput('');
    setIsLoading(true);

    try {
      const prompt = generateFinancialPrompt(input);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: text,
        role: 'assistant',
        timestamp: new Date(),
        category: 'advice'
      };

      // Add assistant message to current session
      const updatedSessionsWithAssistant = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, assistantMessage],
            updatedAt: new Date()
          };
        }
        return session;
      });
      setSessions(updatedSessionsWithAssistant);
      saveSessions(updatedSessionsWithAssistant, currentSessionId);
      
      // Update prompt count and set cooldowns
      const newPromptCount = promptCount + 1;
      setPromptCount(newPromptCount);
      
      // Set 7 second cooldown for each prompt
      setCooldownTime(7);
      
      // Set 1 minute (60 seconds) cooldown after every 12 prompts
      if (newPromptCount % 12 === 0) {
        setLongCooldownTime(60);
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Maaf, saya mengalami kesulitan untuk merespons saat ini. Silakan coba lagi nanti ya! 🙏',
        role: 'assistant',
        timestamp: new Date(),
        category: 'error'
      };

      // Update current session with error message
      const updatedSessionsWithError = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, errorMessage],
            updatedAt: new Date()
          };
        }
        return session;
      });
      setSessions(updatedSessionsWithError);
      saveSessions(updatedSessionsWithError, currentSessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'welcome': return <Bot className="h-4 w-4" />;
      case 'advice': return <Lightbulb className="h-4 w-4" />;
      case 'investment': return <TrendingUp className="h-4 w-4" />;
      case 'savings': return <PiggyBank className="h-4 w-4" />;
      case 'budget': return <Target className="h-4 w-4" />;
      case 'error': return <Shield className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'welcome': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'advice': return 'bg-green-100 text-green-700 border-green-200';
      case 'investment': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'savings': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'budget': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const quickActions = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: 'Investasi',
      prompt: 'Beri saya saran investasi untuk pemula dengan modal terbatas',
      color: 'bg-purple-100 hover:bg-purple-200 text-purple-700'
    },
    {
      icon: <PiggyBank className="h-4 w-4" />,
      label: 'Tabungan',
      prompt: 'Bagaimana cara mengatur keuangan untuk menabung secara efektif?',
      color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: 'Anggaran',
      prompt: 'Analisa pengeluaran saya dan beri saran untuk mengatur anggaran',
      color: 'bg-orange-100 hover:bg-orange-200 text-orange-700'
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      label: 'Keuangan',
      prompt: 'Tips mengelola keuangan pribadi dengan bijak',
      color: 'bg-green-100 hover:bg-green-200 text-green-700'
    }
  ];

  // Format date for display
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return d.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  // History Sidebar Component
  const HistorySidebar = () => (
    <div className="w-80 h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <History className="h-5 w-5" />
            Riwayat Obrolan
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={createNewSession}
            className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Obrolan Baru
          </Button>
          
          {sessions.length > 1 && (
            <Button
              onClick={deleteAllSessions}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={`
                p-3 rounded-lg cursor-pointer transition-all duration-200 group
                ${session.id === currentSessionId
                  ? 'bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 border border-pink-300 dark:border-pink-700'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate mb-1">
                    {session.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(session.updatedAt)}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {session.messages.length} pesan
                  </p>
                </div>
                
                {sessions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile History Drawer
  const MobileHistoryDrawer = () => (
    <Drawer open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
        >
          <History className="h-4 w-4 mr-2" />
          Riwayat
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Riwayat Obrolan
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <Button
              onClick={createNewSession}
              className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Obrolan Baru
            </Button>
            
            {sessions.length > 1 && (
              <Button
                onClick={deleteAllSessions}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => switchSession(session.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 group
                    ${session.id === currentSessionId
                      ? 'bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 border border-pink-300 dark:border-pink-700'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate mb-1">
                        {session.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(session.updatedAt)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {session.messages.length} pesan
                      </p>
                    </div>
                    
                    {sessions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => deleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                Wife Finance Assistant
              </h1>
              <p className="text-lg text-muted-foreground">
                Asisten keuangan pribadi yang cerdas dan peduli 💕
              </p>
            </div>
            <MobileHistoryDrawer />
          </div>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Desktop History Sidebar */}
        <div className="hidden lg:block">
          <HistorySidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="grid gap-6">
            {/* Chat Area */}
            <div className="space-y-4">
              <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-md transition-all duration-300 hover:scale-110">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold truncate">{currentSession?.title || 'Konsultasi Keuangan'}</span>
                      <p className="text-sm text-muted-foreground font-normal">
                        Tanyakan apa saja tentang keuangan, investasi, dan perencanaan finansial
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <ScrollArea className="h-[500px] w-full rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex-shrink-0">
                              <div className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-rose-600">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getCategoryIcon(message.category)}
                              {message.category && (
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getCategoryColor(message.category)}`}
                                >
                                  {message.category}
                                </Badge>
                              )}
                              <span className="text-xs opacity-70">
                                {(() => {
                                  try {
                                    const timestamp = message.timestamp instanceof Date 
                                      ? message.timestamp 
                                      : new Date(message.timestamp);
                                    return timestamp.toLocaleTimeString('id-ID', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    });
                                  } catch (error) {
                                    console.error('Error formatting timestamp:', error);
                                    return '';
                                  }
                                })()}
                              </span>
                            </div>
                            <div className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                          {message.role === 'user' && (
                            <div className="flex-shrink-0">
                              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                                <User className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex-shrink-0">
                            <div className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-rose-600">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="max-w-[80%] rounded-2xl p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin h-4 w-4 border-2 border-pink-600 border-t-transparent rounded-full" />
                              <span className="text-sm text-muted-foreground">Wife Finance sedang berpikir...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="space-y-2">
                    {/* Cooldown Status */}
                    {(cooldownTime > 0 || longCooldownTime > 0) && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">
                            <Shield className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                            {longCooldownTime > 0 ? 'API Istirahat' : 'Cooldown Aktif'}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                          {longCooldownTime > 0 
                            ? `${Math.floor(longCooldownTime / 60)}:${(longCooldownTime % 60).toString().padStart(2, '0')}`
                            : `${cooldownTime}s`
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Prompt Counter */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Prompt digunakan: {promptCount}</span>
                      <span>Cooldown 12 prompt: {12 - (promptCount % 12)} lagi</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pertanyaan tentang keuangan..."
                        disabled={isLoading || cooldownTime > 0 || longCooldownTime > 0}
                        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-pink-300 disabled:opacity-50"
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={isLoading || !input.trim() || cooldownTime > 0 || longCooldownTime > 0}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg hover:scale-105"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:hidden">
              <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Sparkles className="h-5 w-5 text-pink-600" />
                    <span className="font-bold">Aksi Cepat</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Klik untuk bertanya tentang topik keuangan populer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => {
                        if (cooldownTime > 0 || longCooldownTime > 0) {
                          // Show cooldown message instead of setting input
                          const errorMessage: Message = {
                            id: Date.now().toString(),
                            content: longCooldownTime > 0 
                              ? `API sedang istirahat. Mohon tunggu ${Math.floor(longCooldownTime / 60)} menit ${longCooldownTime % 60} detik lagi. 😴`
                              : `Mohon tunggu ${cooldownTime} detik lagi sebelum menggunakan aksi cepat. ⏰`,
                            role: 'assistant',
                            timestamp: new Date(),
                            category: 'error'
                          };
                          
                          // Update current session with error message
                          const updatedSessions = sessions.map(session => {
                            if (session.id === currentSessionId) {
                              return {
                                ...session,
                                messages: [...session.messages, errorMessage],
                                updatedAt: new Date()
                              };
                            }
                            return session;
                          });
                          setSessions(updatedSessions);
                          saveSessions(updatedSessions, currentSessionId);
                          return;
                        }
                        
                        setInput(action.prompt);
                        setTimeout(() => {
                          const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                          if (inputElement) {
                            inputElement.focus();
                          }
                        }, 100);
                      }}
                      disabled={cooldownTime > 0 || longCooldownTime > 0}
                      className={`w-full justify-start gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 ${action.color}`}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden lg:block w-80 space-y-4">
          <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Sparkles className="h-5 w-5 text-pink-600" />
                <span className="font-bold">Aksi Cepat</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Klik untuk bertanya tentang topik keuangan populer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    if (cooldownTime > 0 || longCooldownTime > 0) {
                      // Show cooldown message instead of setting input
                      const errorMessage: Message = {
                        id: Date.now().toString(),
                        content: longCooldownTime > 0 
                          ? `API sedang istirahat. Mohon tunggu ${Math.floor(longCooldownTime / 60)} menit ${longCooldownTime % 60} detik lagi. 😴`
                          : `Mohon tunggu ${cooldownTime} detik lagi sebelum menggunakan aksi cepat. ⏰`,
                        role: 'assistant',
                        timestamp: new Date(),
                        category: 'error'
                      };
                      
                      // Update current session with error message
                      const updatedSessions = sessions.map(session => {
                        if (session.id === currentSessionId) {
                          return {
                            ...session,
                            messages: [...session.messages, errorMessage],
                            updatedAt: new Date()
                          };
                        }
                        return session;
                      });
                      setSessions(updatedSessions);
                      saveSessions(updatedSessions, currentSessionId);
                      return;
                    }
                    
                    setInput(action.prompt);
                    setTimeout(() => {
                      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (inputElement) {
                        inputElement.focus();
                      }
                    }, 100);
                  }}
                  disabled={cooldownTime > 0 || longCooldownTime > 0}
                  className={`w-full justify-start gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 ${action.color}`}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="font-bold">Tentang Wife Finance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>💕 <strong>Asisten Keuangan Pribadi</strong> yang selalu siap membantu Anda mengelola keuangan dengan bijak.</p>
                <p>🎯 <strong>Edukatif & Praktis</strong> - Memberikan saran yang bisa langsung Anda terapkan.</p>
                <p>📊 <strong>Berdasarkan Data</strong> - Analisis keuangan Anda untuk saran yang lebih personal.</p>
                <p>🤖 <strong>Powered by Google</strong> - Didukung AI canggih setara dengan gemini.</p>
                
                <Separator className="my-3" />
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="font-medium text-orange-700 dark:text-orange-300 mb-2">⏱️ <strong>Sistem Cooldown</strong></p>
                  <ul className="text-xs space-y-1 text-orange-600 dark:text-orange-400">
                    <li>• 7 detik jeda setiap 1 prompt</li>
                    <li>• 1 menit jeda setiap 12 prompt</li>
                    <li>• Melindungi penggunaan beban server agar tidak down</li>
                    <li>• Memastikan layanan stabil untuk semua pengguna</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialogs */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Obrolan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus obrolan "{sessions.find(s => s.id === sessionToDelete)?.title}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSession}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Semua Obrolan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus semua obrolan? Tindakan ini tidak dapat dibatalkan dan akan membuat obrolan baru.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAllSessions}>
              Hapus Semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}