import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { UserPlus, Shield, User as UserIcon, X, Check, Edit2, Camera } from 'lucide-react';
import { Input } from '../components/ui/Input';

export function Team() {
    const [members, setMembers] = useState<Profile[]>([]);
    // loading removed as it was unused in render, or use it for skeleton

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Profile | null>(null);
    const [formData, setFormData] = useState({ full_name: '', title: '', role: 'member', is_active: true, avatar_url: '' as string | null });
    const [uploading, setUploading] = useState(false);

    async function fetchTeam() {
        if (!import.meta.env.VITE_SUPABASE_URL) {
            setMembers([
                { id: '1', full_name: 'Andrea', role: 'member', title: 'Editor', avatar_url: null, is_active: true, created_at: '' },
                { id: '2', full_name: 'Valentina', role: 'member', title: 'Designer', avatar_url: null, is_active: true, created_at: '' }
            ]);
            return;
        }
        const { data } = await supabase.from('profiles').select('*').order('full_name');
        if (data) setMembers(data);
    }

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData({ ...formData, avatar_url: publicUrl });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error al subir la imagen. Asegúrate que el bucket "avatars" sea público.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.full_name) return;

        try {
            const profileData = {
                full_name: formData.full_name,
                title: formData.title,
                role: formData.role,
                is_active: formData.is_active,
                avatar_url: formData.avatar_url
            };

            if (editingMember) {
                const { error } = await supabase.from('profiles').update(profileData).eq('id', editingMember.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('profiles').insert([profileData]);
                if (error) throw error;
            }
            setIsModalOpen(false);
            setEditingMember(null);
            setFormData({ full_name: '', title: '', role: 'member', is_active: true, avatar_url: null });
            fetchTeam();
        } catch (e) {
            console.error(e);
            alert('Error al guardar.');
        }
    };

    const openEdit = (member: Profile) => {
        setEditingMember(member);
        setFormData({
            full_name: member.full_name || '',
            title: member.title || '',
            role: member.role || 'member',
            is_active: member.is_active ?? true,
            avatar_url: member.avatar_url || null
        });
        setIsModalOpen(true);
    };

    const openNew = () => {
        setEditingMember(null);
        setFormData({ full_name: '', title: '', role: 'member', is_active: true, avatar_url: null });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Gestión del Equipo</h1>
                    <p className="text-muted mt-1">Administra los integrantes del squad.</p>
                </div>
                <Button className="gap-2" onClick={openNew}>
                    <UserPlus className="h-4 w-4" /> Nuevo Integrante
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map(member => (
                    <Card key={member.id} className="group overflow-hidden transition-all">
                        <div className="h-24 bg-surface-2 relative">
                            <div className="absolute top-4 right-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-white" onClick={() => openEdit(member)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="relative pt-0">
                            <div className="absolute -top-12 left-6">
                                <div className="h-24 w-24 rounded-2xl bg-surface border-4 border-surface shadow-xl overflow-hidden flex items-center justify-center">
                                    {member.avatar_url ? (
                                        <img src={member.avatar_url} className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-10 w-10 text-muted" />
                                    )}
                                </div>
                            </div>
                            <div className="mt-14 mb-2 min-h-[60px]">
                                <h3 className="text-lg font-bold text-white leading-tight break-words">{member.full_name}</h3>
                                <p className="text-sm text-primary font-medium">{member.title || 'Sin cargo'}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-6">
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider gap-1 pl-1">
                                    {member.role === 'admin' && <Shield className="h-3 w-3" />}
                                    {member.role}
                                </Badge>
                                <Badge variant={member.is_active ? 'success' : 'default'} className="text-[10px]">
                                    {member.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                <div className="text-center">
                                    <p className="text-xs text-muted">Meses Activo</p>
                                    <p className="font-mono text-lg font-medium text-white">N/A</p>
                                </div>
                                <div className="text-center border-l border-white/5">
                                    <p className="text-xs text-muted">Rendimiento</p>
                                    <p className="font-mono text-lg font-medium text-white">Top 20%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md bg-surface border-primary/20">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {editingMember ? 'Editar Miembro' : 'Nuevo Integrante'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div className="h-24 w-24 rounded-2xl bg-surface-2 border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center">
                                        {formData.avatar_url ? (
                                            <img src={formData.avatar_url} className="h-full w-full object-cover" />
                                        ) : (
                                            <UserIcon className="h-10 w-10 text-muted" />
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                        <Camera className="h-4 w-4" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                    </label>
                                </div>
                                <p className="text-[10px] text-muted mt-3 uppercase tracking-widest">Foto de Perfil</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-muted block mb-2">Nombre Completo</label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Ej: Ana María"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted block mb-2">Cargo / Título</label>
                                    <Input
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ej: Senior Editor"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-muted block mb-2">Rol</label>
                                        <select
                                            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                                        >
                                            <option value="member">Miembro</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted block mb-2">Estado</label>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                                className={`w-10 h-5 rounded-full transition-colors relative ${formData.is_active ? 'bg-success' : 'bg-surface-2 border border-white/10'}`}
                                            >
                                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                            <span className="text-sm text-muted">{formData.is_active ? 'Activo' : 'Inactivo'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSubmit} className="gap-2">
                                    <Check className="h-4 w-4" /> Guardar
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
