-- Demo data for orders (ties to demo users from 0002)

INSERT INTO orders (order_id, user_id, type, cost, status, start_date, cleaners)
VALUES
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'express', 1999.00, 'pending', NULL, JSON_ARRAY()),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'comfort', 2999.50, 'in_progress', '09:30:00', JSON_ARRAY('cleaner_1', 'cleaner_2')),
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'elite', 4999.90, 'completed', '14:00:00', JSON_OBJECT('team', JSON_ARRAY('c1','c2','c3')));


