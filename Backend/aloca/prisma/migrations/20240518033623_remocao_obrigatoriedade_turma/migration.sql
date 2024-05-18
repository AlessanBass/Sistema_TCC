/*
  Warnings:

  - The primary key for the `disciplina` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `disciplina` DROP FOREIGN KEY `fk_disciplina_turma1`;

-- AlterTable
ALTER TABLE `disciplina` DROP PRIMARY KEY,
    MODIFY `turma_id_turma` INTEGER NULL,
    ADD PRIMARY KEY (`id_disciplina`, `curso_id_curso`, `area_id_area`);
