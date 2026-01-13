-- SAMPLE SEED DATA
-- NOTE: Users must exist in auth.users first for profiles to be linked ideally, OR we just insert into profiles if we disable the FK constraint temporarily or if we are just testing.
-- However, for Supabase local or real, we usually create users via Auth API.
-- Here we populate Missions which don't depend on Auth.

insert into public.missions (title, points, type) values
('Entrega video antes 5pm', 5, 'positive'),
('Racha sin correcciones', 5, 'positive'),
('Subida al drive día siguiente', 5, 'positive'),
('Entrega fuera del día de entrega', -5, 'negative'),
('Demora más de un día sin correcciones', -5, 'negative'),
('Semana sin subir archivos', -10, 'negative'),
('Cumplimiento programación de la semana', 15, 'positive'),
('100 seguidores nuevos en Instagram', 20, 'positive'),
('Ideas +10k vistas', 10, 'positive'),
('Videos sin programar a la semana', -2, 'negative');
