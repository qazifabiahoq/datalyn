import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Sidebar from '@/components/Sidebar';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const exampleQuestions = [
    "Why did MRR drop last week?",
    "What's my biggest revenue risk this month?",
    "Which user segment has the highest churn?"
  ];

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat/message`, {
        message: messageText,
        session_id: sessionId
      });

      const { session_id, message } = response.data;
      if (!sessionId) setSessionId(session_id);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: message.content,
        reasoning_steps: message.reasoning_steps
      }]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900" data-testid="chat-title">AI Analyst</h1>
          <p className="text-sm text-slate-600">Ask questions about your business data</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center space-y-6 py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">What would you like to know?</h2>
                  <p className="text-base text-slate-600">Ask me anything about your business metrics</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Try asking:</p>
                  <div className="space-y-2">
                    {exampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(question)}
                        className="block w-full max-w-md mx-auto bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        data-testid={`example-question-${index}`}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chat-message-${message.role}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                <div className={`max-w-2xl ${message.role === 'user' ? 'flex items-start' : ''}`}>
                  {message.role === 'user' ? (
                    <div>
                      <div className="bg-slate-100 text-slate-900 rounded-2xl rounded-tr-sm px-4 py-3">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <div className="flex-shrink-0 ml-3 mt-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 w-full">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm">
                        <p className="text-sm text-slate-800 leading-relaxed">{message.content}</p>
                      </div>
                      
                      {message.reasoning_steps && message.reasoning_steps.length > 0 && (
                        <Accordion type="single" collapsible className="bg-white border border-slate-200 rounded-lg" data-testid="reasoning-accordion">
                          <AccordionItem value="reasoning" className="border-none">
                            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-slate-900 hover:no-underline">
                              View Reasoning Steps
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="space-y-3">
                                {message.reasoning_steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex space-x-3" data-testid={`reasoning-step-${stepIndex}`}>
                                    <div className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                      {step.step}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-sm font-semibold text-slate-900 mb-1">{step.title}</h4>
                                      <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your business..."
                disabled={loading}
                className="flex-1"
                data-testid="chat-input"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-slate-900 text-white hover:bg-slate-800"
                data-testid="chat-send-btn"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
