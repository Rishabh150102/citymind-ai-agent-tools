import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { MobileNav } from './components/MobileNav';
import { MobileMenu } from './components/MobileMenu';
import { useChat } from './hooks/useChat';

function App() {
  const {
    messages,
    logs,
    toolCount,
    isLoading,
    loadingMessage,
    sendMessage,
  } = useChat();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handlePromptSelect = (prompt: string) => {
    setInputValue(prompt);
    sendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent rounded-full" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        <Navbar />
        
        <div className="flex flex-1 pt-16">
          <Sidebar
            logs={logs}
            toolCount={toolCount}
            onPromptSelect={handlePromptSelect}
          />
          
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            inputValue={inputValue}
            onSendMessage={sendMessage}
            onInputChange={setInputValue}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-screen flex flex-col">
        <MobileNav onMenuOpen={() => setMobileMenuOpen(true)} />
        
        <div className="flex-1 pt-16">
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            inputValue={inputValue}
            onSendMessage={sendMessage}
            onInputChange={setInputValue}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        logs={logs}
        toolCount={toolCount}
        onPromptSelect={handlePromptSelect}
      />
    </div>
  );
}

export default App;
