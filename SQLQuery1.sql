create database salon_db;
GO

USE salon_db;
GO

DROP TABLE bookings;
GO

CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at DATETIME DEFAULT GETDATE()
);
GO

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bookings';

select * from bookings;

USE salon_db;
GO

CREATE TABLE worker (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
GO
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

INSERT INTO admin (email, password) VALUES ('admin1@bloomandbrush.com', 'Admin@123');
INSERT INTO admin (email, password) VALUES ('kaurmuskan057@gmail.com', '123muskan');
INSERT INTO worker (email, password) VALUES ('worker1@bloomandbrush.com', 'Worker@123');

select * from worker

Select * from bookings;

INSERT INTO services (category, service_name, detail, price, duration)
VALUES ('facial', 'Classic Facial', 'Cleanse, exfoliate, mask', 'Rs. 1500', '45 mins');

ALTER TABLE services ADD detail NVARCHAR(255) NULL;

EXEC sp_help 'services';

ALTER TABLE services ALTER COLUMN price VARCHAR(50);

-- Hair Cut
INSERT INTO services (category, service_name, detail, price, duration) VALUES
('haircut', 'Basic Trim', 'Length maintenance, no restyle', 'Rs. 500', '30 mins'),
('haircut', 'Layered Cut', 'Custom layers, full restyle', 'Rs. 800', '45 mins'),
('haircut', 'Bridal Hair Styling', 'Trial + event-day styling', 'Rs. 3500', '2 hrs'),
('haircut', 'Fringe/Bangs Trim', 'Quick fringe touch-up', 'Rs. 250', '15 mins');

-- Hair Color
INSERT INTO services (category, service_name, detail, price, duration) VALUES
('haircolor', 'Root Touch-up', 'Single process, roots only', 'Rs. 1500', '1 hr'),
('haircolor', 'Full Head Color', 'All-over single tone', 'Rs. 2800', '1.5 hrs'),
('haircolor', 'Balayage', 'Hand-painted highlights', 'Rs. 5000', '2.5 hrs'),
('haircolor', 'Global Highlights', 'Full head foil highlights', 'Rs. 4000', '2 hrs');

-- Manicure & Pedicure
INSERT INTO services (category, service_name, detail, price, duration) VALUES
('manicure', 'Classic Manicure', 'Shape, cuticle care, polish', 'Rs. 600', '30 mins'),
('manicure', 'Classic Pedicure', 'Soak, scrub, polish', 'Rs. 800', '45 mins'),
('manicure', 'Gel Manicure', 'Long-lasting gel finish', 'Rs. 1200', '45 mins'),
('manicure', 'Spa Pedicure', 'Exfoliation + massage', 'Rs. 1500', '1 hr');

-- Nails
INSERT INTO services (category, service_name, detail, price, duration) VALUES
('nails', 'Nail Extensions', 'Acrylic or gel extensions', 'Rs. 2000', '1.5 hrs'),
('nails', 'Nail Art (per nail)', 'Custom design', 'Rs. 100', '10 mins'),
('nails', 'Nail Refill', 'Extension maintenance', 'Rs. 1200', '1 hr');

-- Facial (baaki 3, Classic Facial already insert ho chuki hai)
INSERT INTO services (category, service_name, detail, price, duration) VALUES
('facial', 'Hydrating Facial', 'For dry/dull skin', 'Rs. 2000', '1 hr'),
('facial', 'Anti-Acne Facial', 'Deep cleanse, targeted care', 'Rs. 2200', '1 hr'),
('facial', 'Gold Facial', 'Brightening + glow treatment', 'Rs. 3000', '1.15 hrs');

-- Threading & Waxing
INSERT INTO services (category, service_name, detail, price, duration) VALUES
('threading', 'Eyebrow Threading', 'Shape and clean-up', 'Rs. 150', '10 mins'),
('threading', 'Upper Lip Threading', 'Quick touch-up', 'Rs. 80', '5 mins'),
('threading', 'Full Face Waxing', 'Complete face wax', 'Rs. 400', '20 mins'),
('threading', 'Full Arms/Legs Waxing', 'Full limb waxing', 'Rs. 900', '40 mins');



SELECT * FROM messages;