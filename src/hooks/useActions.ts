import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Mission } from '../types';

export function useActions() {
    const [agents, setAgents] = useState<Profile[]>([]);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [recentActions, setRecentActions] = useState<any[]>([]);

    useEffect(() => {
        async function fetchCatalogs() {
            try {
                setLoading(true);
                const [profilesRes, missionsRes] = await Promise.all([
                    supabase.from('profiles').select('*').eq('is_active', true),
                    supabase.from('missions').select('*, target_title').eq('is_active', true).order('type', { ascending: false })
                ]);

                if (profilesRes.error) throw profilesRes.error;
                if (missionsRes.error) throw missionsRes.error;

                setAgents(profilesRes.data || []);
                setMissions(missionsRes.data || []);
            } catch (err) {
                console.error("Error fetching catalogs", err);
                if (!import.meta.env.VITE_SUPABASE_URL) {
                    setAgents([{ id: '1', full_name: 'Andrea', role: 'member', title: 'Editor', avatar_url: null, is_active: true, created_at: '' }]);
                    setMissions([
                        { id: 'm1', title: 'Excelente Video', points: 10, type: 'positive', target_title: null, is_active: true, created_at: '' },
                        { id: 'm2', title: 'Retraso Grave', points: -10, type: 'negative', target_title: null, is_active: true, created_at: '' }
                    ]);
                }
            } finally {
                setLoading(false);
            }
        }
        async function fetchRecentActions() {
            const { data } = await supabase
                .from('actions_ledger')
                .select('*, profiles:target_user_id(full_name)')
                .order('created_at', { ascending: false })
                .limit(10);
            setRecentActions(data || []);
        }

        fetchCatalogs();
        fetchRecentActions();
    }, []);

    const registerAction = async (targetUserId: string, mission: Mission, note?: string) => {
        setSubmitting(true);
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const { data: authData } = await supabase.auth.getUser();
            const createdBy = authData.user?.id;

            const { error } = await supabase.from('actions_ledger').insert({
                target_user_id: targetUserId,
                mission_id: mission.id,
                mission_title_snapshot: mission.title,
                points: mission.points,
                note: note || null,
                created_by: createdBy || targetUserId,
                month_tag: currentMonth
            });

            if (error) throw error;

            // Refresh recent actions
            const { data: newRecent } = await supabase
                .from('actions_ledger')
                .select('*, profiles:target_user_id(full_name)')
                .order('created_at', { ascending: false })
                .limit(10);
            setRecentActions(newRecent || []);

            return true;
        } catch (err) {
            console.error("Error registering action", err);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    const deleteAction = async (actionId: string) => {
        try {
            const { error } = await supabase.from('actions_ledger').delete().eq('id', actionId);
            if (error) throw error;

            setRecentActions(prev => prev.filter(a => a.id !== actionId));
            return true;
        } catch (err) {
            console.error("Error deleting action", err);
            return false;
        }
    };

    return { agents, missions, loading, submitting, recentActions, registerAction, deleteAction };
}
