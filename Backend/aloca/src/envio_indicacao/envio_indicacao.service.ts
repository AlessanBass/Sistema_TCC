import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { unlink, writeFile } from 'fs/promises';
import { ProfessorService } from 'src/professor/professor.service';
import { AreaService } from 'src/area/area.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { AlocacaoService } from 'src/alocacao/alocacao.service';
import { OfertaService } from 'src/oferta/oferta.service';

interface Alocacao {
  oferta_id_oferta: number;
  professor_id_professor: number;
}

interface Professor {
  nomeProfessor: string;
  observacoes?: string | null;
  area_id_area: number;
}

@Injectable()
export class EnvioIndicacaoService {

  constructor(
    private readonly _disciplina: DisciplinaService,
    private readonly _area: AreaService,
    private readonly _professor: ProfessorService,
    private readonly _alocacao: AlocacaoService,
    private readonly _oferta: OfertaService
  ) { }

  async upload(file: Express.Multer.File, path: string): Promise<boolean> {
    try {
      await writeFile(path, file.buffer);
      return true;
    } catch (e) {
      throw new BadRequestException("Service: Erro ao salvar arquivo");
    }
  }

  async readExecel(file: Express.Multer.File, path: string) {
    await this.upload(file, path); /* Espera escrever o */
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(path);
    } catch (error) {
      throw new BadRequestException('Erro ao ler o arquivo Excel: ' + error.message);
    }

    // Obtendo a primeira planilha
    const sheet = workbook.getWorksheet(1);

    // Array para armazenar os dados da planilha
    const data = [];

    sheet.eachRow((row, rowNum) => {
      // Objeto para armazenar os dados de uma linha
      const rowData = {};

      row.eachCell((cell, colNum) => {
        // Verificar se o valor da célula é nulo ou indefinido
        if (cell.value === null || cell.value === undefined) {
          // Se a célula estiver vazia, definir o valor como zero
          rowData[`column${colNum}`] = 0;
        } else {
          // Se a célula não estiver vazia, usar o valor existente
          rowData[`column${colNum}`] = cell.value;
        }
      });

      // Adicionar os dados da linha ao array de dados
      data.push(rowData);
    });
    await this.excelDataProcessing(data);
    /* Jogar essa isso de apagar em uma função */
    try {
      await unlink(path);
      console.log('Arquivo excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir o arquivo:', error);
    }
  }

  async excelDataProcessing(data: any[]) {
    for (let i = 1; i < data.length; i++) {
      const item = data[i];
      let area = await this.findArea(item);
      let professor = await this.findProfessor(item);
      let oferta = await this.findOferta(item);

      /* Criando uma alocação Preciso tratar isso aqui  */
      if (!oferta) {
        console.log('Erro na oferta, por favor fazer a inserção no banco');
      }

      if (area && professor && oferta) {
        /*  console.log(`Professor: ${professor.nome_professor} | ID OFERTA: ${oferta.id_oferta}} | TURMA: ${oferta.turma}`); */
        let newAlocacao = {
          oferta_id_oferta: oferta.id_oferta,
          professor_id_professor: professor.id_professor
        }
        try {
          await this.createAlocacao(newAlocacao, item.column5.trim());
        } catch (error) {
          throw new BadRequestException("Erro ao criar alocacao");
        }

      } else {
        /* Adiciono o professor no banco */
        let newProfessor = {
          nomeProfessor: item.column8.trim().toUpperCase(),
          area_id_area: area.id_area,
        }

        let retorno = await this.createProfessor(newProfessor);
        if (retorno) {
          if (oferta) {
            let newAlocacao = {
              oferta_id_oferta: oferta.id_oferta,
              professor_id_professor: retorno.id_professor
            }
            try {
              await this.createAlocacao(newAlocacao, item.column5.trim());
            } catch (error) {
              throw new BadRequestException("Erro ao criar alocacao");
            }
          }
        }
      }
    }
  }

  async createAlocacao(newAlocacao: Alocacao, turma: string) {
    try {
      return this._alocacao.create(newAlocacao, turma);
    } catch (error) {
      throw new BadRequestException(`Erro ao tentar criar alocacao (Envio Service)`);
    }
  }

  async createProfessor(newProfessor: Professor) {
    try {
      let retorno = await this._professor.create(newProfessor);
      if (!retorno) {
        throw new BadRequestException(`Erro ao tentar criar o professor: ${newProfessor.nomeProfessor}`);
      }
      return retorno;
    } catch (error) {
      throw new BadRequestException(`Erro ao tentar criar o professor: ${newProfessor.nomeProfessor}`);
    }
  }

  async findArea(item: any) {
    let areaExcel = item.column9.split(' ');
    if (areaExcel.length >= 2) {
      let area = await this._area.getContains(areaExcel[1]);
      if (area.length >= 1) {
        return area[0];
      }
    } else {
      let area = await this._area.findByNome(areaExcel[0]);
      if (area.length >= 1) {
        return area[0];
      }
    }
  }

  async findProfessor(item: any) {
    let retorno = await this._professor.findByName(item.column8.trim());
    if (retorno === null || retorno === undefined) {
      return null;
    }
    return retorno;
  }

  async findOferta(item: any) {
    let disciplina = item.column2.trim();
    let turma = item.column5.trim();
    let retorno = await this._oferta.findByDisciplinaAndTurma(disciplina, turma);
    if (retorno === null || retorno === undefined) {
      return null;
    }
    return retorno;
  }

  async findDisciplina(item: any) {
    let retorno = await this._disciplina.findOneCod(item.column1.trim());

    if (retorno === null || retorno === undefined) {
      return null;
    }
    return retorno;
  }
}
