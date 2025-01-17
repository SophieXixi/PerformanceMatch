DROP TABLE Supports;
DROP TABLE AudienceVote;
DROP TABLE JudgeVote;
DROP TABLE Match_Winner;
DROP TABLE Match_Cap;
DROP TABLE Match_Addr;
DROP TABLE Match_Date;
DROP TABLE Group;
DROP TABLE Judge;
DROP TABLE Audience_Ticket;
DROP TABLE Audience_Info;
DROP TABLE Sponsor;
DROP TABLE Song;
DROP TABLE Singer_R2;
DROP TABLE Singer_R1;
DROP TABLE Band;
DROP TABLE Performer;
DROP TABLE Artist;


CREATE TABLE Artist (
    artistID INTEGER,
    artist_name VARCHAR(20) NOT NULL,
    PRIMARY KEY (artistID)
);

CREATE TABLE Performer (
    performerID INTEGER,
    performer_name VARCHAR(20) NOT NULL,
    debut_year INTEGER,
    num_fans INTEGER,
    groupID INTEGER NOT NULL,
    PRIMARY KEY (performerID),
    FOREIGN KEY (groupID) REFERENCES Group(groupID)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE Band (
    num_avail_instr INTEGER,
    performerID INTEGER NOT NULL,
    PRIMARY KEY (performerID),
    FOREIGN KEY (performerID) REFERENCES Performer(performerID)
    	ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE Singer_R1 (
    performerID INTEGER,
    repre_song VARCHAR(30),
    num_votes INTEGER,
    birth_date DATE,
    PRIMARY KEY (performerID),
    FOREIGN KEY (performerID) REFERENCES Performer(performerID)
    	ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE Singer_R2 (
    birth_date DATE,
    age INTEGER,
    PRIMARY KEY (birth_date),
    FOREIGN KEY (birth_date) REFERENCES Singer_R1(birth_date)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE Song (
    song_name VARCHAR(30),
    genre VARCHAR(10),
    artistID INTEGER NOT NULL,
    PRIMARY KEY (song_name),
    FOREIGN KEY (artistID) REFERENCES Artist(artistID)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE Sponsor (
    company_name VARCHAR(20),
    amount INTEGER,
    PRIMARY KEY (company_name)
);

CREATE TABLE Audience_Info (
    audienceID INTEGER,
    age INTEGER,
    name VARCHAR(20),
    favorite_singer VARCHAR(20),
    ticket_type VARCHAR(10),
    PRIMARY KEY (audienceID)
);

CREATE TABLE Audience_Ticket (
    ticket_type VARCHAR(10),
    fee INTEGER,
    PRIMARY KEY (ticket_type),
    FOREIGN KEY (ticket_type) REFERENCES Audience_Info(ticket_type)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE Judge (
    judgeID INTEGER,
    name VARCHAR(20),
    debut_year INTEGER,
    PRIMARY KEY (judgeID)
);

CREATE TABLE Group (
    groupID INTEGER,
    number_votes INTEGER,
    matchID INTEGER NOT NULL,
    song_name VARCHAR(20) NOT NULL,
    PRIMARY KEY (groupID),
    FOREIGN KEY (matchID) REFERENCES Match_Date(matchID),
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
    FOREIGN KEY (song_name) REFERENCES Song(song_name)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE Match_Date (
    matchID INTEGER,
    match_date DATE,
    PRIMARY KEY (matchID)
);

CREATE TABLE Match_Addr (
    match_date DATE,
    location VARCHAR(20),
    PRIMARY KEY (match_date),
    FOREIGN KEY (match_date) REFERENCES Match_Date(match_date)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE Match_Cap (
    location VARCHAR(20),
    capacity INTEGER,
    PRIMARY KEY (location),
    FOREIGN KEY (location) REFERENCES Match_Addr(location)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE Match_Winner (
    performerID INTEGER,
    category VARCHAR(20),
    matchID INTEGER,
    PRIMARY KEY (category, matchID),
    FOREIGN KEY (matchID) REFERENCES Match_Date(matchID)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE JudgeVote (
    judgeID INTEGER,
    groupID INTEGER,
    PRIMARY KEY (judgeID, groupID),
    FOREIGN KEY (judgeID) REFERENCES Judge(judgeID)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
    FOREIGN KEY (groupID) REFERENCES Group(groupID)
    	ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);

CREATE TABLE AudienceVote (
    audienceID INTEGER,
    performerID INTEGER,
    PRIMARY KEY (audienceID, performerID),
    FOREIGN KEY (audienceID) REFERENCES Audience_Info(audienceID),
        ON DELETE SET DEFAULT
		ON UPDATE CASCADE
    FOREIGN KEY (performerID) REFERENCES Performer(performerID)
        ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE Supports (
    company_name VARCHAR(20),
    matchID INTEGER,
    PRIMARY KEY (company_name, matchID),
    FOREIGN KEY (company_name) REFERENCES Sponsor(company_name),
        ON DELETE SET DEFAULT
		ON UPDATE CASCADE
    FOREIGN KEY (matchID) REFERENCES Match_Date(matchID)
        ON DELETE SET DEFAULT
		ON UPDATE CASCADE
);


INSERT INTO Artist VALUES (6000, ‘Adele’);
INSERT INTO Artist VALUES (6001, ‘Taylor Swift’);
INSERT INTO Artist VALUES (6002, ‘Bruno Mars’);
INSERT INTO Artist VALUES (6003, ‘Ed Sheeran’);
INSERT INTO Artist VALUES (6004, ‘Billie Eilish’);
INSERT INTO Performer VALUES (3000, ‘John’, 2020, 2000, 5000);
INSERT INTO Performer VALUES (3001, ‘Amy’, 2000, 3000, 5001);
INSERT INTO Performer VALUES (3002, ‘Max’, 2006, 5000, 5002);
INSERT INTO Performer VALUES (3003, ‘Elsa’, 2017, 10013, 5003);
INSERT INTO Performer VALUES (3004, ‘Tom’, 2023, 6000, 5004);
INSERT INTO Performer VALUES (3100, ‘Band 1’, 2024, 500, 5000);
INSERT INTO Performer VALUES (3101, ‘Band 2’, 2024, 300, 5001);
INSERT INTO Performer VALUES (3102, ‘Band 3’, 2024, 200, 5002);
INSERT INTO Performer VALUES (3103, ‘Band 4’’, 2024, 600, 5003);
INSERT INTO Performer VALUES (3104, ‘Band 5’, 2024, 100, 5004);
INSERT INTO Band VALUES(8, 3100)
INSERT INTO Band VALUES(5, 3101)
INSERT INTO Band VALUES(2, 3102)
INSERT INTO Band VALUES(4, 3103)
INSERT INTO Band VALUES(7, 3104)
INSERT INTO Singer_R1 VALUES(3000, ‘Happy End’, 100, ‘2000-01-30’)
INSERT INTO Singer_R1 VALUES(3001, ‘Blue Sky’, 80, ‘1995-04-22’)
INSERT INTO Singer_R1 VALUES(3002, ‘Listen’, 90,‘1999-08-15’)
INSERT INTO Singer_R1 VALUES(3003, ‘Ocean’’, 70, ‘2001-10-03’)
INSERT INTO Singer_R1 VALUES(3004, ‘Music World’, 120, ‘1998-02-11’)
INSERT INTO Singer_R2 VALUES( ‘2000-01-30’, 24)
INSERT INTO Singer_R2 VALUES(‘1995-04-22’, 29)
INSERT INTO Singer_R2 VALUES(’1999-08-15’, 25)
INSERT INTO Singer_R2 VALUES(‘2001-10-03’, 23)
INSERT INTO Singer_R2 VALUES( ‘1998-02-11’, 26)
INSERT INTO Song VALUES (‘Rolling in the Deep’, ‘Pop’, 6000);
INSERT INTO Song VALUES (‘Love Story’, ‘Country’, 6001);
INSERT INTO Song VALUES ( ‘The Lazy Song’, ‘Reggae’, 6002);
INSERT INTO Song VALUES (‘Shape of You’, ‘Pop’, 6003);
INSERT INTO Song VALUES (‘Bad Guy’, ‘Pop’, 6004);
INSERT INTO Sponsor VALUES ('Pepsi', 10000)
INSERT INTO Sponsor VALUES ('Aqiyi', 20000)
INSERT INTO Sponsor VALUES ('Youku', 25000)
INSERT INTO Sponsor VALUES ('Tesla', 9000)
INSERT INTO Sponsor VALUES ('BMO', 500000)
INSERT INTO Audience_Info VALUES (1000, 20, ‘Alice’, ‘SingerA’, ‘General’’)
INSERT INTO Audience_Info VALUES (1001, 36, ‘Bob’, ‘Taylor Swift’, ‘VIP’)
INSERT INTO Audience_Info VALUES (1002, 55, ‘Cindy’, ‘SingerC’, ‘Early Bird’)
INSERT INTO Audience_Info VALUES (1003, 68, ‘Dov’, ‘Ed Sheeran’, ‘Reserved’)
INSERT INTO Audience_Info VALUES (1004, 16, ‘Elyn’, ‘Ed Sheeran’, ‘Child’)
INSERT INTO Audience_Ticket VALUES (‘General’, 50)
INSERT INTO Audience_Ticket VALUES (‘VIP’, 80)
INSERT INTO Audience_Ticket VALUES (‘Early Bird, 40)
INSERT INTO Audience_Ticket VALUES (‘Reserved’, 70)
INSERT INTO Audience_Ticket VALUES (‘Child’, 20)
INSERT INTO Judge VALUES (2000, ‘Judgea’, 2003)
INSERT INTO Judge VALUES (2001, ‘Judgeb’, 1995)
INSERT INTO Judge VALUES (2002, ‘Judgec’, 1999)
INSERT INTO Judge VALUES (2003, ‘Judged’, 2000)
INSERT INTO Judge VALUES (2004, ‘Judgee’, 2005)
INSERT INTO Group VALUES (5000, 750, 4000, ‘Love Story’)
INSERT INTO Group VALUES (5001, 860, 4001, ‘Bad Guy’)
INSERT INTO Group VALUES (5002, 900, 4001, ‘Bad Guy’)
INSERT INTO Group VALUES (5003, 837, 4000, ‘Love Story’)
INSERT INTO Group VALUES (5004, 1012, 4002, ‘Shape of You’)
INSERT INTO Match_Date VALUES (4000, '2023-04-03');
INSERT INTO Match_Date VALUES (4001, '2023-04-03');
INSERT INTO Match_Date VALUES (4002, '2023-04-10');
INSERT INTO Match_Date VALUES (4003, '2023-04-10');
INSERT INTO Match_Date VALUES (4004, '2023-04-17');
INSERT INTO Match_Addr VALUES ('2023-04-03', 'Blue Stadium');
INSERT INTO Match_Addr VALUES ('2023-04-10', 'Red Theatre');
INSERT INTO Match_Addr VALUES ('2023-04-17', 'The Amphitheatre');
INSERT INTO Match_Addr VALUES ('2023-04-24', 'BMO Stadium');
INSERT INTO Match_Addr VALUES ('2023-04-25', 'Madison Square Garden');
INSERT INTO Match_Cap VALUES ('Blue Stadium', 1000);
INSERT INTO Match_Cap VALUES ('Red Theatre', 1100);
INSERT INTO Match_Cap VALUES ('The Amphitheatre', 900);
INSERT INTO Match_Cap VALUES ('BMO Stadium', 850);
INSERT INTO Match_Cap VALUES ('Madison Square Garden', 1500);
INSERT INTO Match_Winner VALUES (5000, ‘group’, 4000);
INSERT INTO Match_Winner VALUES (5001, 'group', 4001);
INSERT INTO Match_Winner VALUES (3000, 'singer', 4000);
INSERT INTO Match_Winner VALUES (3001, 'singer', 4001);
INSERT INTO Match_Winner VALUES (5004, 'group', 4002);
INSERT INTO JudgeVote VALUES (2000, 5000);
INSERT INTO JudgeVote VALUES (2001, 5001);
INSERT INTO JudgeVote VALUES (2002, 5002);
INSERT INTO JudgeVote VALUES (2003, 5003);
INSERT INTO JudgeVote VALUES (2004, 5004);
INSERT INTO AudienceVote VALUES (1000, 3000);
INSERT INTO AudienceVote VALUES (1001, 3001);
INSERT INTO AudienceVote VALUES (1002, 3002);
INSERT INTO AudienceVote VALUES (1003, 3003);
INSERT INTO AudienceVote VALUES (1004, 3004);
INSERT INTO Supports VALUES ('Pepsi', 4000);
INSERT INTO Supports VALUES ('Aqiyi', 4001);
INSERT INTO Supports VALUES ('Pepsi', 4002);
INSERT INTO Supports VALUES ('Youku', 4003);
INSERT INTO Supports VALUES ('BMO', 4004);