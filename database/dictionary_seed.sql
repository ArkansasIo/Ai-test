USE ai_test;

INSERT INTO languages (code, name, native_name, script, direction) VALUES
('en','English','English','Latin','ltr'),
('fr','French','Français','Latin','ltr'),
('es','Spanish','Español','Latin','ltr'),
('de','German','Deutsch','Latin','ltr'),
('it','Italian','Italiano','Latin','ltr'),
('pt','Portuguese','Português','Latin','ltr'),
('nl','Dutch','Nederlands','Latin','ltr'),
('ru','Russian','Русский','Cyrillic','ltr'),
('uk','Ukrainian','Українська','Cyrillic','ltr'),
('pl','Polish','Polski','Latin','ltr'),
('ar','Arabic','العربية','Arabic','rtl'),
('fa','Persian','فارسی','Persian','rtl'),
('hi','Hindi','हिन्दी','Devanagari','ltr'),
('bn','Bengali','বাংলা','Bengali','ltr'),
('zh','Chinese','中文','Han','ltr'),
('ja','Japanese','日本語','Japanese','ltr'),
('ko','Korean','한국어','Hangul','ltr'),
('vi','Vietnamese','Tiếng Việt','Latin','ltr'),
('tr','Turkish','Türkçe','Latin','ltr'),
('sv','Swedish','Svenska','Latin','ltr'),
('fi','Finnish','Suomi','Latin','ltr'),
('el','Greek','Ελληνικά','Greek','ltr'),
('he','Hebrew','עברית','Hebrew','rtl'),
('th','Thai','ไทย','Thai','ltr'),
('id','Indonesian','Bahasa Indonesia','Latin','ltr')
ON DUPLICATE KEY UPDATE name=VALUES(name), native_name=VALUES(native_name), script=VALUES(script), direction=VALUES(direction);
