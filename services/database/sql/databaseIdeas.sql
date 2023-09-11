-- Create Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(1024) UNIQUE NOT NULL,
    Password VARCHAR(1024) NOT NULL, -- hashed
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP
);

-- Create PaidAccounts Table
CREATE TABLE PaidAccounts (
    AccountID INT PRIMARY KEY AUTO_INCREMENT,
    SubscriptionType VARCHAR(128) DEFAULT 'Free',
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpiryDate TIMESTAMP
);

-- Create UserAccounts Table
CREATE TABLE UserAccounts (
    UserAccountID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    AccountID INT,
    Role VARCHAR(128) DEFAULT 'User',
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (AccountID) REFERENCES PaidAccounts(AccountID)
);




-- Create Locations Table
CREATE TABLE Locations (
    LocationID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(128),
    Image VARCHAR(512),
    Description VARCHAR(512),
    GenerationDescription VARCHAR(2048),
    IsDefault BOOLEAN,
    UserCreatedID INT NULL,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Create Characters Table
CREATE TABLE Characters (
    CharacterID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(128),
    Image VARCHAR(512),
    Description VARCHAR(512),
    GenerationDescription VARCHAR(2048),
    IsDefault BOOLEAN,
    UserCreatedID INT NULL,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Create Books Table
CREATE TABLE Books (
    BookID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(1024),
    CoverImage VARCHAR(512),
    LocationID INT,
    CharacterID INT,
    UserID INT,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID),
    FOREIGN KEY (CharacterID) REFERENCES Characters(CharacterID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Updated Pages Table
CREATE TABLE Pages (
    PageID INT PRIMARY KEY AUTO_INCREMENT,
    BookID INT,
    PageNumber INT,
    Text TEXT,
    Image VARCHAR(512),
    PositiveImagePrompt VARCHAR(MAX),
    NegativeImagePrompt VARCHAR(MAX),
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);