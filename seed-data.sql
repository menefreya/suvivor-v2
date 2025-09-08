-- Survivor Fantasy League Initial Data
-- Run this AFTER creating the schema

-- Insert scoring event types
INSERT INTO public.scoring_event_types (name, display_name, points, category, icon, is_penalty) VALUES
('immunityIndividual', 'Individual Immunity', 3, 'individual', 'Shield', false),
('rewardIndividual', 'Individual Reward', 2, 'individual', 'Award', false),
('findIdol', 'Found Idol', 3, 'individual', 'Eye', false),
('playIdol', 'Played Idol', 2, 'individual', 'Eye', false),
('makeFire', 'Made Fire', 1, 'individual', 'Plus', false),
('makeFood', 'Made Food', 1, 'individual', 'Plus', false),
('readTreeMail', 'Read Tree Mail', 1, 'individual', 'Plus', false),
('shotInDark', 'Shot in Dark', 1, 'individual', 'Plus', false),
('shotImmunity', 'Shot Immunity', 4, 'individual', 'Plus', false),
('soleSurvivor', 'Sole Survivor', 25, 'special', 'Award', false),
('final3', 'Made Final 3', 10, 'special', 'Users', false),
('eliminated', 'Eliminated', -5, 'individual', 'Minus', true),
('votedWithIdol', 'Voted w/ Idol', -3, 'individual', 'Minus', true),
('immunityTeam', 'Team Immunity', 2, 'team', 'Shield', false),
('rewardTeam', 'Team Reward', 1, 'team', 'Award', false),
('soleSurvivorWeekly', 'Sole Survivor Weekly', 1, 'special', 'Crown', false);

-- Insert Season 49
INSERT INTO public.seasons (season_number, season_name, start_date, end_date, draft_deadline, sole_survivor_deadline, episode_2_deadline) VALUES
(49, 'Survivor 49', '2024-09-18', '2024-12-18', '2026-02-15 23:59:59', '2026-02-15 23:59:59', '2024-10-02 23:59:59');

-- Insert tribes
INSERT INTO public.tribes (season_id, name, color) VALUES
(1, 'Ratu', 'red'),
(1, 'Tika', 'blue'), 
(1, 'Soka', 'green');

-- Insert contestants (all 18 from Season 49)
INSERT INTO public.contestants (season_id, name, age, hometown, residence, occupation, tribe, image_filename) VALUES
(1, 'Alex Moore', 27, 'Evanston, Ill.', 'Washington, D.C.', 'Political comms director', 'Ratu', 'Alex Moore.png'),
(1, 'Jake Latimer', 36, 'Regina, Saskatchewan', 'St. Albert, Alberta', 'Correctional officer', 'Tika', 'Jake Latimer.png'),
(1, 'Jason Treul', 32, 'Anaheim, Calif.', 'Santa Ana, Calif.', 'Law clerk', 'Soka', 'Jason Treul.png'),
(1, 'Jawan Pitts', 28, 'Salem, N.J.', 'Los Angeles, Calif.', 'Video editor', 'Ratu', 'Jawan Pitts.png'),
(1, 'Jeremiah Ing', 39, 'Windsor, Ontario', 'Toronto, Ontario', 'Global events manager', 'Tika', 'Jeremiah Ing.png'),
(1, 'Kimberly "Annie" Davis', 49, 'Portland, Ore.', 'Austin, Texas', 'Musician', 'Soka', 'Kimberly Annie Davis.png'),
(1, 'Kristina Mills', 36, 'Houston, Texas', 'Edmond, Okla.', 'MBA career coach', 'Ratu', 'Kristina Mills.png'),
(1, 'Matt Williams', 52, 'Farmington, Utah', 'St. George, Utah', 'Airport ramp agent', 'Tika', 'Matt Williams.png'),
(1, 'Michelle "MC" Chukwujekwu', 29, 'Sachse, Texas', 'San Diego, Calif.', 'Fitness trainer', 'Soka', 'Michelle Chukwujekwu.png'),
(1, 'Nate Moore', 47, 'Clovis, Calif.', 'Hermosa Beach, Calif.', 'Film producer', 'Ratu', 'Nate Moore.png'),
(1, 'Nicole Mazullo', 26, 'Long Island, N.Y.', 'Philadelphia, Pa.', 'Financial crime consultant', 'Tika', 'Nicole Mazullo.png'),
(1, 'Rizo Velovic', 25, 'Yonkers, N.Y.', 'Yonkers, N.Y.', 'Tech sales', 'Soka', 'Rizo Velovic.png'),
(1, 'Sage Ahrens-Nichols', 30, 'Roxboro, N.C.', 'Olympia, Wash.', 'Clinical social worker', 'Ratu', 'Sage Ahrens-Nichols.png'),
(1, 'Savannah Louie', 31, 'Walnut Creek, Calif.', 'Atlanta, Ga.', 'Former reporter', 'Tika', 'Savannah Louie.png'),
(1, 'Shannon Fairweather', 28, 'Wakefield, Mass.', 'Boston, Mass.', 'Wellness specialist', 'Soka', 'Shannon Fairweather.png'),
(1, 'Sophi Balerdi', 27, 'Miami, Fla.', 'Miami, Fla.', 'Entrepreneur', 'Ratu', 'Sophi Balerdi.png'),
(1, 'Sophie Segreti', 31, 'Darnestown, Md.', 'New York City, N.Y.', 'Strategy associate', 'Tika', 'Sophie Segreti.png'),
(1, 'Steven Ramm', 35, 'Littleton, Colo.', 'Denver, Colo.', 'Rocket scientist', 'Soka', 'Steven Ramm.png');
