# Создание БД
CREATE DATABASE Training;
USE Training;

# Создание таблиц
CREATE TABLE Trainee
(
  id 					            INT(10) unsigned NOT NULL AUTO_INCREMENT, 	          # Primary key: unique trainee ID
  name				            VARCHAR(255) NOT NULL,						                    # Name of trainee	
  email 				          VARCHAR(255) NOT NULL,						                    # Email of trainee
  PRIMARY KEY (id)  
);

CREATE TABLE Course
(
  course_id 			        INT(10) unsigned NOT NULL AUTO_INCREMENT, 	          # Primary key: unique course ID
  name				            VARCHAR(255) NOT NULL,					  	                  # Name of course
  description			        VARCHAR(255),							  	                        # Description of course
  PRIMARY KEY (course_id)
);

CREATE TABLE History
(
    history_id			      INT(10) unsigned NOT NULL AUTO_INCREMENT,	            # Primary key: unique history ID  
    trainee_id			      INT(10) unsigned,							                        # Trainee ID  
    course_id			        INT(10) unsigned,							                        # Course ID  
    start				          DATE NOT NULL,								                        # Timestamp for when course was started  
    end					          DATE NOT NULL,								                        # Timestamp for when course was finished  
    status				        TINYINT(4) unsigned NOT NULL,                         # Whether the course was passed(1) or not(0)
    PRIMARY KEY (history_id),
    CONSTRAINT `Constr_History_Trainee_fk` FOREIGN KEY `Trainee_fk` (trainee_id) REFERENCES Trainee (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Constr_History_Course_fk` FOREIGN KEY `Course_fk` (course_id) REFERENCES Course (course_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

# Заполнение данных
INSERT INTO Trainee ( name, email ) VALUES
( 'Dmitry', 'dima@ya.ru' ),
( 'Vlad', 	'vlad@ya.ru' ),
( 'Damir', 	'damir@ya.ru' ),
( 'Alexey',	'alexey@ya.ru' ),
( 'Sasha', 	'sasha@ya.ru' ),
( 'Sonya', 	'sonya@ya.ru' ),
( 'Petr', 	'petr@ya.ru' ),
( 'Olya', 	'olya@ya.ru' ),
( 'Sveta', 	'sveta@ya.ru' ),
( 'Egor', 	'egor@ya.ru' );

INSERT INTO Course ( name, description ) VALUES
( 'C++', 	'advanced course' ),
( 'C#', 	'intermediate couse' ),
( 'C', 		'impossible course' ),
( 'Python',	NULL ),
( 'PHP', 	'current course' ),
( 'Go', 	NULL ),
( 'JS', 	'beginner course' ),
( 'TS', 	'intermediate course' ),
( 'React', 	'beginner course' ),
( 'Java', 	NULL );

INSERT INTO History ( trainee_id, course_id, start, end, status ) VALUES 
(1, 5,  '2021-11-28', '2021-12-21', 1), 
(1, 5,  '2010-03-03', '2010-05-21', 0), 
(8, 5,  '2013-12-15', '2021-10-11', 0), 
(4, 5,  '2015-09-25', '2021-10-03', 1), 
(9, 2,  '2015-03-01', '2015-03-28', 1), 
(8, 4,  '2021-08-01', '2021-09-01', 0), 
(1, 7,  '2020-03-03', '2021-02-08', 1), 
(3, 10, '2021-11-20', '2021-12-05', 1), 
(2, 8,  '2020-03-11', '2020-03-17', 0), 
(1, 2,  '2006-10-21', '2007-03-02', 1);

# Запрос 1
SELECT 
    Trainee.name AS `trainee name`, 
	Trainee.email AS `trainee email`, 
    Course.name AS `course name`, 
    History.end AS `history end` from History
    INNER JOIN Trainee ON History.trainee_id = Trainee.id INNER JOIN Course ON History.course_id = Course.course_id
    WHERE
        (History.end BETWEEN CURRENT_DATE - INTERVAL 2 MONTH AND CURRENT_DATE - INTERVAL 1 MONTH)
    AND
    	Course.name LIKE 'PHP'
    AND
    	History.status = 1;

# Запрос 2
SELECT
    Course.name AS `course name`, 
    COUNT(Course.course_id) AS `quantity` from History
    INNER JOIN Course ON History.course_id = Course.course_id
    WHERE
    	(History.status = 1)
    AND
    	(History.start BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL 30 DAY)
    GROUP BY Course.course_id;