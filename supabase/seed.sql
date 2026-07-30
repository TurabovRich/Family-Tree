-- SAMPLE / PLACEHOLDER data.
--
-- I could not reliably transcribe the real names from the handwritten chart
-- photo: the handwriting is small, photographed at an angle, and partly
-- blurred/creased, so guessing individual names risks putting wrong people
-- into a real family record. Rather than fabricate that, this seed just
-- demonstrates the schema (parents, spouses, missing photo -> placeholder,
-- needs_review flag) with clearly fictional people so you can see the site
-- working end to end. Replace/delete these rows in the Supabase Table
-- Editor and enter the real family from the chart (see SETUP.md).

insert into people (id, full_name, gender, birth_year, death_year, photo_url, notes, needs_review, father_id, mother_id)
values
  ('00000000-0000-0000-0000-000000000001', 'Пример Дедов', 'male', 1930, 2001, null, 'Образец записи — замените реальными данными', false, null, null),
  ('00000000-0000-0000-0000-000000000002', 'Пример Бабушкина', 'female', 1933, null, null, 'Образец записи — замените реальными данными', false, null, null),
  ('00000000-0000-0000-0000-000000000003', 'Пример Отцов', 'male', 1955, null, null, 'Образец записи — замените реальными данными', true, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000004', 'Пример Матерь', 'female', 1957, null, null, 'Образец записи — замените реальными данными', false, null, null),
  ('00000000-0000-0000-0000-000000000005', 'Пример Сынов', 'male', 1980, null, null, 'Образец записи — замените реальными данными', false, '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004')
on conflict (id) do nothing;

insert into spouses (person_id, spouse_id, status)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'married'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'married')
on conflict (person_id, spouse_id) do nothing;
