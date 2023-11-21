\c priorities_db;

INSERT INTO todo_tb (todo_title, todo_description, todo_date, todo_istrue, todo_category) VALUES
('grocery shopping', 'make sure to get ingredients for dinner.', '2023-11-15', false, 'personal'),
('Clean bathroom', 'Clean the bathroom before mom gets home!', '2023-11-18', false, 'personal'),
('Get haircut', 'Dont forget your haircut appointment at 6pm', '2023-11-18', false, 'personal'),
('Feed dog', 'Don''t know why you would forget but feed at 7 am and 7 pm', '2023-11-23', false, 'work'),
('Son turns 1', 'You really have to make a reminder for your child''s birthday?', '2023-11-30', true, 'work');

INSERT INTO checklist_tb (checklist_description, checklist_istrue, todo_id) VALUES
('1 lb carrots', false, 1),
('1 lb potatoes', false, 1),
('Two 20oz ribeye steaks', false, 1),
('Clean shower', false, 2),
('Clean toilet', false, 2),
('Clean sink', false, 2),
('Get haircut', false, 3),
('Feed dog', false, 4),
('Get birthday cake w/ candles', false, 5),
('Table covers, streamers, banners', false, 5),
('Pickup present from store', false, 5),
('Pick up catering order at 4pm', false, 5),
('Pick up soda and chips from the store', false, 5);