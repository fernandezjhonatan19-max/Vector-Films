import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, ActionLedger } from '../types';

export function useDashboard() {
    const [agents, setAgents] = useState<Profile[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActionLedger[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ userId: string; points: number }[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // 1. Fetch Profiles
                const { data: profiles, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('is_active', true);

                if (profileError) throw profileError;

                // 2. Fetch recent activity (last 10)
                const { data: activity, error: activityError } = await supabase
                    .from('actions_ledger')
                    .select('*, target_user:profiles!target_user_id(*)')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (activityError) throw activityError;

                // 3. Fetch monthly stats
                const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
                const { data: monthLedger, error: ledgerError } = await supabase
                    .from('actions_ledger')
                    .select('target_user_id, points')
                    .eq('month_tag', currentMonth);

                if (ledgerError) throw ledgerError;

                // Aggregate locally
                const aggregator: Record<string, number> = {};
                monthLedger?.forEach(item => {
                    aggregator[item.target_user_id] = (aggregator[item.target_user_id] || 0) + item.points;
                });

                const statsArray = Object.entries(aggregator).map(([userId, points]) => ({ userId, points }));

                setAgents(profiles || []);
                setRecentActivity(activity || []);
                setStats(statsArray);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Fallback to Mock Data
                if (!import.meta.env.VITE_SUPABASE_URL) {
                    setAgents([
                        { id: '1', full_name: 'Andrea', role: 'member', title: 'Editor', avatar_url: null, is_active: true, created_at: '' },
                        { id: '2', full_name: 'Valentina', role: 'member', title: 'Designer', avatar_url: null, is_active: true, created_at: '' },
                        { id: '3', full_name: 'Sara', role: 'member', title: 'Copywriter', avatar_url: null, is_active: true, created_at: '' },
                    ]);
                    setRecentActivity([
                        { id: '101', target_user_id: '1', points: 10, mission_title_snapshot: 'Ideas +10k vistas', created_at: new Date().toISOString(), created_by: 'admin', month_tag: '2026-01', points_current_month: 0, note: null, mission_id: null },
                        { id: '102', target_user_id: '2', points: -5, mission_title_snapshot: 'Entrega tarde', created_at: new Date(Date.now() - 86400000).toISOString(), created_by: 'admin', month_tag: '2026-01', points_current_month: 0, note: null, mission_id: null }
                    ] as any);
                    setStats([
                        { userId: '1', points: 150 },
                        { userId: '2', points: 120 },
                        { userId: '3', points: 95 }
                    ]);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { agents, recentActivity, stats, loading };
}
