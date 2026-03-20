-- CreateTable
CREATE TABLE `RicettaTag` (
    `idRicetta` VARCHAR(191) NOT NULL,
    `idTag` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idRicetta`, `idTag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `um` (
    `idUM` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `fattoreGrammi` DOUBLE NULL,

    UNIQUE INDEX `um_sigla_key`(`sigla`),
    PRIMARY KEY (`idUM`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ricette` (
    `idRicetta` VARCHAR(191) NOT NULL,
    `titolo` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `areaId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `categoriaId` VARCHAR(191) NULL,
    `preferito` BOOLEAN NOT NULL DEFAULT false,
    `descrizione` VARCHAR(191) NULL,
    `difficolta` VARCHAR(191) NULL,
    `preparazione` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `ricette_preferito_idx`(`preferito`),
    UNIQUE INDEX `ricette_titolo_userId_key`(`titolo`, `userId`),
    UNIQUE INDEX `ricette_idRicetta_userId_key`(`idRicetta`, `userId`),
    PRIMARY KEY (`idRicetta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dettagli` (
    `idDettagli` VARCHAR(191) NOT NULL,
    `idRicetta` VARCHAR(191) NOT NULL,
    `youtubeLink` VARCHAR(191) NULL,
    `descrizione_lunga` VARCHAR(191) NULL,
    `consigli` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `dettagli_idRicetta_key`(`idRicetta`),
    UNIQUE INDEX `dettagli_idDettagli_userId_key`(`idDettagli`, `userId`),
    PRIMARY KEY (`idDettagli`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `istruzioni` (
    `id` VARCHAR(191) NOT NULL,
    `stepNumber` INTEGER NOT NULL DEFAULT 0,
    `valore` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `imageId` VARCHAR(191) NOT NULL,
    `dettagliId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `istruzioni_id_userId_key`(`id`, `userId`),
    UNIQUE INDEX `istruzioni_dettagliId_valore_key`(`dettagliId`, `valore`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredienti` (
    `idIngrediente` VARCHAR(191) NOT NULL,
    `ingrediente` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ingredienti_ingrediente_userId_key`(`ingrediente`, `userId`),
    PRIMARY KEY (`idIngrediente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schede_ingredienti` (
    `idScheda` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `descrizione_breve` VARCHAR(191) NULL,
    `descrizione_lunga` VARCHAR(191) NULL,
    `consigli_conservazione` VARCHAR(191) NULL,
    `consigli_preparazione` VARCHAR(191) NULL,
    `pesoMedioGrammi` DOUBLE NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ingredienteId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `schede_ingredienti_ingredienteId_key`(`ingredienteId`),
    UNIQUE INDEX `schede_ingredienti_idScheda_userId_key`(`idScheda`, `userId`),
    PRIMARY KEY (`idScheda`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `info_nutrizionali` (
    `idInfo` VARCHAR(191) NOT NULL,
    `energia` DOUBLE NULL,
    `proteine` DOUBLE NULL,
    `carboidrati` DOUBLE NULL,
    `zuccheri` DOUBLE NULL,
    `grassi` DOUBLE NULL,
    `grassi_saturi` DOUBLE NULL,
    `fibre` DOUBLE NULL,
    `sodio` DOUBLE NULL,
    `colesterolo` DOUBLE NULL,
    `note` VARCHAR(191) NULL,
    `yf` DOUBLE NULL,
    `schedaId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `info_nutrizionali_schedaId_key`(`schedaId`),
    PRIMARY KEY (`idInfo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vitamine` (
    `idVitamina` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `infoId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idVitamina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usi_culinari` (
    `idUso` VARCHAR(191) NOT NULL,
    `uso` VARCHAR(191) NOT NULL,
    `schedaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idUso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sostituti` (
    `idSostituto` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `schedaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idSostituto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allergeni` (
    `idAllergene` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `schedaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idAllergene`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DettagliIngrediente` (
    `dettaglioId` VARCHAR(191) NOT NULL,
    `idIngrediente` VARCHAR(191) NOT NULL,
    `quantita` VARCHAR(191) NULL,
    `umId` VARCHAR(191) NULL,

    PRIMARY KEY (`dettaglioId`, `idIngrediente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fornitori` (
    `idFornitore` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `fornitori_idFornitore_userId_key`(`idFornitore`, `userId`),
    UNIQUE INDEX `fornitori_nome_userId_key`(`nome`, `userId`),
    PRIMARY KEY (`idFornitore`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fornitore_ingrediente` (
    `id` VARCHAR(191) NOT NULL,
    `fornitoreId` VARCHAR(191) NOT NULL,
    `ingredienteId` VARCHAR(191) NOT NULL,
    `umId` VARCHAR(191) NOT NULL,
    `quantita` DOUBLE NOT NULL,
    `prezzoTotale` DOUBLE NOT NULL,
    `prezzoUnitario` DOUBLE NOT NULL,
    `preferito` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fornitore_ingrediente_fornitoreId_ingredienteId_key`(`fornitoreId`, `ingredienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RicettaTag` ADD CONSTRAINT `RicettaTag_idRicetta_fkey` FOREIGN KEY (`idRicetta`) REFERENCES `ricette`(`idRicetta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RicettaTag` ADD CONSTRAINT `RicettaTag_idTag_fkey` FOREIGN KEY (`idTag`) REFERENCES `tag`(`idTag`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ricette` ADD CONSTRAINT `ricette_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`idArea`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ricette` ADD CONSTRAINT `ricette_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria`(`idCategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dettagli` ADD CONSTRAINT `dettagli_idRicetta_fkey` FOREIGN KEY (`idRicetta`) REFERENCES `ricette`(`idRicetta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `istruzioni` ADD CONSTRAINT `istruzioni_dettagliId_fkey` FOREIGN KEY (`dettagliId`) REFERENCES `dettagli`(`idDettagli`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schede_ingredienti` ADD CONSTRAINT `schede_ingredienti_ingredienteId_fkey` FOREIGN KEY (`ingredienteId`) REFERENCES `ingredienti`(`idIngrediente`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `info_nutrizionali` ADD CONSTRAINT `info_nutrizionali_schedaId_fkey` FOREIGN KEY (`schedaId`) REFERENCES `schede_ingredienti`(`idScheda`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vitamine` ADD CONSTRAINT `vitamine_infoId_fkey` FOREIGN KEY (`infoId`) REFERENCES `info_nutrizionali`(`idInfo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usi_culinari` ADD CONSTRAINT `usi_culinari_schedaId_fkey` FOREIGN KEY (`schedaId`) REFERENCES `schede_ingredienti`(`idScheda`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sostituti` ADD CONSTRAINT `sostituti_schedaId_fkey` FOREIGN KEY (`schedaId`) REFERENCES `schede_ingredienti`(`idScheda`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allergeni` ADD CONSTRAINT `allergeni_schedaId_fkey` FOREIGN KEY (`schedaId`) REFERENCES `schede_ingredienti`(`idScheda`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DettagliIngrediente` ADD CONSTRAINT `DettagliIngrediente_dettaglioId_fkey` FOREIGN KEY (`dettaglioId`) REFERENCES `dettagli`(`idDettagli`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DettagliIngrediente` ADD CONSTRAINT `DettagliIngrediente_idIngrediente_fkey` FOREIGN KEY (`idIngrediente`) REFERENCES `ingredienti`(`idIngrediente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DettagliIngrediente` ADD CONSTRAINT `DettagliIngrediente_umId_fkey` FOREIGN KEY (`umId`) REFERENCES `um`(`idUM`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fornitore_ingrediente` ADD CONSTRAINT `fornitore_ingrediente_fornitoreId_fkey` FOREIGN KEY (`fornitoreId`) REFERENCES `fornitori`(`idFornitore`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fornitore_ingrediente` ADD CONSTRAINT `fornitore_ingrediente_ingredienteId_fkey` FOREIGN KEY (`ingredienteId`) REFERENCES `ingredienti`(`idIngrediente`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fornitore_ingrediente` ADD CONSTRAINT `fornitore_ingrediente_umId_fkey` FOREIGN KEY (`umId`) REFERENCES `um`(`idUM`) ON DELETE RESTRICT ON UPDATE CASCADE;
