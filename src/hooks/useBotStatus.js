import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useBotStatus = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [lastActive, setLastActive] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchStatus = async () => {
            if (!supabase) return; // Guard clause
            try {
                const { data, error } = await supabase
                    .from('bot_status')
                    .select('is_online, last_active')
                    .eq('session_id', 'main')
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching bot status:', error);
                }

                if (mounted && data) {
                    setIsOnline(data.is_online);
                    setLastActive(data.last_active);
                }
            } catch (err) {
                console.error('Error in bot status hook:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchStatus();

        if (!supabase) return; // Guard clause for realtime

        // Realtime subscription
        const channel = supabase
            .channel('bot_status_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bot_status',
                    filter: 'session_id=eq.main'
                },
                (payload) => {
                    if (mounted && payload.new) {
                        setIsOnline(payload.new.is_online);
                        setLastActive(payload.new.last_active);
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    return { isOnline, lastActive, loading };
};
