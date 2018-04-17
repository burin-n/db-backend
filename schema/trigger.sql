DELIMITER //
CREATE TRIGGER AddOverallCredit 
AFTER insert on CompulsorySubject for each row
begin
	UPDATE Curriculum
    set OverallCredit = OverallCredit + (SELECT Credit from Subj where SID = new.SubjID)
    where FID = new.FID and DID = new.DID and CID = new.CID;
end //
DELIMITER ;

DELIMITER //
CREATE TRIGGER AddRegisterSeat 
AFTER insert on Register for each row
begin
	UPDATE Section
    set RegSeat = RegSeat + 1
    where SubjID = new.SubjID and CYear = new.CYear and CSemester = new.CSemester and SecID = new.SecID;
end //
DELIMITER ;

DELIMITER //
CREATE TRIGGER DeleteRegisterSeat 
AFTER delete on Register for each row
begin
	UPDATE Section
    set RegSeat = RegSeat - 1
    where SubjID = delete.SubjID and CYear = delete.CYear and CSemester = delete.CSemester and SecID = delete.SecID;
end //
DELIMITER ;

DELIMITER //
CREATE TRIGGER DeleteRegisterSeat 
AFTER delete on Register for each row
begin
	UPDATE Section
    set RegSeat = RegSeat - 1
    where SubjID = old.SubjID and CYear = old.CYear and CSemester = old.CSemester and SecID = old.SecID;
end //
DELIMITER ;
