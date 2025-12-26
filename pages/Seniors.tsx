import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, MessageSquareQuote, BookOpen, Coffee, GraduationCap, Pencil, Leaf, Sparkles, Heart, Trash2, User, Loader2, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import messageApi, { SeniorMessageVO, MessageFont } from '../services/messageApi';

// Color shadow mapping
const COLOR_SHADOWS: Record<string, string> = {
  '#FFF8DC': '0 8px 30px -4px rgba(251, 191, 36, 0.4)',  // cream/yellow
  '#FFE4E1': '0 8px 30px -4px rgba(244, 114, 182, 0.4)', // pink
  '#E8F5E9': '0 8px 30px -4px rgba(74, 222, 128, 0.4)',  // green
  '#F5E6D3': '0 8px 30px -4px rgba(180, 140, 80, 0.35)', // kraft
};

// Random positions for scattered layout
const SCATTER_POSITIONS = [
  { rotate: -3, translateY: 0 },
  { rotate: 2, translateY: 8 },
  { rotate: -1, translateY: -4 },
  { rotate: 3, translateY: 12 },
  { rotate: -2, translateY: 4 },
  { rotate: 1, translateY: -8 },
  { rotate: -4, translateY: 6 },
  { rotate: 2, translateY: -2 },
];

// Default card colors for picker
const CARD_COLORS = ['#FFF8DC', '#FFE4E1', '#E8F5E9', '#F5E6D3'];
const INK_COLORS = ['#1a365d', '#2d3748', '#276749', '#744210'];

const Seniors: React.FC = () => {
  const [messages, setMessages] = useState<SeniorMessageVO[]>([]);
  const [myMessages, setMyMessages] = useState<SeniorMessageVO[]>([]);
  const [myMessagesLoaded, setMyMessagesLoaded] = useState(false);
  const [fonts, setFonts] = useState<MessageFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const PAGE_SIZE = 12;

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [signature, setSignature] = useState('');
  const [selectedCardColor, setSelectedCardColor] = useState(CARD_COLORS[0]);
  const [selectedInkColor, setSelectedInkColor] = useState(INK_COLORS[0]);
  const [selectedFontId, setSelectedFontId] = useState<number>(1);

  const [showMyMessages, setShowMyMessages] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // Fetch messages and fonts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [messagesRes, fontsRes] = await Promise.all([
          messageApi.getMessages(1, PAGE_SIZE),
          messageApi.getFonts(),
        ]);
        setMessages(messagesRes.data.records);
        setTotalMessages(messagesRes.data.total);
        setTotalPages(messagesRes.data.pages);
        setCurrentPage(1);
        setFonts(fontsRes.data);
        if (fontsRes.data.length > 0) {
          setSelectedFontId(fontsRes.data[0].id);
        }
      } catch (err) {
        setError('加载留言失败，请稍后重试');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Go to specific page - memoized
  const goToPage = useCallback(async (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    try {
      setLoading(true);
      const res = await messageApi.getMessages(page, PAGE_SIZE);
      setMessages(res.data.records);
      setCurrentPage(page);
      setTotalPages(res.data.pages);
      // Scroll to top of messages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load page:', err);
    } finally {
      setLoading(false);
    }
  }, [totalPages, currentPage]);

  const handleCreateMessage = async () => {
    if (!content.trim() || !isLoggedIn) return;

    try {
      setSubmitting(true);
      const response = await messageApi.createMessage({
        content: content.trim(),
        signature: signature.trim() || undefined,
        cardColor: selectedCardColor,
        inkColor: selectedInkColor,
        fontId: selectedFontId,
      });

      // Add new message to list
      setMessages(prev => [response.data as unknown as SeniorMessageVO, ...prev]);
      setContent('');
      setSignature('');
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Failed to create message:', err);
      alert('发布失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle like - memoized
  const handleToggleLike = useCallback(async (messageId: number) => {
    if (!isLoggedIn) {
      alert('请先登录后再点赞');
      return;
    }

    try {
      const response = await messageApi.toggleLike(messageId);
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, liked: !msg.liked, likeCount: response.data };
        }
        return msg;
      }));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  }, [isLoggedIn]);

  // Delete message - memoized
  const handleDeleteMessage = useCallback(async () => {
    if (!deleteMessageId) return;

    try {
      await messageApi.deleteMessage(deleteMessageId);
      // Remove from both lists
      setMessages(prev => prev.filter(msg => msg.id !== deleteMessageId));
      setMyMessages(prev => prev.filter(msg => msg.id !== deleteMessageId));
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('删除失败');
    } finally {
      setDeleteMessageId(null);
    }
  }, [deleteMessageId]);

  // Fetch my messages when switching to "my messages" view - memoized
  const fetchMyMessages = useCallback(async () => {
    if (myMessagesLoaded) return;
    try {
      setLoading(true);
      const res = await messageApi.getMyMessages(1, 100);
      setMyMessages(res.data.records);
      setMyMessagesLoaded(true);
    } catch (err) {
      console.error('Failed to fetch my messages:', err);
    } finally {
      setLoading(false);
    }
  }, [myMessagesLoaded]);

  // Handle show my messages toggle - memoized
  const handleShowMyMessages = useCallback(async (show: boolean) => {
    setShowMyMessages(show);
    if (show && isLoggedIn && !myMessagesLoaded) {
      await fetchMyMessages();
    }
  }, [isLoggedIn, myMessagesLoaded, fetchMyMessages]);

  // Display either all messages or my messages - memoized and filtered by search
  const displayedMessages = useMemo(() => {
    const baseMessages = showMyMessages ? myMessages : messages;
    if (!searchQuery.trim()) return baseMessages;
    const query = searchQuery.toLowerCase();
    return baseMessages.filter(msg =>
      msg.content.toLowerCase().includes(query) ||
      (msg.signature && msg.signature.toLowerCase().includes(query))
    );
  }, [showMyMessages, myMessages, messages, searchQuery]);

  // Format date - memoized
  const formatDate = useCallback((dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-zinc-950">

      {/* Decorative Doodles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top area */}
        <BookOpen className="absolute top-16 left-[5%] w-12 h-12 text-amber-200 dark:text-amber-800/30 rotate-[-15deg]" />
        <Leaf className="absolute top-32 left-[12%] w-8 h-8 text-green-200 dark:text-green-800/30 rotate-[20deg]" />
        <GraduationCap className="absolute top-20 right-[8%] w-14 h-14 text-pink-200 dark:text-pink-800/30 rotate-[10deg]" />
        <Coffee className="absolute top-40 right-[15%] w-10 h-10 text-orange-200 dark:text-orange-800/30 rotate-[-8deg]" />
        <Sparkles className="absolute top-24 left-[30%] w-6 h-6 text-yellow-200 dark:text-yellow-800/30 rotate-[15deg]" />
        <Heart className="absolute top-36 right-[30%] w-7 h-7 text-rose-200 dark:text-rose-800/30 rotate-[-10deg]" />

        {/* Middle area */}
        <Pencil className="absolute top-[35%] left-[3%] w-10 h-10 text-blue-200 dark:text-blue-800/30 rotate-[45deg]" />
        <Coffee className="absolute top-[45%] left-[6%] w-8 h-8 text-rose-200 dark:text-rose-800/30 rotate-[5deg]" />
        <BookOpen className="absolute top-[40%] right-[4%] w-9 h-9 text-cyan-200 dark:text-cyan-800/30 rotate-[-20deg]" />
        <GraduationCap className="absolute top-[55%] right-[6%] w-10 h-10 text-indigo-200 dark:text-indigo-800/30 rotate-[-12deg]" />
        <Leaf className="absolute top-[50%] left-[92%] w-7 h-7 text-emerald-200 dark:text-emerald-800/30 rotate-[30deg]" />
        <Sparkles className="absolute top-[38%] right-[2%] w-6 h-6 text-amber-200 dark:text-amber-800/30" />

        {/* Lower middle */}
        <Heart className="absolute top-[65%] left-[4%] w-8 h-8 text-pink-200 dark:text-pink-800/30 rotate-[8deg]" />
        <Pencil className="absolute top-[70%] right-[3%] w-9 h-9 text-violet-200 dark:text-violet-800/30 rotate-[-35deg]" />
        <Coffee className="absolute top-[60%] left-[8%] w-6 h-6 text-orange-200 dark:text-orange-800/30 rotate-[25deg]" />
        <BookOpen className="absolute top-[72%] left-[2%] w-7 h-7 text-teal-200 dark:text-teal-800/30 rotate-[18deg]" />

        {/* Bottom area */}
        <Pencil className="absolute bottom-32 left-[8%] w-10 h-10 text-blue-200 dark:text-blue-800/30 rotate-[45deg]" />
        <Sparkles className="absolute bottom-20 left-[18%] w-8 h-8 text-purple-200 dark:text-purple-800/30" />
        <BookOpen className="absolute bottom-28 right-[10%] w-10 h-10 text-teal-200 dark:text-teal-800/30 rotate-[12deg]" />
        <Leaf className="absolute bottom-48 right-[20%] w-6 h-6 text-lime-200 dark:text-lime-800/30 rotate-[-25deg]" />
        <GraduationCap className="absolute bottom-16 left-[25%] w-8 h-8 text-sky-200 dark:text-sky-800/30 rotate-[5deg]" />
        <Heart className="absolute bottom-24 right-[25%] w-7 h-7 text-red-200 dark:text-red-800/30 rotate-[-15deg]" />
        <Coffee className="absolute bottom-40 right-[5%] w-9 h-9 text-amber-200 dark:text-amber-800/30 rotate-[20deg]" />
        <Sparkles className="absolute bottom-12 right-[15%] w-5 h-5 text-yellow-200 dark:text-yellow-800/30 rotate-[10deg]" />
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex min-h-[calc(100vh-64px)]">

        {/* Left Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-200 dark:border-amber-500/10 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-200 dark:border-amber-500/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-100 to-pink-100 dark:from-amber-500/20 dark:to-pink-500/20 rounded-xl border border-amber-200 dark:border-amber-500/30 shadow-lg dark:shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                <MessageSquareQuote size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-800 dark:text-white">学长学姐留言板</h1>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/60">薪火相传</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">导航</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleShowMyMessages(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${!showMyMessages
                    ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                >
                  <MessageSquareQuote size={18} />
                  <span>全部留言</span>
                  <span className="ml-auto text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">{messages.length}</span>
                </button>
              </li>
              {isLoggedIn && (
                <li>
                  <button
                    onClick={() => handleShowMyMessages(true)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${showMyMessages
                      ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                      }`}
                  >
                    <User size={18} />
                    <span>我的留言</span>
                    <span className="ml-auto text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">{myMessages.length}</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* User Profile / Login + Add Button */}
          <div className="p-4 border-t border-zinc-200 dark:border-amber-500/10">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    U
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-800 dark:text-white truncate">已登录用户</p>
                    <p className="text-xs text-zinc-500">发布留言给学弟学妹</p>
                  </div>
                </div>
                {/* Add Message Button */}
                <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium text-sm shadow-lg shadow-amber-500/25 transition-all">
                      <Plus size={18} />
                      <span>发布新留言</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <Pencil size={20} className="text-amber-500" />
                        写一条留言
                      </DialogTitle>
                      <DialogDescription>分享你对学弟学妹的建议、祝福或校园生活贴士。</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="content">内容</Label>
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="分享学习技巧、校园生活贴士，或者一句鼓励的话..."
                          className="min-h-[120px] resize-none"
                          autoFocus
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signature">署名 (可选)</Label>
                        <Input
                          id="signature"
                          value={signature}
                          onChange={(e) => setSignature(e.target.value)}
                          placeholder="例如：24届 学姐"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>便签颜色</Label>
                          <div className="flex gap-2">
                            {CARD_COLORS.map(c => (
                              <button
                                key={c}
                                onClick={() => setSelectedCardColor(c)}
                                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedCardColor === c ? 'border-zinc-400 ring-2 ring-zinc-200 scale-110' : 'border-transparent hover:scale-105'}`}
                                style={{ backgroundColor: c, boxShadow: selectedCardColor === c ? COLOR_SHADOWS[c] : 'none' }}
                              >
                                {selectedCardColor === c && <Check size={14} className="text-black/40" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>墨水颜色</Label>
                          <div className="flex gap-2">
                            {INK_COLORS.map(c => (
                              <button
                                key={c}
                                onClick={() => setSelectedInkColor(c)}
                                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedInkColor === c ? 'border-zinc-400 ring-2 ring-zinc-200 scale-110' : 'border-transparent hover:scale-105'}`}
                                style={{ backgroundColor: c }}
                              >
                                {selectedInkColor === c && <Check size={14} className="text-white" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Font Selector */}
                      {fonts.length > 0 && (
                        <div className="space-y-2">
                          <Label>字体风格</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {fonts.map(f => (
                              <button
                                key={f.id}
                                onClick={() => setSelectedFontId(f.id)}
                                className={`p-3 rounded-lg border-2 transition-all text-center ${selectedFontId === f.id
                                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm'
                                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                                  }`}
                              >
                                <span className={`${f.cssClass} text-lg block`} style={{ color: selectedInkColor }}>
                                  {f.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditorOpen(false)}>取消</Button>
                      <Button
                        onClick={handleCreateMessage}
                        disabled={!content.trim() || submitting}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        贴上留言 ✨
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <a
                href="#/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
              >
                <User size={18} />
                <span>登录账号</span>
              </a>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 pb-32 max-w-6xl mx-auto">
            {/* Search Box - Modern Floating Style */}
            <div className="flex justify-center mb-8">
              <div className="relative w-full max-w-xl">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="搜索留言内容或署名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 h-12 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] focus:shadow-[0_4px_25px_-4px_rgba(251,191,36,0.25)] focus:border-amber-300 dark:focus:border-amber-500 transition-all duration-200"
                />
              </div>
            </div>

            {error ? (
              <div className="text-center py-16 text-red-500">{error}</div>
            ) : displayedMessages.length === 0 ? (
              <div className="text-center py-16 text-zinc-400">
                <MessageSquareQuote size={48} className="mx-auto mb-4 opacity-30" />
                <p>还没有留言</p>
                {isLoggedIn && <p className="text-sm mt-1">点击右下角的 + 按钮开始写留言吧！</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {displayedMessages.map((msg, idx) => {
                    const scatter = SCATTER_POSITIONS[idx % SCATTER_POSITIONS.length];
                    const shadow = COLOR_SHADOWS[msg.cardColor] || COLOR_SHADOWS['#FFF8DC'];
                    const fontClass = msg.font?.cssClass || 'font-mashan';

                    return (
                      <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: scatter.translateY,
                          rotate: scatter.rotate
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ scale: 1.03, rotate: 0, y: -4, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="group relative p-5 rounded-lg cursor-default"
                        style={{ backgroundColor: msg.cardColor, boxShadow: shadow }}
                      >
                        {/* Matte texture overlay */}
                        <div className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
                          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)' }}
                        />

                        {/* Delete button - only show in My Messages view */}
                        {isLoggedIn && showMyMessages && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteMessageId(msg.id); }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-100 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-200 transition-all z-10"
                            title="删除留言"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                        <div className={`relative ${fontClass} text-xl leading-relaxed`} style={{ color: msg.inkColor }}>
                          <p className="whitespace-pre-wrap min-h-[80px]">{msg.content}</p>
                          <div className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center text-sm font-sans">
                            <div className="opacity-60">
                              <span className="font-medium">{msg.signature || '匿名'}</span>
                              <span className="mx-2">·</span>
                              <span>{formatDate(msg.createdAt)}</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleLike(msg.id); }}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all ${msg.liked
                                ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
                                : 'text-zinc-400 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                                }`}
                            >
                              <Heart size={16} className={msg.liked ? 'fill-current' : ''} />
                              <span className="text-xs font-medium">{msg.likeCount}</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination - only show for all messages view when there are multiple pages */}
            {!showMyMessages && totalPages > 1 && messages.length > 0 && (
              <div className="flex justify-center mt-8 mb-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => goToPage(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {/* First page */}
                    {currentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis before current */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Previous page */}
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => goToPage(currentPage - 1)}>
                          {currentPage - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Current page */}
                    <PaginationItem>
                      <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>

                    {/* Next page */}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink onClick={() => goToPage(currentPage + 1)}>
                          {currentPage + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis after current */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last page */}
                    {currentPage < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => goToPage(totalPages)}>
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => goToPage(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Login hint for non-logged-in users */}
          {!isLoggedIn && (
            <div className="fixed bottom-8 right-8 z-50">
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-3 text-sm text-zinc-600 dark:text-zinc-300">
                <a href="#/login" className="text-amber-600 hover:underline">登录</a> 后可发布留言
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteMessageId !== null} onOpenChange={(open) => !open && setDeleteMessageId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定要删除这条留言吗？</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作无法撤销，留言将被永久删除。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteMessage}
                  className="bg-rose-500 hover:bg-rose-600"
                >
                  删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div >
    </div >
  );
};

export default Seniors;