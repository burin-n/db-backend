DROP DATABASE if exists RegChula;
CREATE DATABASE RegChula;
USE RegChula;

DROP TABLE if exists Faculty;
CREATE TABLE Faculty (
	FID			varchar(5) not null,
    FName		varchar(15) not null,
    FShortName	varchar(3) not null,
    primary key (FID)
);

DROP TABLE if exists Department;
CREATE TABLE Department (
	FID			varchar(5) not null,
	DID			varchar(5) not null,
    DName		varchar(15) not null,
    DShortName	varchar(3) not null,
    primary key (FID, DID),
    constraint fk_FID
		foreign key (FID)
        references Faculty(FID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Building;
CREATE TABLE Building (
	BID			varchar(5) not null,
    BName		varchar(15) not null,
    BShortName	varchar(3) not null,
    primary key (BID)
);

DROP TABLE if exists Room;
CREATE TABLE Room (
	BID			varchar(5) not null,
	RID			varchar(5) not null,
    Capacity	int unsigned default 0,
    primary key (BID, RID),
    constraint fk_BID
		foreign key (BID)
        references Building(BID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Curricullum;
CREATE TABLE Curriculum (
	FID			varchar(5) not null,
	DID			varchar(5) not null,
    CID			varchar(5) not null,
    CName		varchar(15) not null,
    Fee			int unsigned default 0,
    OverallCredit	int unsigned not null,
    GenedCredit		int unsigned default 12,
    FreeElecCredit	int unsigned default 6,
    ApproveCredit	int unsigned default 0,
    GenlangCredit	int unsigned default 0,
    primary key (FID, DID, CID),
    constraint fk_Dpk
		foreign key (FID, DID)
        references Department(FID, DID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Student;
CREATE TABLE Student (
	SID		varchar(10) not null,
    Fname	varchar(15) not null,
    Mname	varchar(15) not null,
    Lname	varchar(15) not null,
    SSN		varchar(13) not null,
    Sex		enum('F', 'M') default 'F',
    Bdate	date not null,
    Email	varchar(20) not null,
    Address	varchar(30) not null,
	FID		varchar(5) not null,
	DID		varchar(5) not null,
    CID		varchar(5) not null,
    primary key (SID),
    constraint fk_Cpk
		foreign key (FID, DID, CID)
        references Curriculum(FID, DID, CID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Teacher;
CREATE TABLE Teacher (
	TID		varchar(10) not null,
    Fname	varchar(15) not null,
    Mname	varchar(15) not null,
    Lname	varchar(15) not null,
    SSN		varchar(13) not null,
    Sex		enum('F', 'M') default 'F',
    Bdate	date not null,
    Email	varchar(20) not null,
    Address	varchar(30) not null,
	FID		varchar(5) not null,
	DID		varchar(5) not null,
    primary key (TID),
    constraint fk_DpkT
		foreign key (FID, DID)
        references Department(FID, DID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Subj;
CREATE TABLE Subj (
	SID		varchar(7) not null,
    SName	varchar(15) not null,
    Credit	int unsigned default 3,
    SType	varchar(9),
    primary key (SID)
);

DROP TABLE if exists Course;
CREATE TABLE Course (
	SubjID		varchar(7) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	MExamDate	datetime,
    FExamDate	datetime,
    primary key (SubjID, CYear, CSemester),
    constraint fk_SubjID
		foreign key (SubjID)
        references Subj(SID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Section;
CREATE TABLE Section (
	SubjID		varchar(7) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	SecID		int unsigned default 1,
	Seat		int unsigned default 1,
    RegSeat		int unsigned default 0,		##### derive
    primary key (SubjID, CYear, CSemester, SecID),
    constraint fk_CoursePk
		foreign key (SubjID, CYear, CSemester)
        references Course(SubjID, CYear, CSemester)
			on delete cascade
            on update cascade
);

DROP TABLE if exists SecTime;
CREATE TABLE Sectime (
	SubjID		varchar(5) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	SecID		int unsigned default 1,
	SDay		int unsigned,
    StartTime	time,
    FinishTime	time,
	BuildID		varchar(5) not null,
	RoomID		varchar(5) not null,
    primary key (SubjID, CYear, CSemester, SecID, SDay, StartTime),
    constraint fk_SectionPk
		foreign key (SubjID, CYear, CSemester, SecID)
        references Section(SubjID, CYear, CSemester, SecID)
			on delete cascade
            on update cascade,
    constraint fk_RoomPk
		foreign key (BuildID, RoomID)
        references Room(BID, RID)
			on delete cascade
            on update cascade,
	constraint dayOfWeek
		check (SDay >= 1 and SDay <= 7)
);

DROP TABLE if exists RoomTable;
CREATE TABLE RoomTable (
	BuildID		varchar(5) not null,
	RoomID		varchar(5) not null,
    StartTime	time not null,
    FinishTime	time not null,
    ReserveBy	varchar(15) not null,
    Objective	varchar(15) not null,
    primary key (BuildID, RoomID, StartTime),
    constraint fk_RoomTPk
		foreign key (BuildID, RoomID)
        references Room(BID, RID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists FeeStatus;
CREATE TABLE FeeStatus (
	StudentID	varchar(10) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
    FStatus		enum('Y', 'N') default 'N',
    primary key (StudentID, CYear, CSemester),
    constraint fk_StudentIDF
		foreign key (StudentID)
        references Student(SID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Announcement;
CREATE TABLE Announcement (
	AID			int not null auto_increment,
	ADate		datetime default current_timestamp,
	Description	varchar(30) not null,
    primary key (AID)
);

DROP TABLE if exists Request;
CREATE TABLE Request (
	StudentID	varchar(10) not null,
	SubjID		varchar(5) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	SecID		int unsigned default 1,
    primary key (StudentID, SubjID, CYear, CSemester, SecID),
    constraint fk_StudentIDR
		foreign key (StudentID)
        references Student(SID)
			on delete cascade
            on update cascade,
    constraint fk_SectionPkR
		foreign key (SubjID, CYear, CSemester, SecID)
        references Section(SubjID, CYear, CSemester, SecID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists Register;
CREATE TABLE Register (
	StudentID	varchar(10) not null,
	SubjID		varchar(5) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	SecID		int unsigned default 1,
    Grade		int unsigned,		####
    MSeatNo		int unsigned,
    FSeatNo		int unsigned,
    primary key (StudentID, SubjID, CYear, CSemester, SecID),
    constraint fk_StudentIDG
		foreign key (StudentID)
        references Student(SID)
			on delete cascade
            on update cascade,
    constraint fk_SectionPkG
		foreign key (SubjID, CYear, CSemester, SecID)
        references Section(SubjID, CYear, CSemester, SecID)
			on delete cascade
            on update cascade,
	constraint gradeValue
		check (Grade >= 0 and Grade <= 4)
);

DROP TABLE if exists Teach;
CREATE TABLE Teach (
	TeacherID	varchar(10) not null,
	SubjID		varchar(5) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	SecID		int unsigned default 1,
    primary key (TeacherID, SubjID, CYear, CSemester, SecID),
    constraint fk_TeacherIDT
		foreign key (TeacherID)
        references Teacher(TID)
			on delete cascade
            on update cascade,
    constraint fk_SectionPkT
		foreign key (SubjID, CYear, CSemester, SecID)
        references Section(SubjID, CYear, CSemester, SecID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists MidtermExamRoom;
CREATE TABLE MidtermExamRoom (
	SubjID		varchar(7) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	BuildID		varchar(5) not null,
	RoomID		varchar(5) not null,
    primary key (SubjID, CYear, CSemester, BuildID, RoomID),
    constraint fk_CoursePkM
		foreign key (SubjID, CYear, CSemester)
        references Course(SubjID, CYear, CSemester)
			on delete cascade
            on update cascade,
    constraint fk_RoomPkM
		foreign key (BuildID, RoomID)
        references Room(BID, RID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists FinalExamRoom;
CREATE TABLE FinalExamRoom (
	SubjID		varchar(7) not null,
    CYear		year not null,
    CSemester	enum('1', '2') not null,
	BuildID		varchar(5) not null,
	RoomID		varchar(5) not null,
    primary key (SubjID, CYear, CSemester, BuildID, RoomID),
    constraint fk_CoursePkF
		foreign key (SubjID, CYear, CSemester)
        references Course(SubjID, CYear, CSemester)
			on delete cascade
            on update cascade,
    constraint fk_RoomPkF
		foreign key (BuildID, RoomID)
        references Room(BID, RID)
			on delete cascade
            on update cascade
);

DROP TABLE if exists CompulsorySubject;
CREATE TABLE CompulsorySubject (
	FID		varchar(5) not null,
	DID		varchar(5) not null,
    CID		varchar(5) not null,
    SubjID	varchar(7) not null,
    primary key (FID, DID, CID, SubjID),
    constraint fk_SujIDC
		foreign key (SubjID)
        references Subj(SID)
			on delete cascade
            on update cascade,
    constraint fk_CpkC
		foreign key (FID, DID, CID)
        references Curriculum(FID, DID, CID)
			on delete cascade
            on update cascade
);
