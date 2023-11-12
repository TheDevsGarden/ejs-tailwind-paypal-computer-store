CREATE DATABASE IF NOT EXISTS tp2;
USE tp2;


### Tableau Adresses ###
CREATE TABLE IF NOT EXISTS Adresses (
    id_adresse INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    numero_civique VARCHAR(10) NOT NULL,
    rue VARCHAR(100) NOT NULL,
    ville VARCHAR(50) NOT NULL,
    province VARCHAR(2) NOT NULL,
    code_postal VARCHAR(6) NOT NULL,
    CONSTRAINT unique_adresse UNIQUE (numero_civique, rue, ville, province, code_postal));
   
### Tableau Clients ###
CREATE TABLE IF NOT EXISTS Clients (
    id_client INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    courriel VARCHAR(50) NOT NULL,
    CONSTRAINT unique_courriel UNIQUE (courriel),
    mot_de_passe VARCHAR(60) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    id_adresse_client INT,
    FOREIGN KEY (id_adresse_client) REFERENCES Adresses(id_adresse));
   
   
### Tableau Produits ###
CREATE TABLE IF NOT EXISTS Produits (
    id_produit INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    manufacturier VARCHAR(50),
    serial_number INT,
    CONSTRAINT unique_serial_number UNIQUE (serial_number),
    description VARCHAR(50),
    cpu VARCHAR(50),
    chipset VARCHAR(50),
    gpu VARCHAR(25),
    ram_type VARCHAR(25),
    ram_size_GB INT,
    storage_type VARCHAR(25),
    storage_size_GB INT,
    product_dimensions VARCHAR(50),
    weight_lbs INT,
    annee INT,
    image VARCHAR(250),
    unit_qty INT,
    prix DOUBLE);
   
### Tableau Commandes ### 
CREATE TABLE IF NOT EXISTS Commandes (
id_commande INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
date_commande DATE,
total DOUBLE,
id_client_commande INT,
FOREIGN KEY (id_client_commande) REFERENCES Clients (id_client));

### Tableau Produits_Commandes ###
CREATE TABLE IF NOT EXISTS Produits_Commandes (
id_produit_commande INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
quantite INT,
id_COMMANDE INT,
id_PRODUIT INT,
FOREIGN KEY (id_COMMANDE) REFERENCES Commandes (id_commande),
FOREIGN KEY (id_PRODUIT) REFERENCES Produits (id_produit));



### Tableau Adresses INSERT ###

INSERT IGNORE INTO Adresses(numero_civique, rue, ville, province, code_postal) VALUES 
('123', 'Oak Street', 'New York', 'NY', '10001'),
('456', 'Pine Street', 'Los Angeles', 'CA', '90001'),
('789', 'Maple Street', 'Chicago', 'IL', '60007'),
('101', 'Birch Street', 'Houston', 'TX', '77001'),
('112', 'Elm Street', 'Philadelphia', 'PA', '19019'),
('131', 'Cedar Street', 'Phoenix', 'AZ', '85001'),
('415', 'Spruce Street', 'San Antonio', 'TX', '78201'),
('161', 'Willow Street', 'San Diego', 'CA', '92101'),
('718', 'Ash Street', 'Dallas', 'TX', '75201'),
('192', 'Cherry Street', 'San Jose', 'CA', '95101'),
('203', 'Beech Street', 'Austin', 'TX', '73301'),
('214', 'Linden Street', 'Jacksonville', 'FL', '32099'),
('225', 'Hickory Street', 'San Francisco', 'CA', '94101'),
('236', 'Walnut Street', 'Indianapolis', 'IN', '46201'),
('247', 'Alder Street', 'Columbus', 'OH', '43085');

### Tableau Clients INSERT ###

INSERT INTO Clients(nom, prenom, courriel, mot_de_passe, telephone, id_adresse_client) VALUES
('Smith', 'John', 'johnsmith@email.com', 'password1', '1234567890', 1),
('Johnson', 'James', 'jamesjohnson@email.com', 'password2', '2345678901', 2),
('Williams', 'Robert', 'robertwilliams@email.com', 'password3', '3456789012', 3),
('Brown', 'Michael', 'michaelbrown@email.com', 'password4', '4567890123', 4),
('Jones', 'William', 'williamjones@email.com', 'password5', '5678901234', 5),
('Miller', 'David', 'davidmiller@email.com', 'password6', '6789012345', 6),
('Davis', 'Richard', 'richarddavis@email.com', 'password7', '7890123456', 7),
('Garcia', 'Joseph', 'josephgarcia@email.com', 'password8', '8901234567', 8),
('Rodriguez', 'Thomas', 'thomasrodriguez@email.com', 'password9', '9012345678', 9),
('Wilson', 'Charles', 'charleswilson@email.com', 'password10', '0123456789', 10),
('Martinez', 'Patricia', 'patriciamartinez@email.com', 'password11', '1123456789', 11),
('Anderson', 'Linda', 'lindaanderson@email.com', 'password12', '2213456789', 12),
('Taylor', 'Elizabeth', 'elizabethtaylor@email.com', 'password13', '3312456789', 13),
('Thomas', 'Barbara', 'barbarathomas@email.com', 'password14', '4412356789', 14),
('Hernandez', 'Jennifer', 'jenniferhernandez@email.com', 'password15', '5512346789', 15),
('Smith', 'Johanne', 'johannesmith@email.com', 'password1', '1234567890', 1);


### Tableau Produits INSERT ###

INSERT IGNORE INTO Produits(manufacturier, serial_number, description, cpu, chipset, gpu, ram_type, ram_size_GB, storage_type, storage_size_GB, product_dimensions, weight_lbs, annee, image, unit_qty, prix) VALUES
('Lenovo', 10001, 'Product1', 'Intel i7', 'Chipset1', 'Nvidia GTX 1050', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2020, 'product1.jpg', 10, 1200.00),
('DELL', 10002, 'Product2', 'Intel i5', 'Chipset2', 'Nvidia GTX 1060', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2019, 'product2.jpg', 20, 1000.00),
('MSI', 10003, 'Product3', 'Intel i3', 'Chipset3', 'Nvidia GTX 1070', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2018, 'product3.jpg', 30, 800.00),
('Microsoft', 10004, 'Product4', 'AMD Ryzen 7', 'Chipset4', 'AMD Radeon RX 5700', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2021, 'product4.jpg', 10, 1300.00),
('Acer', 10005, 'Product5', 'AMD Ryzen 5', 'Chipset5', 'AMD Radeon RX 5600', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2020, 'product5.jpg', 20, 1100.00),
('Samsung', 10006, 'Product6', 'AMD Ryzen 3', 'Chipset6', 'AMD Radeon RX 5500', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2019, 'product6.jpg', 30, 900.00),
('DELL', 10007, 'Product7', 'Intel i7', 'Chipset7', 'Nvidia RTX 2080', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2022, 'product7.jpg', 10, 1400.00),
('Microsoft', 10008, 'Product8', 'Intel i5', 'Chipset8', 'Nvidia RTX 2070', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2021, 'product8.jpg', 20, 1200.00),
('HP', 10009, 'Product9', 'Intel i3', 'Chipset9', 'Nvidia RTX 2060', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2020, 'product9.jpg', 30, 1000.00),
('Lenovo', 10010, 'Product10', 'AMD Ryzen 7', 'Chipset10', 'AMD Radeon RX 6800', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2023, 'product10.jpg', 10, 1500.00),
('MSI', 10011, 'Product11', 'AMD Ryzen 5', 'Chipset11', 'AMD Radeon RX 6700', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2022, 'product11.jpg', 20, 1300.00),
('Asus', 10012, 'Product12', 'AMD Ryzen 3', 'Chipset12', 'AMD Radeon RX 6600', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2021, 'product12.jpg', 30, 1100.00),
('Lenovo', 10013, 'Product13', 'Intel i7', 'Chipset13', 'Nvidia GTX 1660', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2020, 'product13.jpg', 10, 1200.00),
('Acer', 10014, 'Product14', 'Intel i5', 'Chipset14', 'Nvidia GTX 1650', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2019, 'product14.jpg', 20, 1000.00),
('Acer', 10015, 'Product15', 'Intel i3', 'Chipset15', 'Nvidia GTX 1050 Ti', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2018, 'product15.jpg', 30, 800.00),
('MSI', 10016, 'Product16', 'AMD Ryzen 7', 'Chipset16', 'AMD Radeon RX 580', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2021, 'product16.jpg', 10, 1300.00),
('Asus', 10017, 'Product17', 'AMD Ryzen 5', 'Chipset17', 'AMD Radeon RX 570', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2020, 'product17.jpg', 20, 1100.00),
('HP', 10018, 'Product18', 'AMD Ryzen 3', 'Chipset18', 'AMD Radeon RX 560', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2019, 'product18.jpg', 30, 900.00),
('Lenovo', 10019, 'Product19', 'Intel i7', 'Chipset19', 'Nvidia RTX 3080', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2022, 'product19.jpg', 10, 1400.00),
('DELL', 10020, 'Product20', 'Intel i5', 'Chipset20', 'Nvidia RTX 3070', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2021, 'product20.jpg', 20, 1200.00),
('HP', 10021, 'Product21', 'Intel i3', 'Chipset21', 'Nvidia RTX 3060', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2020, 'product21.jpg', 30, 1000.00),
('Lenovo', 10022, 'Product22', 'AMD Ryzen 7', 'Chipset22', 'AMD Radeon RX 6900 XT', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2023, 'product22.jpg', 10, 1500.00),
('MSI', 10023, 'Product23', 'AMD Ryzen 5', 'Chipset23', 'AMD Radeon RX 6800 XT', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2022, 'product23.jpg', 20, 1300.00),
('Microsoft', 10024, 'Product24', 'AMD Ryzen 3', 'Chipset24', 'AMD Radeon RX 6700 XT', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2021, 'product24.jpg', 30, 1100.00),
('DELL', 10025, 'Product25', 'Intel i7', 'Chipset25', 'Nvidia GTX 1660 Super', 'DDR4', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2020, 'product25.jpg', 10, 1200.00),
('Lenovo', 10026, 'Product26', 'Intel i5', 'Chipset26', 'Nvidia GTX 1650 Super', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2019, 'product26.jpg', 20, 1000.00),
('Acer', 10027, 'Product27', 'Intel i3', 'Chipset27', 'Nvidia GTX 1050 Ti Super', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2018, 'product27.jpg', 30, 800.00),
('HP', 10028, 'Product28', 'Intel i5', 'Chipset28', 'Nvidia GTX 1050 Ti Super', 'DDR5', 16, 'SSD', 512, '15.6x10.4x1.1', 5.5, 2021, 'product28.jpg', 10, 1300.00),
('Samsung', 10029, 'Product29', 'AMD Ryzen 5', 'Chipset29', 'AMD Radeon RX 570 XT', 'DDR4', 8, 'HDD', 1024, '14.3x9.5x1.2', 6.0, 2020, 'product29.jpg', 20, 1100.00),
('DELL', 10030, 'Product30', 'AMD Ryzen 3', 'Chipset30', 'AMD Radeon RX 560 XT', 'DDR3', 4, 'SSD', 256, '13.1x8.6x1.3', 6.5, 2019, 'product30.jpg', 30, 900.00),
('DELL', 10031, 'Product30', 'AMD Ryzen 3', 'Chipset30', 'AMD Radeon RX 560 XT', 'DDR3', 4, 'SSD', 512, '13.1x8.6x1.3', 6.5, 2019, 'product30.jpg', 30, 1200.00);


SELECT * FROM Produits_Commandes  ;
SELECT * FROM Clients  ;

SELECT * FROM Produits  ;
SELECT * FROM   Adresses;
SHOW TABLES IN tp2;
DESCRIBE tp2.Produits_Commandes ;
DESCRIBE tp2.Clients ;




