-- CreateTable
CREATE TABLE `alocacao` (
    `id_alocacao` INTEGER NOT NULL AUTO_INCREMENT,
    `observacoes_colegiado` VARCHAR(100) NULL,
    `disciplina_id_disciplina` INTEGER NOT NULL,
    `professor_id_professor` INTEGER NULL,
    `semestre_id_semestre` INTEGER NOT NULL,

    UNIQUE INDEX `id_alocacao_UNIQUE`(`id_alocacao`),
    INDEX `fk_alocacao_disciplina1_idx`(`disciplina_id_disciplina`),
    INDEX `fk_alocacao_professor1_idx`(`professor_id_professor`),
    INDEX `fk_alocacao_semestre1_idx`(`semestre_id_semestre`),
    PRIMARY KEY (`id_alocacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area` (
    `id_area` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_area` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `id_area_UNIQUE`(`id_area`),
    PRIMARY KEY (`id_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curso` (
    `id_curso` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_curso` VARCHAR(100) NOT NULL,
    `tipo_curso` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_curso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disciplina` (
    `id_disciplina` INTEGER NOT NULL AUTO_INCREMENT,
    `periodo` INTEGER NOT NULL,
    `cod` VARCHAR(20) NOT NULL,
    `nome_disciplina` VARCHAR(100) NOT NULL,
    `carga_horaria` INTEGER NOT NULL,
    `qtd_creditos` INTEGER NOT NULL,
    `curso_id_curso` INTEGER NOT NULL,
    `area_id_area` INTEGER NOT NULL,
    `turma_id_turma` INTEGER NOT NULL,

    UNIQUE INDEX `disciplina_id_disciplina_key`(`id_disciplina`),
    INDEX `fk_disciplina_area1_idx`(`area_id_area`),
    INDEX `fk_disciplina_curso_idx`(`curso_id_curso`),
    INDEX `fk_disciplina_turma1_idx`(`turma_id_turma`),
    PRIMARY KEY (`id_disciplina`, `curso_id_curso`, `area_id_area`, `turma_id_turma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professor` (
    `id_professor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_professor` VARCHAR(150) NOT NULL,
    `observacoes` VARCHAR(100) NULL,
    `area_id_area` INTEGER NOT NULL,

    UNIQUE INDEX `id_professores_UNIQUE`(`id_professor`),
    INDEX `fk_professor_area1_idx`(`area_id_area`),
    PRIMARY KEY (`id_professor`, `area_id_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `semestre` (
    `id_semestre` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_semestre` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id_semestre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `turma` (
    `id_turma` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_turma` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id_turma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alocacao` ADD CONSTRAINT `fk_alocacao_disciplina1` FOREIGN KEY (`disciplina_id_disciplina`) REFERENCES `disciplina`(`id_disciplina`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alocacao` ADD CONSTRAINT `fk_alocacao_professor1` FOREIGN KEY (`professor_id_professor`) REFERENCES `professor`(`id_professor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alocacao` ADD CONSTRAINT `fk_alocacao_semestre1` FOREIGN KEY (`semestre_id_semestre`) REFERENCES `semestre`(`id_semestre`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `disciplina` ADD CONSTRAINT `fk_disciplina_area1` FOREIGN KEY (`area_id_area`) REFERENCES `area`(`id_area`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `disciplina` ADD CONSTRAINT `fk_disciplina_curso` FOREIGN KEY (`curso_id_curso`) REFERENCES `curso`(`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `disciplina` ADD CONSTRAINT `fk_disciplina_turma1` FOREIGN KEY (`turma_id_turma`) REFERENCES `turma`(`id_turma`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `professor` ADD CONSTRAINT `fk_professor_area1` FOREIGN KEY (`area_id_area`) REFERENCES `area`(`id_area`) ON DELETE NO ACTION ON UPDATE NO ACTION;
