DROP TABLE Performer CASCADE CONSTRAINTS;
DROP TABLE Performer_Group CASCADE CONSTRAINTS;
DROP TABLE Song CASCADE CONSTRAINTS;
DROP TABLE Match_Date CASCADE CONSTRAINTS;
DROP TABLE Artist CASCADE CONSTRAINTS;
DROP TABLE Band CASCADE CONSTRAINTS;
DROP TABLE Singer_R1 CASCADE CONSTRAINTS;
DROP TABLE Singer_R2 CASCADE CONSTRAINTS;
DROP TABLE Sponsor CASCADE CONSTRAINTS;
DROP TABLE Audience_Ticket CASCADE CONSTRAINTS;
DROP TABLE Audience_Info CASCADE CONSTRAINTS;
DROP TABLE Judge CASCADE CONSTRAINTS;
DROP TABLE Match_Addr CASCADE CONSTRAINTS;
DROP TABLE Match_Cap CASCADE CONSTRAINTS;
DROP TABLE Match_Winner CASCADE CONSTRAINTS;
DROP TABLE JudgeVote CASCADE CONSTRAINTS;
DROP TABLE AudienceVote CASCADE CONSTRAINTS;
DROP TABLE Supports CASCADE CONSTRAINTS;

CREATE TABLE Artist (
    artistID INTEGER,
    artist_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (artistID)
);
CREATE TABLE Song (
    song_name VARCHAR(30),
    genre VARCHAR(20),
    artistID INTEGER NOT NULL,
    PRIMARY KEY (song_name),
    FOREIGN KEY(artistID) REFERENCES Artist(artistID) ON DELETE CASCADE
);
CREATE TABLE Match_Date (
    matchID INTEGER,
    mdate DATE UNIQUE,
    PRIMARY KEY (matchID)
);
CREATE TABLE Performer_Group (
    groupID INTEGER,
    number_votes INTEGER,
    matchID INTEGER NOT NULL,
    song_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (groupID),
    FOREIGN KEY (matchID) REFERENCES Match_Date(matchID) ON DELETE CASCADE,
    FOREIGN KEY (song_name) REFERENCES Song(song_name) ON DELETE CASCADE
);
CREATE TABLE Performer (
    performerID INTEGER,
    performer_name VARCHAR(30) NOT NULL,
    debut_year INTEGER,
    num_fans INTEGER,
    groupID INTEGER NOT NULL,
    PRIMARY KEY (performerID),
    FOREIGN KEY (groupID) REFERENCES Performer_Group(groupID) ON DELETE CASCADE
);

CREATE TABLE Band (
    num_avail_instr INTEGER,
    performerID INTEGER NOT NULL,
    PRIMARY KEY (performerID),
    FOREIGN KEY (performerID) REFERENCES Performer(performerID) ON DELETE CASCADE
);

CREATE TABLE Singer_R1 (
    performerID INTEGER,
    repre_song VARCHAR(30),
    number_votes INTEGER,
    birth_date DATE UNIQUE,
    PRIMARY KEY (performerID),
    FOREIGN KEY (performerID) REFERENCES Performer(performerID) ON DELETE CASCADE
);

CREATE TABLE Singer_R2 (
    birth_date DATE,
    age INTEGER,
    PRIMARY KEY (birth_date),
    FOREIGN KEY (birth_date) REFERENCES Singer_R1(birth_date) ON DELETE CASCADE
);

CREATE TABLE Sponsor (
    company_name VARCHAR(30),
    amount INTEGER,
    PRIMARY KEY (company_name)
);

CREATE TABLE Audience_Info (
    audienceID INTEGER,
    age INTEGER,
    audience_name VARCHAR(30),
    favorite_singer VARCHAR(30),
    ticket_type VARCHAR(20) UNIQUE,
    PRIMARY KEY (audienceID)
);

CREATE TABLE Audience_Ticket (
    ticket_type VARCHAR(20),
    fee INTEGER,
    PRIMARY KEY (ticket_type),
    FOREIGN KEY (ticket_type) REFERENCES Audience_Info(ticket_type) ON DELETE CASCADE
);

CREATE TABLE Judge (
    judgeID INTEGER,
    judge_name VARCHAR(30),
    debut_year INTEGER,
    PRIMARY KEY (judgeID)
);

CREATE TABLE Match_Addr (
    mdate DATE,
    match_location VARCHAR(30) UNIQUE,
    PRIMARY KEY (mdate),
    FOREIGN KEY (mdate) REFERENCES Match_Date(mdate) ON DELETE CASCADE
);

CREATE TABLE Match_Cap (
    match_location VARCHAR(30),
    capacity INTEGER,
    PRIMARY KEY (match_location),
    FOREIGN KEY (match_location) REFERENCES Match_Addr(match_location) ON DELETE CASCADE
);

CREATE TABLE Match_Winner (
    winnerID INTEGER,
    category VARCHAR(30),
    matchID INTEGER,
    PRIMARY KEY (category, matchID),
    FOREIGN KEY (matchID) REFERENCES Match_Date(matchID) ON DELETE CASCADE
);

CREATE TABLE JudgeVote (
    judgeID INTEGER,
    groupID INTEGER,
    PRIMARY KEY (judgeID, groupID),
    FOREIGN KEY (judgeID) REFERENCES Judge(judgeID) ON DELETE CASCADE,
    FOREIGN KEY (groupID) REFERENCES Performer_Group(groupID) ON DELETE CASCADE
);

CREATE TABLE AudienceVote (
    audienceID INTEGER,
    performerID INTEGER,
    PRIMARY KEY (audienceID, performerID),
    FOREIGN KEY (audienceID) REFERENCES Audience_Info(audienceID)  ON DELETE CASCADE,
    FOREIGN KEY (performerID) REFERENCES Performer(performerID) ON DELETE CASCADE
);

CREATE TABLE Supports (
    company_name VARCHAR(30),
    matchID INTEGER,
    PRIMARY KEY (company_name, matchID),
    FOREIGN KEY (company_name) REFERENCES Sponsor(company_name) ON DELETE CASCADE,
    FOREIGN KEY (matchID) REFERENCES Match_Date(matchID) ON DELETE CASCADE
);

INSERT INTO Artist VALUES (6000, 'Adele');
INSERT INTO Artist VALUES (6001, 'Taylor Swift');
INSERT INTO Artist VALUES (6002, 'Bruno Mars');
INSERT INTO Artist VALUES (6003, 'Ed Sheeran');
INSERT INTO Artist VALUES (6004, 'Billie Eilish');
INSERT INTO Song VALUES ('Rolling in the Deep', 'Pop', 6000);
INSERT INTO Song VALUES ('Love Story', 'Country', 6001);
INSERT INTO Song VALUES ('The Lazy Song', 'Reggae', 6002);
INSERT INTO Song VALUES ('Shape of You', 'Pop', 6003);
INSERT INTO Song VALUES ('Bad Guy', 'Pop', 6004);
INSERT INTO Match_Date VALUES (4000, DATE '2023-04-03');
INSERT INTO Match_Date VALUES (4001, DATE '2023-04-05');
INSERT INTO Match_Date VALUES (4002, DATE '2023-04-10');
INSERT INTO Match_Date VALUES (4003, DATE '2023-04-16');
INSERT INTO Match_Date VALUES (4004, DATE '2023-04-17');
INSERT INTO Performer_Group VALUES (5000, 750, 4000, 'Love Story');
INSERT INTO Performer_Group VALUES (5001, 860, 4001, 'Bad Guy');
INSERT INTO Performer_Group VALUES (5002, 900, 4001, 'Bad Guy');
INSERT INTO Performer_Group VALUES (5003, 837, 4000, 'Love Story');
INSERT INTO Performer_Group VALUES (5004, 1012, 4002, 'Shape of You');
INSERT INTO Performer VALUES (3000, 'John', 2020, 2000, 5000);
INSERT INTO Performer VALUES (3001, 'Amy', 2000, 3000, 5001);
INSERT INTO Performer VALUES (3002, 'Max', 2006, 5000, 5002);
INSERT INTO Performer VALUES (3003, 'Elsa', 2017, 10013, 5003);
INSERT INTO Performer VALUES (3004, 'Tom', 2023, 6000, 5004);
INSERT INTO Performer VALUES (3100, 'Band 1', 2024, 500, 5000);
INSERT INTO Performer VALUES (3101, 'Band 2', 2024, 300, 5001);
INSERT INTO Performer VALUES (3102, 'Band 3', 2024, 200, 5002);
INSERT INTO Performer VALUES (3103, 'Band 4', 2024, 600, 5003);
INSERT INTO Performer VALUES (3104, 'Band 5', 2024, 100, 5004);

INSERT INTO Band VALUES(8, 3100);
INSERT INTO Band VALUES(5, 3101);
INSERT INTO Band VALUES(2, 3102);
INSERT INTO Band VALUES(4, 3103);
INSERT INTO Band VALUES(7, 3104);

INSERT INTO Singer_R1 VALUES(3000, 'Happy End', 100, DATE '2000-01-30');
INSERT INTO Singer_R1 VALUES(3001, 'Blue Sky', 80, DATE '1995-04-22');
INSERT INTO Singer_R1 VALUES(3002, 'Listen', 90, DATE '1999-08-15');
INSERT INTO Singer_R1 VALUES(3003, 'Ocean', 70, DATE '2001-10-03');
INSERT INTO Singer_R1 VALUES(3004, 'Music World', 120, DATE '1998-02-11');

INSERT INTO Singer_R2 VALUES( DATE '2000-01-30', 24);
INSERT INTO Singer_R2 VALUES( DATE '1995-04-22', 29);
INSERT INTO Singer_R2 VALUES( DATE '1999-08-15', 25);
INSERT INTO Singer_R2 VALUES( DATE '2001-10-03', 23);
INSERT INTO Singer_R2 VALUES( DATE '1998-02-11', 26);

INSERT INTO Sponsor VALUES ('Pepsi', 10000);
INSERT INTO Sponsor VALUES ('Aqiyi', 20000);
INSERT INTO Sponsor VALUES ('Youku', 25000);
INSERT INTO Sponsor VALUES ('Tesla', 9000);
INSERT INTO Sponsor VALUES ('BMO', 500000);

INSERT INTO Audience_Info VALUES (1000, 20, 'Alice', 'SingerA', 'General');
INSERT INTO Audience_Info VALUES (1001, 36, 'Bob', 'Taylor Swift', 'VIP');
INSERT INTO Audience_Info VALUES (1002, 55, 'Cindy', 'SingerC', 'Early Bird');
INSERT INTO Audience_Info VALUES (1003, 68, 'Dov', 'Ed Sheeran', 'Reserved');
INSERT INTO Audience_Info VALUES (1004, 16, 'Elyn', 'Ed Sheeran', 'Child');

INSERT INTO Audience_Ticket VALUES ('General', 50);
INSERT INTO Audience_Ticket VALUES ('VIP', 80);
INSERT INTO Audience_Ticket VALUES ('Early Bird', 40);
INSERT INTO Audience_Ticket VALUES ('Reserved', 70);
INSERT INTO Audience_Ticket VALUES ('Child', 20);

INSERT INTO Judge VALUES (2000, 'Judgea', 2003);
INSERT INTO Judge VALUES (2001, 'Judgeb', 1995);
INSERT INTO Judge VALUES (2002, 'Judgec', 1999);
INSERT INTO Judge VALUES (2003, 'Judged', 2000);
INSERT INTO Judge VALUES (2004, 'Judgee', 2005);

INSERT INTO Match_Addr VALUES (DATE '2023-04-03', 'Blue Stadium');
INSERT INTO Match_Addr VALUES (DATE '2023-04-10', 'Red Theatre');
INSERT INTO Match_Addr VALUES (DATE '2023-04-17', 'The Amphitheatre');
INSERT INTO Match_Addr VALUES (DATE '2023-04-05', 'BMO Stadium');
INSERT INTO Match_Addr VALUES (DATE '2023-04-16', 'Madison Square Garden');

INSERT INTO Match_Cap VALUES ('Blue Stadium', 1000);
INSERT INTO Match_Cap VALUES ('Red Theatre', 1100);
INSERT INTO Match_Cap VALUES ('The Amphitheatre', 900);
INSERT INTO Match_Cap VALUES ('BMO Stadium', 850);
INSERT INTO Match_Cap VALUES ('Madison Square Garden', 1500);

INSERT INTO Match_Winner VALUES (5000, 'group', 4000);
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
