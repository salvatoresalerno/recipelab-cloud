/*
  Warnings:

  - You are about to drop the column `tableName` on the `changelog` table. All the data in the column will be lost.
  - Added the required column `deviceId` to the `ChangeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity` to the `ChangeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `changelog` DROP COLUMN `tableName`,
    ADD COLUMN `deviceId` VARCHAR(191) NOT NULL,
    ADD COLUMN `entity` VARCHAR(191) NOT NULL,
    ADD COLUMN `payload` JSON NULL;
