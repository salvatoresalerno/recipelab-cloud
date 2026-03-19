/*
  Warnings:

  - A unique constraint covering the columns `[idArea,userId]` on the table `area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idCategoria,userId]` on the table `categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTag,userId]` on the table `tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `area_idArea_userId_idx` ON `area`;

-- DropIndex
DROP INDEX `categoria_idCategoria_userId_idx` ON `categoria`;

-- DropIndex
DROP INDEX `tag_idTag_userId_idx` ON `tag`;

-- CreateIndex
CREATE UNIQUE INDEX `area_idArea_userId_key` ON `area`(`idArea`, `userId`);

-- CreateIndex
CREATE UNIQUE INDEX `categoria_idCategoria_userId_key` ON `categoria`(`idCategoria`, `userId`);

-- CreateIndex
CREATE UNIQUE INDEX `tag_idTag_userId_key` ON `tag`(`idTag`, `userId`);
