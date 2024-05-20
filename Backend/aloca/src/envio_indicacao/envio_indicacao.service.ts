import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { unlink, writeFile } from 'fs/promises';
import { ProfessorService } from 'src/professor/professor.service';
import { AreaService } from 'src/area/area.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { AlocacaoService } from 'src/alocacao/alocacao.service';
import { OfertaService } from 'src/oferta/oferta.service';
import { SemestreService } from 'src/semestre/semestre.service';
import { CursoService } from 'src/curso/curso.service';
import { throwError } from 'rxjs';

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
    private readonly _oferta: OfertaService,
    private readonly _semestre: SemestreService,
    private readonly _curso: CursoService
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

    /* console.log(data); */
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
      let disciplina = await this.findDisciplina(item);
      console.log(item.column2);

      /* 
        Se essa oferta ainda não existir eu crio a OFERTA!

        1° Verificar se o professor existe (Caso não eu salvo ele) depois tento criar a oferta!
        2° Verificar se disciplina existe! (Caso não, crio ela) depois tento a oferta
      */
      if (!oferta) {
        if(professor){
          console.log(`Professor: ${item.column8} existe!`);
        }else{
          console.log(`Preciso criar: Professor: ${item.column8} `);
        }

        if(disciplina){
          console.log(`Disciplina: ${item.column2} existe!`);
        }else{
          console.log(`Preciso Criar: Disciplina: ${item.column2} existe!`);
        }

        if(professor && disciplina){
          console.log("preciso criar uma oferta");

          /* 
          
            Existe disciplinas de curso diferentes, porém com o mesmo nome e codigo
             caso de eletroeletronica, preciso verificar no banco de de dados depois
          */
        }
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
        console.log("to passando aqui!");
        /* Adiciono o professor no banco */
        let newProfessor = {
          nomeProfessor: item.column8.trim().toUpperCase(),
          area_id_area: area.id_area,
        }

        let retorno = await this.createProfessor(newProfessor);
        /* console.log("Retorno: " + retorno.nome_professor); */
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
    if(item.column8 === undefined || item.column8 === null || item.column8.length <5){
      item.column8 = "SEM INDICAÇÃO";
    }
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

  async finOneSemestre(id_semestre: number){
    return this._semestre.findOne(id_semestre);
  }

  async findOneCurso(id_colegiado: number){
    return this._curso.findOne(id_colegiado);
  }

  async download(id_colegiado: number, id_semestre: number) {
    const colegiado = await this._curso.findOne(id_colegiado);
    const semestre = await this._semestre.findOne(id_semestre);
    const alocacoes = await this._alocacao.findByColegiado(id_colegiado);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Indicação ${semestre.nome_semestre}`);

    /* Adicionar cabeçalhos na minha tabela */
    let headers = [
      {header:'CÓD', key: 'id', width:10 },
      {header:'DISCIPLINA', key: 'disciplina', width:50 },
      {header:'CH', key: 'ch', width:10 },
      {header:'CHs', key: 'chs', width:10 },
      {header:'TURMA', key: 'turma', width:10 },
      {header:'B ou L', key: 'boul', width:20 },
      {header:'CURSO', key: 'curso', width:30 },
      {header:'PROFESSOR', key: 'professor', width:60 },
      {header:'ÁREA', key: 'area', width:30 },
      {header:'FORMANDOS', key: 'formandos', width:30 },
      {header:'OBSERVAÇÕES', key: 'obs', width:70 },
    ];

    worksheet.columns = headers;

    /* Aplicando estilo */
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Cor da fonte branca
      cell.fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'FF0000FF'} // Cor de fundo azul
      };
    });

    alocacoes.forEach(alocacao =>{
        /* console.log(`COD: ${alocacao.oferta.disciplina.cod}`);
        console.log(`DISCIPLINA: ${alocacao.oferta.disciplina.nome_disciplina}`);
        console.log(`CH: ${alocacao.oferta.disciplina.carga_horaria}`);
        console.log(`CHs: ${alocacao.oferta.disciplina.carga_horaria}`);
        console.log(`TURMA: ${alocacao.oferta.turma}`);
        console.log(`B ou L: ${alocacao.oferta.disciplina.curso.tipo_curso}`);
        console.log(`CURSO: ${alocacao.oferta.disciplina.curso.nome_curso}`);
        console.log(`PROFESSOR: ${alocacao.professor.nome_professor}`);
        console.log(`AREA: ${alocacao.oferta.area.nome_area}`);
        console.log(`FORMANDOS: ${alocacao.oferta.formandos}`);
        console.log(`OBS: ${alocacao.oferta.obs_colegiado}`);
        console.log("--------------------------------------------------"); */

        worksheet.addRow({
          id: alocacao.oferta.disciplina.cod,
          disciplina: alocacao.oferta.disciplina.nome_disciplina,
          ch: alocacao.oferta.disciplina.carga_horaria,
          chs: alocacao.oferta.disciplina.qtd_creditos,
          turma: alocacao.oferta.turma,
          boul: alocacao.oferta.disciplina.curso.tipo_curso,
          curso: alocacao.oferta.disciplina.curso.nome_curso,
          professor: alocacao.professor.nome_professor,
          area: alocacao.oferta.area.nome_area,
          formandos: alocacao.oferta.formandos,
          obs: alocacao.oferta.obs_colegiado,
        });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

}
