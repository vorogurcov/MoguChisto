-- Demo data for users and notifications
-- Fixed UUIDs to ensure deterministic down migration

INSERT INTO users (user_id, last_name, first_name, birthday_date, phone_number, email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Иванов', 'Иван', '1990-05-10', '+70000000001', 'ivan@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'Петров', 'Пётр', '1988-09-21', '+70000000002', 'petr@example.com');

INSERT INTO notifications (user_id, by_sms, by_email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 1, 0),
  ('22222222-2222-2222-2222-222222222222', 1, 1);


