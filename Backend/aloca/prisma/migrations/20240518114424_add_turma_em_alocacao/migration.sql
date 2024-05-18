/*
  Warnings:

  - You are about to drop the column `turma_id_turma` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the `turma` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `disciplina` DROP FOREIGN KEY `fk_disciplina_turma1`;

-- AlterTable
ALTER TABLE `alocacao` ADD COLUMN `turma` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `disciplina` DROP COLUMN `turma_id_turma`;

-- DropTable
DROP TABLE `turma`;
