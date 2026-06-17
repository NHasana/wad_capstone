/*
  Warnings:

  - You are about to alter the column `type` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `notifications` MODIFY `type` VARCHAR(20) NOT NULL;
