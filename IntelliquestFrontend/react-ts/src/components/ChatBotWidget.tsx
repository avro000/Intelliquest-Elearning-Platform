"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bot, Send, X, Minimize2, User, Loader2, RefreshCw, Sparkles, ChevronDown } from "lucide-react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../AuthContext"

interface Message {
  id: string
  from: "user" | "bot"
  text: string
  timestamp: Date
  status: "sending" | "sent" | "error"
}

const ChatBotWidget: React.FC = () => {
  const location = useLocation()
  const { currentUser, profileImage } = useAuth()
  const userAvatarSrc = profileImage || currentUser?.profilePictureUrl || ""

  // Do not render chatbot on test/exam screen across all screen sizes
  if (location.pathname.startsWith("/play-quiz")) {
    return null
  }

  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Generate a unique ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 15)

  // Send greeting message automatically when chat opens
  useEffect(() => {
    if (open && !minimized) {
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: generateId(),
          from: "bot",
          text: "Hello there! I'm IntelliBot, your academic assistant on IntelliQuest. How can I assist you today?",
          timestamp: new Date(),
          status: "sent",
        }
        setMessages([welcomeMessage])
      }
      setUnreadCount(0)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [open, minimized, messages.length])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle new bot messages when minimized
  useEffect(() => {
    if (minimized && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.from === "bot" && lastMessage.status === "sent") {
        setUnreadCount((prev) => prev + 1)
      }
    }
  }, [messages, minimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleOpenChat = () => {
    setOpen(true)
    setMinimized(false)
    setUnreadCount(0)
  }

  const handleMinimize = () => {
    setMinimized(true)
  }

  const handleMaximize = () => {
    setMinimized(false)
    setUnreadCount(0)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  const handleClose = () => {
    setOpen(false)
    setMinimized(false)
  }

  const formatMessageText = (text: string) => {
    // Simple formatting: Bold text between **
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsgId = generateId()
    const userMsg: Message = {
      id: userMsgId,
      from: "user",
      text: input,
      timestamp: new Date(),
      status: "sending",
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    // Show typing indicator
    setTimeout(() => {
      setTypingIndicator(true)
    }, 500)

    try {
      // Update message status to sent
      setMessages((prev) => prev.map((msg) => (msg.id === userMsgId ? { ...msg, status: "sent" } : msg)))

      const res = await axios.post("http://localhost:5000/api/chat", { message: userMsg.text })

      // Hide typing indicator
      setTypingIndicator(false)

      const botMsg: Message = {
        id: generateId(),
        from: "bot",
        text: res.data.reply,
        timestamp: new Date(),
        status: "sent",
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      setTypingIndicator(false)

      const errorMsg: Message = {
        id: generateId(),
        from: "bot",
        text: "I'm having trouble connecting to my knowledge base. Please try again in a moment.",
        timestamp: new Date(),
        status: "error",
      }

      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const retryLastMessage = () => {
    // Find the last error message and retry
    const lastErrorIndex = [...messages].reverse().findIndex((msg) => msg.status === "error")
    if (lastErrorIndex >= 0) {
      const lastErrorMsg = messages[messages.length - 1 - lastErrorIndex]
      if (lastErrorMsg.from === "bot") {
        // If the error was from the bot, retry the last user message
        const lastUserIndex = [...messages].reverse().findIndex((msg) => msg.from === "user")
        if (lastUserIndex >= 0) {
          const lastUserMsg = messages[messages.length - 1 - lastUserIndex]
          setInput(lastUserMsg.text)
          // Remove the error message
          setMessages((prev) => prev.filter((msg) => msg.id !== lastErrorMsg.id))
        }
      }
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <motion.button
          onClick={handleOpenChat}
          aria-label="Open IntelliBot Chat"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3.5 sm:p-4 rounded-full shadow-2xl z-50 flex items-center justify-center cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Bot className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:right-6 w-[calc(100vw-24px)] sm:w-[400px] max-w-[calc(100vw-24px)] sm:max-w-[400px] h-[82dvh] sm:h-[560px] max-h-[calc(100dvh-24px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between rounded-t-2xl shadow-md shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8 bg-white/20 shrink-0">
                  <AvatarFallback className="bg-blue-700 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-tight truncate">IntelliBot</h3>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Academic Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
                        onClick={handleMinimize}
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimize</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
                        onClick={handleClose}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Close</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 sm:p-4 overflow-y-auto">
              <div className="space-y-3.5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} group`}>
                    {msg.from === "bot" && (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-2 mt-1 shrink-0 ring-1 ring-purple-500/20">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold">
                          <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[80%] ${
                        msg.from === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none border border-gray-200/50 dark:border-gray-700/50"
                      } px-3.5 py-2.5 sm:px-4 sm:py-2.5 shadow-sm break-words`}
                    >
                      <div className="text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }} />
                      <div
                        className={`text-[10px] mt-1 opacity-70 ${msg.from === "user" ? "text-right" : "text-left"}`}
                      >
                        {formatTime(msg.timestamp)}
                        {msg.status === "sending" && <span className="ml-1">• Sending...</span>}
                        {msg.status === "error" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 text-red-500 hover:text-red-400 p-0"
                            onClick={retryLastMessage}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {msg.from === "user" && (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ml-2 mt-1 shrink-0 ring-1 ring-blue-500/20">
                        {userAvatarSrc && <AvatarImage src={userAvatarSrc} alt="You" />}
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                          {currentUser?.username ? currentUser.username.slice(0, 2).toUpperCase() : <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {typingIndicator && (
                  <div className="flex justify-start">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-2 mt-1 shrink-0 ring-1 ring-purple-500/20">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold">
                        <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 sm:p-3.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm shrink-0 w-full max-w-full overflow-hidden">
              <div className="flex items-end gap-2 w-full max-w-full min-w-0">
                <div className="relative flex-1 min-w-0 max-w-[calc(100%-52px)] overflow-hidden">
                  <Textarea
                    ref={inputRef}
                    className="w-full max-w-full min-w-0 resize-none min-h-[44px] max-h-28 px-3.5 py-2.5 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm leading-relaxed break-all overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center mt-2 text-[11px] text-gray-400 dark:text-gray-500 select-none">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  Powered by IntelliQuest AI
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Chat */}
      <AnimatePresence>
        {open && minimized && (
          <motion.div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white dark:bg-gray-900 rounded-full shadow-2xl z-50 border border-gray-200 dark:border-gray-800 flex items-center"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleMaximize}
              variant="ghost"
              className="h-11 sm:h-12 rounded-full px-3.5 sm:px-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 cursor-pointer"
            >
              <Avatar className="h-6 w-6 bg-white/20">
                <AvatarFallback>
                  <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-xs sm:text-sm">IntelliBot</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 mr-1.5 cursor-pointer"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatBotWidget
