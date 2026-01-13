export type UserRole = 'admin' | 'member';

export interface Profile {
    id: string; // uuid
    full_name: string | null;
    role: UserRole;
    title: string | null;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    // Computed fields
    points_current_month?: number;
}

export type MissionType = 'positive' | 'negative';

export interface Mission {
    id: string;
    title: string;
    points: number;
    type: MissionType;
    target_title: string | null;
    is_active: boolean;
    created_at: string;
}

export interface ActionLedger {
    id: string;
    target_user_id: string;
    mission_id: string | null;
    mission_title_snapshot: string | null;
    points: number;
    note: string | null;
    created_by: string;
    created_at: string;
    month_tag: string;
    // Joins
    target_user?: Profile;
    created_by_user?: Profile;
}

export interface MonthlyArchive {
    id: string;
    month_tag: string;
    closed_by: string | null;
    closed_at: string;
}

export interface MonthlyArchiveRow {
    id: string;
    month_tag: string;
    user_id: string;
    points_total: number;
    bonus_cop: number; // numeric in DB
    rank: number;
    // Joins
    user?: Profile;
}

export interface AppSettings {
    valor_punto_cop: number;
    max_puntos_mensual: number;
    dashboard_quote: string;
    current_month_mock?: string; // Optional override
    strict_penalty_mode: boolean;
    allow_member_actions: boolean;
}
