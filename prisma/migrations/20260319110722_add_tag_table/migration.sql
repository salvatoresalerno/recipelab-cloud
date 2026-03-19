/*
  Warnings:

  - A unique constraint covering the columns `[area,userId]` on the table `area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoria,userId]` on the table `categoria` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `area_area_key` ON `area`;

-- DropIndex
DROP INDEX `categoria_categoria_key` ON `categoria`;

-- CreateTable
CREATE TABLE `tag` (
    `idTag` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `tag` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT 'bg-lime-100',
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tag_idTag_userId_idx`(`idTag`, `userId`),
    UNIQUE INDEX `tag_tag_userId_key`(`tag`, `userId`),
    PRIMARY KEY (`idTag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `area_idArea_userId_idx` ON `area`(`idArea`, `userId`);

-- CreateIndex
CREATE UNIQUE INDEX `area_area_userId_key` ON `area`(`area`, `userId`);

-- CreateIndex
CREATE INDEX `categoria_idCategoria_userId_idx` ON `categoria`(`idCategoria`, `userId`);

-- CreateIndex
CREATE UNIQUE INDEX `categoria_categoria_userId_key` ON `categoria`(`categoria`, `userId`);
