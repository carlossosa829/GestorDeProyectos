/*
PROFESOR - perla@profesor.com perla123
PROFESOR - carlos@profesor.com mario123
ALUMNO - arturo@alumno.com arturo123
ALUMNO - david@alumno.com david123
ALUMNO - alan@alumno.com alan123
ALUMNO - daniel@alumno.com daniel123
ALUMNO - christian@alumno.com christian123
ALUMNO - daniela@alumno.com daniela123
ALUMNO - andrea@alumno.com andrea123
ALUMNO - raul@alumno.com raul123
ALUMNO - zuriel@alumno.com zuriel123
ALUMNO - susana@alumno.com susana123
ALUMNO - maria@alumno.com maria123
ALUMNO - adalberto@alumno.com adalberto123
*/

USE registro_escolar;

/*CARRERAS*/
INSERT INTO carrera(id_carrera,nombre) VALUES
(1250,'INGENIERÍA EN CIENCIAS DE LA COMPUTACIÓN'),
(1251,'LICENCIATURA EN CIENCIAS DE LA COMPUTACIÓN'),
(1252,'INGENIERÍA EN TECNOLOGÍAS DE LA INFORMACIÓN');

/*PERSONAS*/
INSERT INTO persona(nombre,paterno,materno,sexo) VALUES
('PERLA', 'HERNÁNDEZ','JUÁREZ','M'),
('CARLOS','SÁNCHEZ','LUGO','H'),
('LUIS ARTURO','TENORIO','LÓPEZ','H'),
('DAVID','CANIZO','CORTES','H'),
('ALAN J.','PÉREZ','MARCIAL','H'),
('DANIEL','PEREZ','TORRES','H'),
('CHRISTIAN','LOPEZ','RAMIREZ','H'),
('DANIELA','ALONSO','CISNEROS','M'),
('ANDREA','TLALPAN','CAMPOS','M'),
('RAUL','GARCIA','FLORES','H'),
('ZURIEL','TORIZ','MORALES','H'),
('SUSANA','PEÑA','FONSECA','M'),
('MARIA','SANCHEZ','DUARTE','M'),
('ADALBERTO','SERRANO','MORALES','H'),
('JULIO','ALMAZAN','PUEBLA','H');
/*USUARIO*/
INSERT INTO usuario(email,contrasena,rol,foto,id_persona) VALUES
('perla@profesor.com','$2b$10$6J32Kk3yX6TyE5vlQ7mzGe58O88t060kAsxUoF.nEQSHzd4sM9Wxi','PROFESOR',null,1),
('mario@profesor.com','$2a$10$uvd94KJqwGOPjYt4Ar0Euu/Zp2CVZWlP2gMhbycRJ2bo.2n8ZtlhC','PROFESOR',null,2),
('arturo@alumno.com','$2b$10$et.F/RqAp/Bqvk5QqPyJXO4DtQPpSRQ2Dsvd3J1rUqrT20PdsNo5W','ALUMNO',null,3),
('david@alumno.com','$2a$10$ruH2aA7skxIuulbphTOCnOlggeoo5pEWUwj4/H919IZO2rW6UX55O','ALUMNO',null,4),
('alan@alumno.com','$2b$10$Fp0lxBSEBDzUYvMjSlFmIeGSTVKDYLY2S5sT3q1H0tALy7h7.JYc.','ALUMNO',null,5),
('daniel@alumno.com','$2a$10$3ZcSa9R3HzuUDJGHILVosOj2Nmb9CqxGqrcCnPfH74YCbYHH5Cnui','ALUMNO',null,6),
('christian@alumno.com','$2a$10$4qkj81HKrTqdvxszwcEjZeLGwGzjtn0I2SJgE7ucKTG07TdVBX0iC','ALUMNO',null,7),
('daniela@alumno.com','$2a$10$W0Vyf6rZU87QP8gFWRzbHOQhAvULB0w6t6rHG/TV1mQt3nPUFZAt.','ALUMNO',null,8),
('andrea@alumno.com','$2a$10$sV6rgq.OtorSbFEcXUzxEuwccDiSdicRyKwAanG39nTlEtgfYEyrO','ALUMNO',null,9),
('raul@alumno.com','$2a$10$kbPZdbrjfCZFwBjZxk10dekYV.OHP2tpJVf5oakNo4Be..MZslNnO','ALUMNO',null,10),
('zuriel@alumno.com','$2a$10$0qqHMGFu89o5OLIq4Nlmv.TfbfWKt65My11wmoKGz6P/h.vr30CrO','ALUMNO',null,11),
('susana@alumno.com','$2a$10$mK40Phl96TI14kAwKPZ5rOE83S5Y13QwHswmaNRRkkvul787YUH72','ALUMNO',null,12),
('maria@alumno.com','$2a$10$RdRHGLGOQbhnRqq8t7W.ruHcc.BTFdDYDtgKlhaAG71JEb.Wgd4jO','ALUMNO',null,13),
('adalberto@alumno.com','$2a$10$ZW01woGeD7VwilwjsQcUJePK67KRbShgEiP0Cg1rFsgSL5fSVVToG','ALUMNO',null,14),
('julio@alumno.com','$2a$10$UcQTWaFuSzEC809AFFcKCexyGx9Rs4OS7FoJgKonbrmwXqnyX.w/W','ALUMNO',null,15);

/*ALUMNO*/
INSERT INTO alumno(matricula,id_carrera,id_persona) VALUES
(201749575,1252,3),
(201755917,1252,4),
(201758356,1252,5),
(201758357,1252,6),
(201758358,1252,7),
(201758359,1252,8),
(201758370,1252,9),
(201758371,1252,10),
(201758372,1252,11),
(201758373,1252,12),
(201758374,1252,13),
(201758375,1252,14),
(201758376,1252,15);

/*PERIODO*/
INSERT INTO periodo(nombre) VALUES
('PRIMAVERA 2021'),
('VERANO 2021'),
('OTOÑO 2021');