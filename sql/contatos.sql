CREATE TABLE tabempresas (
  `idEmpresa` int NOT NULL AUTO_INCREMENT,
  `nomeEmpresa` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idEmpresa`))
  ENGINE=InnoDB AUTO_INCREMENT=1;
  ;
  
  
CREATE TABLE `tabcontatos` (
  `idContato` int NOT NULL AUTO_INCREMENT,
  `cdEmpresa` int,
  PRIMARY KEY (`idContato`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

