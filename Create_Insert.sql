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

-- Insert Users
INSERT INTO Users (Username, Password, Email, UserTypeID) VALUES
('RajeshKumar', 'hashed_password_1', 'rajesh.kumar@email.com', 1),
('PriyaSharma', 'hashed_password_2', 'priya.sharma@email.com', 2),
('AmitPatel', 'hashed_password_3', 'amit.patel@email.com', 2),
('NehaSingh', 'hashed_password_4', 'neha.singh@email.com', 2),
('VikasMehta', 'hashed_password_5', 'vikas.mehta@email.com', 2),
('AnanyaReddy', 'hashed_password_6', 'ananya.reddy@email.com', 2),
('SureshIyer', 'hashed_password_7', 'suresh.iyer@email.com', 2),
('DivyaGupta', 'hashed_password_8', 'divya.gupta@email.com', 2),
('RahulVerma', 'hashed_password_9', 'rahul.verma@email.com', 2),
('SunitaKapoor', 'hashed_password_10', 'sunita.kapoor@email.com', 2);

-- Insert Projects
INSERT INTO Projects (ProjectName, Description, StartDate, EndDate, Status) VALUES
('E-commerce Platform Upgrade', 'Upgrade the existing e-commerce platform to improve performance and user experience', '2024-07-01', '2024-12-31', 'In Progress'),
('Mobile App Development', 'Develop a new mobile app for customer engagement', '2024-08-15', '2025-02-28', 'Not Started'),
('Data Center Migration', 'Migrate on-premises data center to cloud infrastructure', '2024-06-01', '2024-11-30', 'In Progress');

-- Insert Milestones
INSERT INTO Milestones (ProjectID, MilestoneName, Description, DueDate) VALUES
(1, 'Backend Optimization', 'Optimize database queries and server-side code', '2024-09-30'),
(1, 'Frontend Redesign', 'Implement new responsive design', '2024-11-15'),
(2, 'Requirements Gathering', 'Collect and finalize app requirements', '2024-09-15'),
(2, 'UI/UX Design', 'Create app wireframes and design mockups', '2024-10-31'),
(3, 'Infrastructure Assessment', 'Evaluate current infrastructure and plan migration', '2024-07-31'),
(3, 'Data Migration', 'Migrate data to cloud storage', '2024-10-15');

-- Insert Tasks
INSERT INTO Tasks (ProjectID, MilestoneID, TaskName, Description, AssignedTo, StartDate, EndDate, Status) VALUES
(1, 1, 'Database Query Optimization', 'Identify and optimize slow database queries', 17, '2024-07-15', '2024-08-31', 'In Progress'),
(1, 2, 'Responsive UI Implementation', 'Implement responsive design for mobile devices', 12, '2024-09-01', '2024-10-31', 'Not Started'),
(2, 3, 'User Survey', 'Conduct user survey for app feature prioritization', 13, '2024-08-20', '2024-09-10', 'Not Started'),
(2, 4, 'App Wireframing', 'Create initial app wireframes', 14, '2024-10-01', '2024-10-15', 'Not Started'),
(3, 5, 'Cloud Provider Comparison', 'Compare and select suitable cloud providers', 15, '2024-06-15', '2024-07-15', 'Completed'),
(3, 6, 'Test Data Migration', 'Perform test migration with sample data set', 16, '2024-09-01', '2024-09-30', 'Not Started');

-- Insert Assignments
INSERT INTO Assignments (ProjectID, TaskID, UserID, AssignedDate) VALUES
(1, 8, 17, '2024-07-10'),
(1, 9, 12, '2024-08-25'),
(2, 10, 13, '2024-08-18'),
(2, 11, 14, '2024-09-28'),
(3, 12, 15, '2024-06-10'),
(3, 13, 16, '2024-08-28');

-- Insert CompletionProofs
INSERT INTO CompletionProofs (TaskID, SubmittedBy, SubmissionDate, ProofFile, Status, VerifiedBy) VALUES
(9, 12, '2024-07-14 15:30:00', 'cloud_provider_comparison_report.pdf', 'Approved', 11);

-- Insert Notifications
INSERT INTO Notifications (UserID, ProjectID, TaskID, Message) VALUES
(17 ,1, 1, 'New task assigned: Database Query Optimization'),
(12, 1, 2, 'Upcoming task: Responsive UI Implementation starts on 2024-09-01'),
(18, 2, 3, 'New project assigned: Mobile App Development'),
(15, 3, 5, 'Your task "Cloud Provider Comparison" has been approved'),
(16, 3, 6, 'Reminder: Test Data Migration task starts in 1 week');

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
