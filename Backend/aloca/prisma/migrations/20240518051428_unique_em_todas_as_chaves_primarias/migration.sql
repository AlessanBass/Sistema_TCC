/*
  Warnings:

  - A unique constraint covering the columns `[id_curso]` on the table `curso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_semestre]` on the table `semestre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_turma]` on the table `turma` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `id_curso_UNIQUE` ON `curso`(`id_curso`);

-- CreateIndex
CREATE UNIQUE INDEX `id_semestre_UNIQUE` ON `semestre`(`id_semestre`);

-- CreateIndex
CREATE UNIQUE INDEX `id_turma_UNIQUE` ON `turma`(`id_turma`);

-- AddForeignKey
ALTER TABLE `disciplina` ADD CONSTRAINT `fk_disciplina_turma1` FOREIGN KEY (`turma_id_turma`) REFERENCES `turma`(`id_turma`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `disciplina` RENAME INDEX `disciplina_id_disciplina_key` TO `id_disciplina_UNIQUE`;
