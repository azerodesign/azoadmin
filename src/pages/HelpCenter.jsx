import { Card } from '../components/ui/card';
import { Search, ChevronDown, CheckCircle2, MessageCircle, Mail } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const HelpCenter = () => {
    const faqs = [
        {
            q: "How do I connect my WhatsApp number?",
            a: "Go to the Dashboard, scan the QR code using your WhatsApp mobile app (Linked Devices). Once scanned, the status will change to 'Online'."
        },
        {
            q: "Can I add multiple users to the bot?",
            a: "Yes, navigate to the 'Team' page and click 'Add User'. You can assign them levels and track their XP."
        },
        {
            q: "How does the AI auto-reply work?",
            a: "The AI uses the Gemini model to process incoming messages. It checks the 'Gatekeeper' logic first. You can configure AI settings in the bot config files."
        },
        {
            q: "What happens if the bot disconnects?",
            a: "The system will attempt to auto-reconnect. If it fails, you may need to re-scan the QR code from the Dashboard sidebar."
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto py-10">
                <h1 className="text-3xl sm:text-4xl font-black mb-4 text-foreground tracking-tight">How can we help?</h1>
                <p className="text-muted text-lg font-medium mb-8">Search our knowledge base or contact support.</p>
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full bg-surface-l2 border border-white/10 rounded-full py-4 pl-14 pr-6 shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted/50 text-base transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-white/5 shadow-none glass-panel p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Getting Started</h3>
                    <p className="text-sm text-muted">Learn the basics of setting up your AzoAI bot.</p>
                </Card>
                <Card className="border border-white/5 shadow-none glass-panel p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
                        <MessageCircle size={24} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Bot Commands</h3>
                    <p className="text-sm text-muted">Full list of available commands and usage.</p>
                </Card>
                <Card className="border border-white/5 shadow-none glass-panel p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 mb-4 group-hover:scale-110 transition-transform">
                        <Mail size={24} className="text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Billing & Account</h3>
                    <p className="text-sm text-muted">Manage your subscription and payments.</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
                        Frequently Asked Questions
                    </h3>
                    <Accordion.Root type="single" defaultValue="item-1" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <Accordion.Item key={index} value={`item-${index + 1}`} className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
                                <Accordion.Header>
                                    <Accordion.Trigger className="flex items-center justify-between w-full p-5 text-left bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                                        <span className="font-bold text-foreground text-sm sm:text-base">{faq.q}</span>
                                        <ChevronDown size={18} className="text-muted group-data-[state=open]:rotate-180 transition-transform duration-300" />
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                                    <div className="p-5 pt-2 text-muted text-sm leading-relaxed border-t border-white/5">
                                        {faq.a}
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>
                </div>

                <div>
                    <Card className="border border-white/5 shadow-none glass-panel p-6 sticky top-8">
                        <h3 className="text-lg font-bold text-foreground mb-4">Still need help?</h3>
                        <p className="text-sm text-muted mb-6 leading-relaxed">
                            Our support team is available 24/7 to assist you with any issues.
                        </p>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all text-sm shadow-lg shadow-primary/20">
                                <MessageCircle size={18} />
                                Chat Support
                            </button>
                            <button className="w-full py-3 bg-white/5 text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm border border-white/10">
                                <Mail size={18} />
                                Email Us
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
