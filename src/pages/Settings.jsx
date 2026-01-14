import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Save, Bot, Smartphone, Moon, Sun, Bell, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        bot_name: 'Azo Bot',
        owner_number: '6281234567890',
        auto_reply: true,
        bg_remove_api: '',
        openai_api: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('admin_settings')
                .select('*');

            if (data && data.length > 0) {
                // Convert array of {key, value} to object
                const newSettings = { ...settings };
                data.forEach(item => {
                    newSettings[item.key] = item.value;
                });
                setSettings(newSettings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        if (!supabase) {
            alert("Supabase not configured");
            setLoading(false);
            return;
        }

        try {
            // Upsert each setting
            const updates = Object.keys(settings).map(key => ({
                key,
                value: settings[key]
            }));

            const { error } = await supabase
                .from('admin_settings')
                .upsert(updates);

            if (error) throw error;
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-1">Settings</h2>
                    <p className="text-gray-500 text-sm">Manage bot configuration and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <Card className="border-none shadow-sm h-fit">
                    <CardHeader className="border-b border-gray-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <CardTitle className="text-lg">Bot Configuration</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Bot Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                value={settings.bot_name}
                                onChange={(e) => setSettings({ ...settings, bot_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Owner Number</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                value={settings.owner_number}
                                onChange={(e) => setSettings({ ...settings, owner_number: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Auto-Reply</h4>
                                <p className="text-xs text-gray-500">Automatically reply to unknown commands</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.auto_reply}
                                    onChange={(e) => setSettings({ ...settings, auto_reply: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys */}
                <Card className="border-none shadow-sm h-fit">
                    <CardHeader className="border-b border-gray-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Shield size={20} />
                            </div>
                            <CardTitle className="text-lg">API Integrations</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex justify-between">
                                OpenAI API Key
                                <span className="text-xs text-gray-400 font-normal">Optional</span>
                            </label>
                            <input
                                type="password"
                                placeholder="sk-..."
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                value={settings.openai_api}
                                onChange={(e) => setSettings({ ...settings, openai_api: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex justify-between">
                                Remove.bg API Key
                                <span className="text-xs text-gray-400 font-normal">Optional</span>
                            </label>
                            <input
                                type="password"
                                placeholder="ExampleKey123"
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                value={settings.bg_remove_api}
                                onChange={(e) => setSettings({ ...settings, bg_remove_api: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
