import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarFace from '../Avatar/AvatarFace';
import { useSpeech } from '../../hooks/useSpeech';
import { postApi } from '../../hooks/useApi';
import './ChatPanel.css';

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I'm MoneyMan, your AI wealth advisor. I've analyzed your financial behaviour over the last 6 months and have personalized insights ready. Ask me about your spending patterns, investment recommendations, risk profile, or financial goals!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarState, setAvatarState] = useState('idle');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { isSpeaking, isListening, transcript, mouthOpen, voiceSupported, startListening, stopListening, speak, stopSpeaking, setTranscript } = useSpeech();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update avatar state
  useEffect(() => {
    if (isLoading) setAvatarState('thinking');
    else if (isSpeaking) setAvatarState('speaking');
    else if (isListening) setAvatarState('listening');
    else setAvatarState('idle');
  }, [isLoading, isSpeaking, isListening]);

  // When transcript changes from voice input, update the text field
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text, timestamp: new Date().toISOString() }]);
    setInput('');
    setIsLoading(true);
    stopSpeaking();

    try {
      const res = await postApi('/api/chat', { message: text });
      if (res.success) {
        const assistantMsg = {
          role: 'assistant',
          text: res.data.message,
          relatedData: res.data.relatedData,
          timestamp: res.data.timestamp
        };
        setMessages(prev => [...prev, assistantMsg]);
        
        // Speak the response
        speak(res.data.message);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: "I'm sorry, I encountered an issue. Please try again.",
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I'm having trouble connecting. Please check your connection and try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      // Send after a short delay to capture final transcript
      setTimeout(() => {
        if (transcript) handleSend(transcript);
      }, 500);
    } else {
      stopSpeaking();
      setTranscript('');
      startListening();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "What's my risk profile?",
    "Show my spending trends",
    "Investment recommendations",
    "How are my goals doing?"
  ];

  return (
    <motion.div 
      className="chat-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Avatar header */}
      <div className="chat-avatar-section">
        <AvatarFace state={avatarState} mouthOpen={mouthOpen} size={120} />
        <div className="chat-avatar-name">MoneyMan</div>
        <div className="chat-avatar-status">
          {avatarState === 'idle' && 'Your AI Wealth Advisor'}
          {avatarState === 'thinking' && 'Analyzing your data...'}
          {avatarState === 'speaking' && 'Speaking...'}
          {avatarState === 'listening' && 'Listening to you...'}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              className={`chat-msg chat-msg-${msg.role}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              {msg.role === 'assistant' && (
                <div className="chat-msg-avatar-mini">
                  <span className="material-symbols-rounded" style={{ fontSize: 14, color: 'white' }}>psychology</span>
                </div>
              )}
              <div className="chat-msg-bubble">
                <div className="chat-msg-text">{msg.text}</div>
                <div className="chat-msg-time">
                  {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              className="chat-msg chat-msg-assistant"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="chat-msg-avatar-mini">
                <span className="material-symbols-rounded" style={{ fontSize: 14, color: 'white' }}>psychology</span>
              </div>
              <div className="chat-msg-bubble">
                <div className="chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="chat-quick-prompts">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              className="chat-quick-btn"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <div className="chat-input-container">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder={isListening ? 'Listening...' : 'Ask MoneyMan anything...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            id="chat-input"
          />
          {voiceSupported && (
            <button
              className={`chat-voice-btn ${isListening ? 'active' : ''}`}
              onClick={handleVoiceToggle}
              title={isListening ? 'Stop listening' : 'Voice input'}
              id="voice-toggle-btn"
            >
              <span className="material-symbols-rounded">
                {isListening ? 'mic' : 'mic_none'}
              </span>
              {isListening && <span className="voice-pulse" />}
            </button>
          )}
          <button
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            id="chat-send-btn"
          >
            <span className="material-symbols-rounded">send</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
