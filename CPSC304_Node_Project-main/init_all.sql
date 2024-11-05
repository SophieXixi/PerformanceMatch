CREATE TABLE Artist (
    artistID INTEGER,
    artist_name VARCHAR(20) NOT NULL,
    PRIMARY KEY (artistID)
);
CREATE TABLE Song(
    song_name VARCHAR(20),
    genre VARCHAR(10),
    artistID INTEGER NOT NULL,
    PRIMARY KEY (song_name),
    FOREIGN KEY(artistID) REFERENCES Artist(artistID)
);
CREATE TABLE Match_Date (
    matchID INTEGER,
    match_date DATE,
    PRIMARY KEY (matchID)
);
CREATE TABLE Performer_Group (
    groupID INTEGER,
    number_votes INTEGER,
    matchID INTEGER NOT NULL,
    song_name VARCHAR(20) NOT NULL,
    PRIMARY KEY (groupID),
    FOREIGN KEY (matchID) REFERENCES Match_Date(matchID),
    FOREIGN KEY (song_name) REFERENCES Song(song_name)
);
CREATE TABLE Performer (
    performerID INTEGER,
    performer_name VARCHAR(20) NOT NULL,
    debut_year INTEGER,
    num_fans INTEGER,
    groupID INTEGER NOT NULL,
    PRIMARY KEY (performerID),
    FOREIGN KEY (groupID) REFERENCES Performer_Group(groupID)
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
INSERT INTO Match_Date VALUES (4001, DATE '2023-04-03');
INSERT INTO Match_Date VALUES (4002, DATE '2023-04-10');
INSERT INTO Match_Date VALUES (4003, DATE '2023-04-10');
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