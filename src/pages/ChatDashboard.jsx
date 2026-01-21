import { useState } from 'react';

const ChatDashboard = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: "Hello! I noticed you spent 20% more on dining this week compared to your average. Would you like to review your budget or log how you're feeling about it?",
            timestamp: '10:24 AM',
            sender: 'AzoAI'
        },
        {
            id: 2,
            type: 'user',
            content: "Show me my spending for this month.",
            timestamp: '10:25 AM',
            sender: 'You'
        }
    ]);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-md mx-auto relative overflow-hidden bg-background-light dark:bg-background-dark rounded-3xl border border-slate-200 dark:border-border-dark shadow-2xl">
            {/* Top App Bar */}
            <header className="sticky top-0 z-20 backdrop-blur-md bg-background-light/80 dark:bg-background-dark/80 border-b border-slate-200 dark:border-border-dark px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">AzoAI</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 dark:text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="text-slate-500 dark:text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6 flex flex-col gap-6">
                {/* Empty State / Greeting */}
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-surface flex items-center justify-center mb-4 border border-slate-300 dark:border-border-dark">
                        <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                    </div>
                    <p className="text-lg font-medium text-center">Hi, I’m AzoAI.</p>
                    <p className="text-sm text-center max-w-[240px] mt-1 text-slate-500 dark:text-slate-400">How can I help you today? I can help you track your mood or manage your finances.</p>
                </div>

                {/* AI Message */}
                <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-surface border border-border-dark flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-primary">smart_toy</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="bg-surface border border-border-dark px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                            <p className="text-sm leading-relaxed text-slate-200">
                                Hello! I noticed you spent 20% more on dining this week compared to your average. Would you like to review your budget or log how you're feeling about it?
                            </p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium ml-1">AzoAI • 10:24 AM</span>
                    </div>
                </div>

                {/* User Message */}
                <div className="flex flex-col items-end gap-1.5 self-end max-w-[85%]">
                    <div className="message-gradient text-background-dark px-4 py-3 rounded-2xl rounded-tr-none shadow-lg shadow-primary/10">
                        <p className="text-sm font-medium leading-relaxed">
                            Show me my spending for this month.
                        </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium mr-1">You • 10:25 AM</span>
                </div>

                {/* AI Message with List */}
                <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-surface border border-border-dark flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-primary">smart_toy</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="bg-surface border border-border-dark px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                            <p className="text-sm font-semibold text-primary mb-2">October Spending Summary</p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex justify-between border-b border-border-dark/50 pb-1">
                                    <span>Rent & Utilities</span>
                                    <span className="font-mono text-white">$1,450</span>
                                </li>
                                <li className="flex justify-between border-b border-border-dark/50 pb-1">
                                    <span>Groceries</span>
                                    <span className="font-mono text-white">$420</span>
                                </li>
                                <li className="flex justify-between border-b border-border-dark/50 pb-1">
                                    <span>Entertainment</span>
                                    <span className="font-mono text-white">$185</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contextual Chips */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 mt-auto">
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface border border-border-dark text-xs font-medium text-slate-300 hover:border-primary transition-colors">
                        Log my mood
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface border border-border-dark text-xs font-medium text-slate-300 hover:border-primary transition-colors">
                        Savings tips
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface border border-border-dark text-xs font-medium text-slate-300 hover:border-primary transition-colors">
                        Investments
                    </button>
                </div>
            </main>

            {/* Bottom Input & Nav Area */}
            <footer className="bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-border-dark pb-8">
                {/* Input Bar */}
                <div className="p-4 flex items-center gap-3">
                    <button className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <div className="flex-1 relative">
                        <input className="w-full bg-slate-100 dark:bg-surface border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-500" placeholder="Type a message..." type="text" />
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-background-dark shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
                {/* Navigation Bar */}
                <nav className="flex justify-around items-center px-4 mt-2">
                    <button className="flex flex-col items-center gap-1 group">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                        <span className="text-[10px] font-bold text-primary tracking-wide">Chat</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-slate-400">mood</span>
                        <span className="text-[10px] font-medium text-slate-400">Tracker</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span>
                        <span className="text-[10px] font-medium text-slate-400">Finance</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-slate-400">settings</span>
                        <span className="text-[10px] font-medium text-slate-400">Settings</span>
                    </button>
                </nav>
            </footer>
        </div>
    );
};

export default ChatDashboard;
