/*
  Warnings:

  - You are about to drop the column `disciplina_id_disciplina` on the `alocacao` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes_colegiado` on the `alocacao` table. All the data in the column will be lost.
  - You are about to drop the column `semestre_id_semestre` on the `alocacao` table. All the data in the column will be lost.
  - You are about to drop the column `turma` on the `alocacao` table. All the data in the column will be lost.
  - The primary key for the `disciplina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `oferta_id_oferta` to the `alocacao` table without a default value. This is not possible if the table is not empty.
  - Made the column `professor_id_professor` on table `alocacao` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `alocacao` DROP FOREIGN KEY `fk_alocacao_disciplina1`;

-- DropForeignKey
ALTER TABLE `alocacao` DROP FOREIGN KEY `fk_alocacao_professor1`;

-- DropForeignKey
ALTER TABLE `alocacao` DROP FOREIGN KEY `fk_alocacao_semestre1`;

-- AlterTable
ALTER TABLE `alocacao` DROP COLUMN `disciplina_id_disciplina`,
    DROP COLUMN `observacoes_colegiado`,
    DROP COLUMN `semestre_id_semestre`,
    DROP COLUMN `turma`,
    ADD COLUMN `oferta_id_oferta` INTEGER NOT NULL,
    MODIFY `professor_id_professor` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `disciplina` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id_disciplina`);

-- AlterTable
ALTER TABLE `professor` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id_professor`);

-- CreateTable
CREATE TABLE `oferta` (
    `id_oferta` INTEGER NOT NULL AUTO_INCREMENT,
    `turma` VARCHAR(20) NULL,
    `formandos` VARCHAR(45) NULL,
    `obs_colegiado` VARCHAR(100) NULL,
    `disciplina_id_disciplina` INTEGER NOT NULL,
    `semestre_id_semestre` INTEGER NOT NULL,
    `curso_id_curso` INTEGER NOT NULL,

    UNIQUE INDEX `idoferta_UNIQUE`(`id_oferta`),
    INDEX `fk_oferta_curso1_idx`(`curso_id_curso`),
    INDEX `fk_oferta_disciplina1_idx`(`disciplina_id_disciplina`),
    INDEX `fk_oferta_semestre1_idx`(`semestre_id_semestre`),
    PRIMARY KEY (`id_oferta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fk_alocacao_oferta1_idx` ON `alocacao`(`oferta_id_oferta`);

-- AddForeignKey
ALTER TABLE `alocacao` ADD CONSTRAINT `fk_alocacao_oferta1` FOREIGN KEY (`oferta_id_oferta`) REFERENCES `oferta`(`id_oferta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alocacao` ADD CONSTRAINT `fk_alocacao_professor1` FOREIGN KEY (`professor_id_professor`) REFERENCES `professor`(`id_professor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oferta` ADD CONSTRAINT `fk_oferta_curso1` FOREIGN KEY (`curso_id_curso`) REFERENCES `curso`(`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oferta` ADD CONSTRAINT `fk_oferta_disciplina1` FOREIGN KEY (`disciplina_id_disciplina`) REFERENCES `disciplina`(`id_disciplina`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oferta` ADD CONSTRAINT `fk_oferta_semestre1` FOREIGN KEY (`semestre_id_semestre`) REFERENCES `semestre`(`id_semestre`) ON DELETE NO ACTION ON UPDATE NO ACTION;
