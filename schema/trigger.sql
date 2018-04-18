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
CREATE TRIGGER DeleteOverallCredit
AFTER insert on CompulsorySubject for each row
begin
	UPDATE Curriculum
    set OverallCredit = OverallCredit - (SELECT Credit from Subj where SID = new.SubjID)
    where FID = old.FID and DID = old.DID and CID = old.CID;
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
    where SubjID = old.SubjID and CYear = old.CYear and CSemester = old.CSemester and SecID = old.SecID;
end //
DELIMITER ;

DELIMITER //
CREATE TRIGGER AddRoomTableForSection
AFTER insert on SecTime for each row
begin
	DECLARE dat, st, fn, firstdate, middate, endmiddate, finaldate datetime;
    SET firstdate = '2018-01-08 00:00:00';
    SET finaldate = '2018-05-04 00:00:00';
    SET dat = firstdate;

    while (dayofweek(dat) <> new.SDay) do
		SET dat = DATE_ADD(dat, INTERVAL 1 day);
    end while;

    while (dat < finaldate) do
		INSERT INTO RoomTable
			values (new.BuildID, new.RoomID, dat + new.StartTime, dat + new.FinishTime, 'auto', new.SubjID);
		SET dat = DATE_ADD(dat, INTERVAL 1 week);
	end while;
end //
DELIMITER ;
