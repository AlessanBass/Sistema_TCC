/*
  Warnings:

  - You are about to drop the column `curso_id_curso` on the `oferta` table. All the data in the column will be lost.
  - Added the required column `area_id_area` to the `oferta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `oferta` DROP FOREIGN KEY `fk_oferta_curso1`;

-- AlterTable
ALTER TABLE `oferta` DROP COLUMN `curso_id_curso`,
    ADD COLUMN `area_id_area` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `fk_oferta_area1_idx` ON `oferta`(`area_id_area`);

-- AddForeignKey
ALTER TABLE `oferta` ADD CONSTRAINT `fk_oferta_area1` FOREIGN KEY (`area_id_area`) REFERENCES `area`(`id_area`) ON DELETE NO ACTION ON UPDATE NO ACTION;
