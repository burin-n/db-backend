INSERT INTO Faculty
	values
		('21', 'Engineering', 'ENG'),
        ('22', 'Art', 'ART'),
        ('23', 'Science', 'SCI');

INSERT INTO Department
	values
		('21', '01', 'Civil', 'CE'),
        ('21', '02', 'Electrical', 'EE'),
        ('21', '10', 'Computer', 'CP'),
        ('22', '01', 'Thai', 'TH'),
        ('23', '01', 'Math', 'MAT');

INSERT INTO Building
	values
		('03', 'Engineering3', 'ENG3'),
        ('10', 'Eng 100 Y', 'EN100');
    
INSERT INTO Room
	values
		('03', '204', 40),
        ('03', '315', 120),
        ('10', '401', 30);
    
INSERT INTO Curriculum (FID, DID, CID, CName, Fee)
	values
		('21', '01', '1', 'B.CE', 21000),
        ('21', '02', '1', 'B.EE', 21000),
        ('21', '10', '1', 'B.CP', 21000),
        ('21', '10', '2', 'B.ICE', 60000),
        ('22', '01', '1', 'B.TH', 17000),
        ('23', '01', '1', 'B.MAT', 21000);
    
INSERT INTO Student
	values
        ('8886655551','Chanon','A','Deachsupa', '8886655551123', 'M', '1994-03-11', 'ChanonD@chula.ac.th', 'Chulalongkorn U., BKK', '21', '10', '1'),
        ('1234567890','John','B','Smith', '1234567890123', 'M', '1965-01-09', 'JohnS@chula.ac.th','731 Fondren, Houston, TX', '21', '10', '1'),
        ('4534534530','Joyce','A','English', '4534534530123', 'F', '1972-07-31', 'JEnglish@chula.ac.th','5631 Rice, Houston, TX', '21', '10', '1'),
        ('6668844444','Ramesh','K','Narayan', '6668844444123', 'M','1962-09-15', 'RamNar@chula.ac.th','975 Fire Oak, Humble, TX', '21', '01', '1'),
        ('9876543210','Jennifer','S','Wallance', '9876543210123', 'F', '1941-06-20', 'JenW@chula.ac.th','291 Berry, Bellaire, TX', '21', '10', '2'),
        ('9998877777','Alicia','J','Zelaya', '9998877777777', 'F', '1968-01-19', 'AliZelaya@chula.ac.th','3321 Castle, Spring, TX', '23', '01', '1');
    
INSERT INTO Teacher
	values
        ('3334455551','Franklin','T','Wong', '3334455551123', 'M', '1955-12-08', 'FWong@chula.ac.th','638 Voss, Houston, TX', '21', '10'),
        ('9879879870','Ahmad','V','Jabbar', '9879879870123', 'M', '1969-03-29', 'AhmedJ@chula.ac.th','980 Dallas, Houston, TX', '22', '01');
    
INSERT INTO Subj
	values
		('2110101', 'Comprog', '3', null),
        ('2305106', 'Bird Watch', '3', 'Gened'),
        ('2200101', 'Int Jap', '3', 'GenLang');
        
    
INSERT INTO Course
	values
		('2110101', '2017', '1', '2017-10-04', '2017-12-12'),
        ('2110101', '2017', '2', '2018-03-04', '2018-05-12'),
        ('2200101', '2017', '2', null, '2018-05-08'),
        ('2305106', '2017', '2', null, null);
    
INSERT INTO Section (SubjID, CYear, CSemester, SecID, Seat)
	values
		('2110101', '2017', '1', '1', 40),
        ('2110101', '2017', '2', '1', 40),
        ('2110101', '2017', '2', '2', 40),
        ('2110101', '2017', '2', '33', 40),
        ('2200101', '2017', '2', '1', 35),
        ('2305106', '2017', '2', '1', 30);		
    
INSERT INTO RoomTable
	values
		('03', '315', '2018-04-20 16:00:00', '2018-04-20 18:00:00', 'FeCamp', 'First Meet');
    
INSERT INTO FeeStatus
	values
		('8886655551', '2017', '1', 'Y'),
        ('8886655551', '2017', '2', 'N');
    
INSERT INTO Announcement (Description)
	values
		('asdfasdfasdf');
    
INSERT INTO Request
	values
		('8886655551', '2110101', '2017', '2', '1');
    
INSERT INTO Register
	values
		('1234567890', '2110101', '2017', '1', '1', 'A', '01', '01'),
        ('8886655551', '2110101', '2017', '2', '1', 'X', '01', '01');
    
INSERT INTO Teach
	values
		('3334455551', '2110101', '2017', '2', '1');
    
INSERT INTO MidtermExamRoom
	values
		('2110101', '2017', '1', '03', '204'),
        ('2110101', '2017', '2', '03', '315');
    
INSERT INTO FinalExamRoom
	values
		('2110101', '2017', '1', '03', '204'),
        ('2110101', '2017', '2', '03', '315');
    
INSERT INTO CompulsorySubject
	values
		('21', '10', '1', '2110101');
