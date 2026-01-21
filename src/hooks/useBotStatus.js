import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useBotStatus = () => {
    const [status, setStatus] = useState({
        isOnline: false,
        lastActive: null,
        uptimeSeconds: 0,
        messagesToday: 0,
        lastMessageAt: null,
        version: null,
        platform: null,
        memoryUsage: 0,
        latency: 0
    });

    // New stats
    const [changelogs, setChangelogs] = useState([]);
    const [updateLogs, setUpdateLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchStatus = async () => {
            if (!supabase) return;
            try {
                // 1. Fetch Bot Status
                const { data: statusData, error: statusError } = await supabase
                    .from('bot_status')
                    .select('*')
                    .eq('session_id', 'main')
                    .single();

                if (statusError && statusError.code !== 'PGRST116') {
                    console.error('Error fetching bot status:', statusError);
                }

                if (mounted && statusData) {
                    setStatus({
                        isOnline: statusData.is_online || false,
                        lastActive: statusData.last_active,
                        uptimeSeconds: statusData.uptime_seconds || 0,
                        messagesToday: statusData.messages_today || 0,
                        lastMessageAt: statusData.last_message_at,
                        version: statusData.version,
                        platform: statusData.platform,
                        memoryUsage: statusData.memory_usage || 0,
                        latency: statusData.latency || 0
                    });
                }

                // 2. Fetch Changelogs (Latest 5)
                const { data: changelogData } = await supabase
                    .from('changelogs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (mounted && changelogData) {
                    setChangelogs(changelogData);
                }

                // 3. Fetch Update Logs (Latest 10)
                const { data: updatesData } = await supabase
                    .from('updatelogs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (mounted && updatesData) {
                    setUpdateLogs(updatesData);
                }

            } catch (err) {
                console.error('Error in bot status hook:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchStatus();

        if (!supabase) return;

        // Realtime subscription for bot_status
        const statusChannel = supabase
            .channel('bot_status_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bot_status', filter: 'session_id=eq.main' },
                (payload) => {
                    if (mounted && payload.new) {
                        setStatus({
                            isOnline: payload.new.is_online || false,
                            lastActive: payload.new.last_active,
                            uptimeSeconds: payload.new.uptime_seconds || 0,
                            messagesToday: payload.new.messages_today || 0,
                            lastMessageAt: payload.new.last_message_at,
                            version: payload.new.version,
                            platform: payload.new.platform,
                            memoryUsage: payload.new.memory_usage || 0,
                            latency: payload.new.latency || 0
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(statusChannel);
        };
    }, []);

    // Helper to format uptime
    const formatUptime = (seconds) => {
        if (!seconds) return '0m';
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    // Helper to format relative time
    const formatRelativeTime = (isoString) => {
        if (!isoString) return 'Never';
        const diff = Date.now() - new Date(isoString).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (mins > 0) return `${mins}m ago`;
        return 'Just now';
    };

    return {
        ...status,
        changelogs,
        updateLogs,
        loading,
        formattedUptime: formatUptime(status.uptimeSeconds),
        formattedLastActive: formatRelativeTime(status.lastActive),
        formattedLastMessage: formatRelativeTime(status.lastMessageAt)
    };
};
