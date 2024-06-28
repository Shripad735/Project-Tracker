-- UserType table
CREATE TABLE UserTypes (
    UserTypeID INT PRIMARY KEY AUTO_INCREMENT,
    TypeName VARCHAR(50) UNIQUE NOT NULL
);

-- Insert initial user types
INSERT INTO UserTypes (TypeName) VALUES ('Admin'), ('Employee');

CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    UserTypeID INT NOT NULL,
    FOREIGN KEY (UserTypeID) REFERENCES UserTypes(UserTypeID)
);


CREATE TABLE Projects (
    ProjectID INT PRIMARY KEY AUTO_INCREMENT,
    ProjectName VARCHAR(100) NOT NULL,
    Description TEXT,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started'
);

CREATE TABLE Milestones (
    MilestoneID INT PRIMARY KEY AUTO_INCREMENT,
    ProjectID INT,
    MilestoneName VARCHAR(100) NOT NULL,
    Description TEXT,
    DueDate DATE NOT NULL,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
);

-- Transaction Tables
CREATE TABLE Tasks (
    TaskID INT PRIMARY KEY AUTO_INCREMENT,
    ProjectID INT,
    MilestoneID INT,
    TaskName VARCHAR(100) NOT NULL,
    Description TEXT,
    AssignedTo INT,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID),
    FOREIGN KEY (MilestoneID) REFERENCES Milestones(MilestoneID),
    FOREIGN KEY (AssignedTo) REFERENCES Users(UserID)
);

CREATE TABLE Assignments (
    AssignmentID INT PRIMARY KEY AUTO_INCREMENT,
    ProjectID INT,
    TaskID INT,
    UserID INT,
    AssignedDate DATE NOT NULL,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID),
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE CompletionProofs (
    ProofID INT PRIMARY KEY AUTO_INCREMENT,
    TaskID INT,
    SubmittedBy INT,
    SubmissionDate DATETIME NOT NULL,
    ProofFile VARCHAR(255) NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    VerifiedBy INT,
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID),
    FOREIGN KEY (SubmittedBy) REFERENCES Users(UserID),
    FOREIGN KEY (VerifiedBy) REFERENCES Users(UserID)
);

CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    ProjectID INT,
    TaskID INT,
    Message TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    NotificationStatus ENUM('Keep', 'Dismiss') DEFAULT 'Keep',
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID),
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID)
);


INSERT INTO Users (Username, Password, Email, UserTypeID) VALUES 
('AmitKumar', 'password123', 'amit.kumar@example.com', 1),
('SitaPatel', 'password123', 'sita.patel@example.com', 2),
('RajeshSharma', 'password123', 'rajesh.sharma@example.com', 2),
('MeenaGupta', 'password123', 'meena.gupta@example.com', 2),
('VikramSingh', 'password123', 'vikram.singh@example.com', 2);

INSERT INTO Projects (ProjectName, Description, StartDate, EndDate, Status) VALUES
('Project Alpha', 'Description for Project Alpha', '2024-01-01', '2024-06-30', 'Not Started'),
('Project Beta', 'Description for Project Beta', '2024-02-01', '2024-07-30', 'In Progress'),
('Project Gamma', 'Description for Project Gamma', '2024-03-01', '2024-08-30', 'Completed'),
('Project Delta', 'Description for Project Delta', '2024-04-01', '2024-09-30', 'Not Started'),
('Project Epsilon', 'Description for Project Epsilon', '2024-05-01', '2024-10-30', 'In Progress');

INSERT INTO Milestones (ProjectID, MilestoneName, Description, DueDate) VALUES
(1, 'Milestone 1', 'Description for Milestone 1', '2024-02-01'),
(1, 'Milestone 2', 'Description for Milestone 2', '2024-04-01'),
(2, 'Milestone 1', 'Description for Milestone 1', '2024-03-01'),
(3, 'Milestone 1', 'Description for Milestone 1', '2024-05-01'),
(4, 'Milestone 1', 'Description for Milestone 1', '2024-06-01');

INSERT INTO Tasks (ProjectID, MilestoneID, TaskName, Description, AssignedTo, StartDate, EndDate, Status) VALUES
(1, 1, 'Task 1', 'Description for Task 1', 2, '2024-01-10', '2024-01-20', 'Not Started'),
(1, 2, 'Task 2', 'Description for Task 2', 3, '2024-02-10', '2024-02-20', 'In Progress'),
(2, 3, 'Task 3', 'Description for Task 3', 4, '2024-03-10', '2024-03-20', 'Completed'),
(3, 4, 'Task 4', 'Description for Task 4', 5, '2024-04-10', '2024-04-20', 'Not Started'),
(4, 5, 'Task 5', 'Description for Task 5', 2, '2024-05-10', '2024-05-20', 'In Progress');

INSERT INTO Assignments (ProjectID, TaskID, UserID, AssignedDate) VALUES
(1, 1, 2, '2024-01-01'),
(1, 2, 3, '2024-01-15'),
(2, 3, 4, '2024-02-01'),
(3, 4, 5, '2024-03-01'),
(4, 5, 2, '2024-04-01');

INSERT INTO CompletionProofs (TaskID, SubmittedBy, SubmissionDate, ProofFile, Status) VALUES
(1, 2, '2024-01-21 10:00:00', 'proof1.pdf', 'Approved'),
(2, 3, '2024-02-21 11:00:00', 'proof2.pdf', 'Pending'),
(3, 4, '2024-03-21 12:00:00', 'proof3.pdf', 'Rejected'),
(4, 5, '2024-04-21 13:00:00', 'proof4.pdf', 'Approved'),
(5, 2, '2024-05-21 14:00:00', 'proof5.pdf', 'Pending');

INSERT INTO Notifications (UserID, ProjectID, TaskID, Message) VALUES
(2, 1, 1, 'Task 1 has been assigned to you.'),
(3, 1, 2, 'Task 2 has been assigned to you.'),
(4, 2, 3, 'Task 3 has been assigned to you.'),
(5, 3, 4, 'Task 4 has been assigned to you.'),
(2, 4, 5, 'Task 5 has been assigned to you.');

-- Triggers
DELIMITER //

CREATE OR REPLACE TRIGGER task_insert
AFTER INSERT ON Tasks
FOR EACH ROW
BEGIN
    UPDATE Milestones
    SET DueDate = (
        SELECT MAX(EndDate)
        FROM Tasks
        WHERE MilestoneID = NEW.MilestoneID
    )
    WHERE MilestoneID = NEW.MilestoneID;
END //

CREATE OR REPLACE TRIGGER task_update
AFTER UPDATE ON Tasks
FOR EACH ROW
BEGIN
    UPDATE Milestones
    SET DueDate = (
        SELECT MAX(EndDate)
        FROM Tasks
        WHERE MilestoneID = NEW.MilestoneID
    )
    WHERE MilestoneID = NEW.MilestoneID;
END //

CREATE OR REPLACE TRIGGER task_delete
AFTER DELETE ON Tasks
FOR EACH ROW
BEGIN
    UPDATE Milestones
    SET DueDate = (
        SELECT MAX(EndDate)
        FROM Tasks
        WHERE MilestoneID = OLD.MilestoneID
    )
    WHERE MilestoneID = OLD.MilestoneID;
END //

CREATE OR REPLACE TRIGGER milestone_insert
AFTER INSERT ON Milestones
FOR EACH ROW
BEGIN
    UPDATE Projects
    SET EndDate = (
        SELECT MAX(DueDate)
        FROM Milestones
        WHERE ProjectID = NEW.ProjectID
    )
    WHERE ProjectID = NEW.ProjectID;
END //

CREATE OR REPLACE TRIGGER milestone_update
AFTER UPDATE ON Milestones
FOR EACH ROW
BEGIN
    UPDATE Projects
    SET EndDate = (
        SELECT MAX(DueDate)
        FROM Milestones
        WHERE ProjectID = NEW.ProjectID
    )
    WHERE ProjectID = NEW.ProjectID;
END //

CREATE OR REPLACE TRIGGER milestone_delete
AFTER DELETE ON Milestones
FOR EACH ROW
BEGIN
    UPDATE Projects
    SET EndDate = (
        SELECT MAX(DueDate)
        FROM Milestones
        WHERE ProjectID = OLD.ProjectID
    )
    WHERE ProjectID = OLD.ProjectID;
END //

DELIMITER //

-- Trigger to ensure valid StartDate for Tasks
CREATE TRIGGER verify_task_startdate1
BEFORE INSERT ON Tasks
FOR EACH ROW
BEGIN
    IF NEW.StartDate < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date must be current or future date';
    END IF;
END //

CREATE TRIGGER verify_task_startdate2
BEFORE UPDATE ON Tasks
FOR EACH ROW
BEGIN
    IF NEW.StartDate < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date must be current or future date';
    END IF;
END //

-- Trigger to ensure valid StartDate for Projects
CREATE TRIGGER verify_project_startdate1
BEFORE INSERT ON projects
FOR EACH ROW
BEGIN
    IF NEW.StartDate < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date must be current or future date';
    END IF;
END //

CREATE TRIGGER verify_project_startdate2
BEFORE UPDATE ON projects
FOR EACH ROW
BEGIN
    IF NEW.StartDate < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date must be current or future date';
    END IF;
END //

DELIMITER //

-- Trigger to ensure EndDate is at least one day after StartDate for Tasks
CREATE OR REPLACE TRIGGER task_startenddates_insert
BEFORE INSERT ON Tasks
FOR EACH ROW
BEGIN
    IF NEW.EndDate <= NEW.StartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'End date must be at least one day after start date';
    END IF;
END //

CREATE OR REPLACE TRIGGER task_startenddates_update
BEFORE UPDATE ON Tasks
FOR EACH ROW
BEGIN
    IF NEW.EndDate <= NEW.StartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'End date must be at least one day after start date';
    END IF;
END //

-- Trigger to ensure EndDate is at least one day after StartDate for projects
CREATE OR REPLACE TRIGGER project_startenddates_insert
BEFORE INSERT ON projects
FOR EACH ROW
BEGIN
    IF NEW.EndDate <= NEW.StartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'End date must be at least one day after start date';
    END IF;
END //

CREATE OR REPLACE TRIGGER project_startenddates_update
BEFORE UPDATE ON projects
FOR EACH ROW
BEGIN
    IF NEW.EndDate <= NEW.StartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'End date must be at least one day after start date';
    END IF;
END //

DELIMITER //

-- Trigger to check if the AssignedTo user has UserTypeID 2 before inserting a task
CREATE TRIGGER check_assignedto_user_insert
BEFORE INSERT ON Tasks
FOR EACH ROW
BEGIN
    DECLARE userType INT;
    SELECT UserTypeID INTO userType FROM Users WHERE UserID = NEW.AssignedTo;
    IF userType != 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot assign the task to this user';
    END IF;
END //

-- Trigger to check if the AssignedTo user has UserTypeID 2 before updating a task
CREATE TRIGGER check_assignedto_user_update
BEFORE UPDATE ON Tasks
FOR EACH ROW
BEGIN
    DECLARE userType INT;
    SELECT UserTypeID INTO userType FROM Users WHERE UserID = NEW.AssignedTo;
    IF userType != 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot assign the task to this user';
    END IF;
END //

-- Trigger after inserting a task
CREATE TRIGGER check_taskstatus_insert
AFTER INSERT ON Tasks
FOR EACH ROW
BEGIN
    -- If a single task is in progress, set the milestone status to 'In Progress'
    IF NEW.Status = 'In Progress' THEN
        UPDATE Milestones
        SET Status = 'In Progress'
        WHERE MilestoneID = NEW.MilestoneID;
    END IF;

    -- If all tasks are completed, set the milestone status to 'Completed'
    IF (SELECT COUNT(*) FROM Tasks WHERE MilestoneID = NEW.MilestoneID AND Status != 'Completed') = 0 THEN
        UPDATE Milestones
        SET Status = 'Completed'
        WHERE MilestoneID = NEW.MilestoneID;
    END IF;
END //

-- Trigger after updating a task
CREATE TRIGGER check_taskstatus_update
AFTER UPDATE ON Tasks
FOR EACH ROW
BEGIN
    -- If a single task is in progress, set the milestone status to 'In Progress'
    IF NEW.Status = 'In Progress' THEN
        UPDATE Milestones
        SET Status = 'In Progress'
        WHERE MilestoneID = NEW.MilestoneID;
    END IF;

    -- If all tasks are completed, set the milestone status to 'Completed'
    IF (SELECT COUNT(*) FROM Tasks WHERE MilestoneID = NEW.MilestoneID AND Status != 'Completed') = 0 THEN
        UPDATE Milestones
        SET Status = 'Completed'
        WHERE MilestoneID = NEW.MilestoneID;
    END IF;
END //

-- Trigger after deleting a task
CREATE TRIGGER check_taskstatus_delete
AFTER DELETE ON Tasks
FOR EACH ROW
BEGIN
    -- If a single task is in progress, set the milestone status to 'In Progress'
    IF (SELECT COUNT(*) FROM Tasks WHERE MilestoneID = OLD.MilestoneID AND Status = 'In Progress') > 0 THEN
        UPDATE Milestones
        SET Status = 'In Progress'
        WHERE MilestoneID = OLD.MilestoneID;
    END IF;

    -- If all tasks are completed, set the milestone status to 'Completed'
    IF (SELECT COUNT(*) FROM Tasks WHERE MilestoneID = OLD.MilestoneID AND Status != 'Completed') = 0 THEN
        UPDATE Milestones
        SET Status = 'Completed'
        WHERE MilestoneID = OLD.MilestoneID;
    END IF;
END //

-- Trigger after inserting a task
CREATE TRIGGER after_task_insert_update_milestone_status
AFTER INSERT ON Tasks
FOR EACH ROW
BEGIN
    DECLARE total_tasks INT;
    DECLARE completed_tasks INT;
    
    -- Count total tasks and completed tasks for the milestone
    SELECT COUNT(*), COUNT(CASE WHEN Status = 'Completed' THEN 1 END)
    INTO total_tasks, completed_tasks
    FROM Tasks
    WHERE MilestoneID = NEW.MilestoneID;

    -- If all tasks are completed and a new task is inserted as Not Started, set milestone status to In Progress
    IF total_tasks = completed_tasks + 1 AND NEW.Status = 'Not Started' THEN
        UPDATE Milestones
        SET Status = 'In Progress'
        WHERE MilestoneID = NEW.MilestoneID;
    END IF;
END //

-- Trigger after updating a task
CREATE TRIGGER after_task_update_update_milestone_status
AFTER UPDATE ON Tasks
FOR EACH ROW
BEGIN
    DECLARE total_tasks INT;
    DECLARE completed_tasks INT;
    
    -- Count total tasks and completed tasks for the milestone
    SELECT COUNT(*), COUNT(CASE WHEN Status = 'Completed' THEN 1 END)
    INTO total_tasks, completed_tasks
    FROM Tasks
    WHERE MilestoneID = NEW.MilestoneID;

    -- If all tasks are completed and a task status changes to Not Started, set milestone status to In Progress
    IF total_tasks = completed_tasks + 1 AND NEW.Status = 'Not Started' THEN
        UPDATE Milestones
        SET Status = 'In Progress'
        WHERE MilestoneID = NEW.MilestoneID;
    END IF;
END //

-- Trigger after deleting a task
CREATE TRIGGER after_task_delete_update_milestone_status
AFTER DELETE ON Tasks
FOR EACH ROW
BEGIN
    DECLARE total_tasks INT;
    DECLARE completed_tasks INT;
    
    -- Count total tasks and completed tasks for the milestone
    SELECT COUNT(*), COUNT(CASE WHEN Status = 'Completed' THEN 1 END)
    INTO total_tasks, completed_tasks
    FROM Tasks
    WHERE MilestoneID = OLD.MilestoneID;

    -- If all tasks are completed and at least one task exists, set milestone status to Completed
    IF total_tasks = completed_tasks AND total_tasks > 0 THEN
        UPDATE Milestones
        SET Status = 'Completed'
        WHERE MilestoneID = OLD.MilestoneID;
    ELSE
        -- If all tasks are not completed, set milestone status to In Progress
        UPDATE Milestones
        SET Status = 'In Progress'
        WHERE MilestoneID = OLD.MilestoneID;
    END IF;
END //

-- Trigger after inserting a task
CREATE TRIGGER after_task_insert_set_milestone_startdate
AFTER INSERT ON Tasks
FOR EACH ROW
BEGIN
    UPDATE Milestones
    SET StartDate = (
        SELECT MIN(StartDate)
        FROM Tasks
        WHERE MilestoneID = NEW.MilestoneID
    )
    WHERE MilestoneID = NEW.MilestoneID;
END //

-- Trigger after updating a task
CREATE TRIGGER after_task_update_set_milestone_startdate
AFTER UPDATE ON Tasks
FOR EACH ROW
BEGIN
    UPDATE Milestones
    SET StartDate = (
        SELECT MIN(StartDate)
        FROM Tasks
        WHERE MilestoneID = NEW.MilestoneID
    )
    WHERE MilestoneID = NEW.MilestoneID;
END //

-- Trigger after deleting a task
CREATE TRIGGER after_task_delete_set_milestone_startdate
AFTER DELETE ON Tasks
FOR EACH ROW
BEGIN
    UPDATE Milestones
    SET StartDate = (
        SELECT MIN(StartDate)
        FROM Tasks
        WHERE MilestoneID = OLD.MilestoneID
    )
    WHERE MilestoneID = OLD.MilestoneID;
END //

-- Trigger to check if the StartDate of the milestone is equal to or after the StartDate of the corresponding project before inserting a milestone
CREATE TRIGGER check_milestone_startdate_insert
BEFORE INSERT ON Milestones
FOR EACH ROW
BEGIN
    DECLARE projectStartDate DATE;
    SELECT StartDate INTO projectStartDate FROM Projects WHERE ProjectID = NEW.ProjectID;
    IF NEW.StartDate < projectStartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Milestone start date must be on or after the project start date';
    END IF;
END //

-- Trigger to check if the StartDate of the milestone is equal to or after the StartDate of the corresponding project before updating a milestone
CREATE TRIGGER check_milestone_startdate_update
BEFORE UPDATE ON Milestones
FOR EACH ROW
BEGIN
    DECLARE projectStartDate DATE;
    SELECT StartDate INTO projectStartDate FROM Projects WHERE ProjectID = NEW.ProjectID;
    IF NEW.StartDate < projectStartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Milestone start date must be on or after the project start date';
    END IF;
END //

DELIMITER ;
DELIMITER ;

-- End of Sample_CRUD_Queries.sql
