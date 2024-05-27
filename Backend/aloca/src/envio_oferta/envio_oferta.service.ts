import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { AreaService } from 'src/area/area.service';
import { CursoService } from 'src/curso/curso.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { OfertaService } from 'src/oferta/oferta.service';
import { SemestreService } from 'src/semestre/semestre.service';

interface Oferta {
  turma?: string | null;
  formandos: string | null;
  obs_colegiados?: string | null;
  disciplina_id_disciplina: number;
  semestre_id_semestre: number;
  area_id_area: number;
}

interface Disicplina {
  periodo: number;
  cod: string;
  nome_disciplina: string;
  carga_horaria: number;
  qtd_creditos: number;
  curso_id_curso: number;
  area_id_area: number;
}

interface Erro {
  linha: number,
  mensagem: string,
  valor_celular: string | number | null | undefined,
  tipo_esperado: string,
  detalhe: string | null
}

@Injectable()
export class EnvioOfertaService {

  constructor(
    private readonly _oferta: OfertaService,
    private readonly _disciplina: DisciplinaService,
    private readonly _curso: CursoService,
    private readonly _semestre: SemestreService,
    private readonly _area: AreaService,
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
    const extension = file.originalname.split('.').pop();
    let workbook;

    if (extension === 'xlsx') {
      workbook = new ExcelJS.Workbook();
      try {
        await workbook.xlsx.readFile(path);
      } catch (error) {
        throw new BadRequestException('Erro ao ler o arquivo Excel: ' + error.message);
      }
    } else if (extension === 'xls') {
      try {
        const buffer = await fs.readFile(path);
        const xlsWorkbook = XLSX.read(buffer, { type: 'buffer' });
        workbook = new ExcelJS.Workbook();
        const sheetData = XLSX.utils.sheet_to_json(xlsWorkbook.Sheets[xlsWorkbook.SheetNames[0]], { header: 1 });

        const sheet = workbook.addWorksheet('Sheet1');
        sheetData.forEach((row: any[]) => {
          sheet.addRow(row);
        });
      } catch (error) {
        throw new BadRequestException('Erro ao ler o arquivo Excel: ' + error.message);
      }
    } else {
      throw new BadRequestException('Formato de arquivo não suportado');
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

    let erros = await this.excelDataProcessing(data);
    /* Jogar essa isso de apagar em uma função */
    try {
      await unlink(path);
      /*     console.log('Arquivo excluído com sucesso'); */
    } catch (error) {
      /* console.error('Erro ao excluir o arquivo:', error); */
    }

    return erros;

    /*  if (erros.length > 0) {
       throw new BadRequestException(erros);
     } */
  }

  async excelDataProcessing(data: any[]) {
    let erros = [];
    if (data[0].column1.trim().toUpperCase() === "PERÍODO") {
      for (let i = 1; i < data.length; i++) {
        const item = data[i];
        /* Preciso tratar tbm linhas apenas com dados como total de créditos */
        if ((item.column2 === undefined || typeof item.column2 === 'object') && (item.column3 === undefined || typeof item.column3 === 'object')) {
          continue;
        }
        /* Verifica disciplinas que estão sem código */
        if (item.column2 === null || item.column2 === undefined || typeof item.column2 === 'object') {
          /* Retornoar um erro no array */
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Disciplinha de encontra sem o código",
            valor_celular: "undefined",
            tipo_esperado: "string",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }
        
        /* Verifica se a disciplina tá Qtd_créditos */
        if (item.column5 === null || item.column5 === undefined || typeof item.column5 === 'object') {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Disciplinha de encontra sem a quantidade de créditos",
            valor_celular: "undefined",
            tipo_esperado: "number",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }

        /* Verifica a carga horária */
        if (item.column4 === null || item.column4 === undefined || typeof item.column4 === 'object') {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Disciplinha de encontra sem a carga horária",
            valor_celular: "undefined",
            tipo_esperado: "number",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }

        /* Verifica se tem curso alocado */
        if (item.column8 === null || item.column8 === undefined || typeof item.column8 === 'object') {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Coluna Curso de encontra vazia",
            valor_celular: "undefined",
            tipo_esperado: "String",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }

        let area = await this.findArea(item);
        let curso = await this.findCurso(item);
        /* Verifica se o curso existe ou não */
        if (!curso) {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Curso não existe",
            valor_celular: "undefined",
            tipo_esperado: "Disciplina",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }
        let disciplina = await this.findDisciplina(item, curso.id_curso);
        let semestre = await this.findSemestre(item); /* Retona o ultimo semestre inserido */
        /* Aqui eu creio uma oferta */
        if (disciplina && curso && semestre && area) {
          if (item.column6 === undefined) {
            item.column6 = "SEM TURMA";
          }

          if (typeof item.column6 === 'number') {
            item.column6 = item.column6.toString();
          }
          if (item.column11 === undefined) {
            item.column11 = null
          }

          if (item.column12 === undefined) {
            item.column12 = null
          }

          if (typeof item.column11 === 'number') {
            item.column11 = item.column11.toString();
          }

          let newOfeta = {
            turma: item.column6,
            formandos: item.column11,
            obs_colegiados: item.column12,
            disciplina_id_disciplina: disciplina.id_disciplina,
            semestre_id_semestre: semestre.id_semestre,
            area_id_area: area.id_area,
          }
          /* Encapsular em um try catch */
          await this.createOferta(newOfeta);
        } else { /* Aqui eu crio uma disciplina */
          /* Falta criar curso, area e semstre, caso não existam ainda */
          let periodo = item.column1;
          if (typeof periodo === 'string') {
            periodo = 100;
          }

          let newDisciplina = {
            periodo: periodo,
            cod: item.column2,
            nome_disciplina: item.column3,
            carga_horaria: (+item.column4),
            qtd_creditos: (+item.column5),
            curso_id_curso: curso.id_curso,
            area_id_area: area.id_area,
          }
          /* Colocar isso em uma função */
          let retorno = await this.createDisciplina(newDisciplina);
          if (!retorno) {
            console.log(`erro ao salavar a disciplina ${newDisciplina.nome_disciplina}`);
          } else {
            if (item.column6 === undefined) {
              item.column6 = "SEM TURMA"
            }

            if (typeof item.column6 === 'number') {
              item.column6 = item.column6.toString();
            }

            if (item.column11 === undefined) {
              item.column11 = null
            }

            if (item.column12 === undefined) {
              item.column12 = null
            }

            if (typeof item.column11 === 'number') {
              item.column11 = item.column11.toString();
            }

            /* Verifica tipo RichText */
            if (item.column12 && item.column12.richText) {
              item.column12 = item.column12.richText.map(part => part.text).join('');
            }

            let newOfeta = {
              turma: item.column6,
              formandos: item.column11,
              obs_colegiados: item.column12,
              disciplina_id_disciplina: retorno.id_disciplina,
              semestre_id_semestre: semestre.id_semestre,
              area_id_area: retorno.area_id_area,
            }
            await this.createOferta(newOfeta);
          }
        }
      }
    } else {
      /* Tabela sem período */
      for (let i = 1; i < data.length; i++) {
        const item = data[i];
        /* Preciso tratar tbm linhas apenas com dados como total de créditos */
        if ((item.column1 === undefined || typeof item.column1 === 'object') && (item.column2 === undefined || typeof item.column2 === 'object')) {
          continue;
        }
        /* Verifica disciplinas que estão sem código */
        if (item.column1 === null || item.column1 === undefined || typeof item.column1 === 'object') {
          /* Retornoar um erro no array */
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Disciplinha de encontra sem o código",
            valor_celular: "undefined",
            tipo_esperado: "string",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        } 

        /* Verifica se a disciplina tá Qtd_créditos */
        if (item.column4 === null || item.column4 === undefined || typeof item.column4 === 'object') {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Disciplinha de encontra sem a quantidade de créditos",
            valor_celular: "undefined",
            tipo_esperado: "number",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }

        /* Verifica a carga horária */
        if (item.column3 === null || item.column3 === undefined || typeof item.column3 === 'object') {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Disciplinha de encontra sem a carga horária",
            valor_celular: "undefined",
            tipo_esperado: "number",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }

        /* Verifica se tem curso alocado */
        if (item.column7 === null || item.column7 === undefined || typeof item.column7 === 'object') {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Coluna Curso de encontra vazia",
            valor_celular: "undefined",
            tipo_esperado: "String",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }
        let area = await this.findArea(item);
        let curso = await this.findCurso2(item);
        /* Verifica se o curso existe ou não */
        if (!curso) {
          let linha = i;
          let newErro: Erro = {
            linha: linha + 1,
            mensagem: "Curso não existe",
            valor_celular: "undefined",
            tipo_esperado: "Disciplina",
            detalhe: "Por favor, forneça um valor"
          }
          erros.push(newErro);
          continue;
        }

        let disciplina = await this.findDisciplina2(item, curso.id_curso);
        let semestre = await this.findSemestre(item); /* Retona o ultimo semestre inserido */

        /* Se eu encontrar a disciiplina, crio uma oferta */
        if (disciplina && curso && semestre && area) {
          if (item.column5 === undefined) {
            item.column5 = "SEM TURMA";
          }

          if (typeof item.column5 === 'number') {
            item.column5 = item.column5.toString();
          }
          if (item.column10 === undefined) {
            item.column10 = null
          }

          if (item.column11 === undefined) {
            item.column11 = null
          }

          if (typeof item.column10 === 'number') {
            item.column10 = item.column10.toString();
          }
          /* Verifica tipo RichText */
          if (item.column11 && item.column11.richText) {
            item.column11 = item.column11.richText.map(part => part.text).join('');
          }

          let newOfeta = {
            turma: item.column5,
            formandos: item.column10,
            obs_colegiados: item.column11,
            disciplina_id_disciplina: disciplina.id_disciplina,
            semestre_id_semestre: semestre.id_semestre,
            area_id_area: area.id_area,
          }

          /* Colocar um try catch */
          await this.createOferta(newOfeta);
        } else { /* Aqui eu crio uma disciplina */
          let periodo = 0;
          if (typeof periodo === 'string') {
            periodo = 100;
          }

          if (item.column4 === null || item.column4 === undefined || Number.isNaN(item.column4) || typeof item.column4 === 'object') {
            item.column4 = item.column4.result;
          }

          let newDisciplina = {
            periodo: periodo,
            cod: item.column1,
            nome_disciplina: item.column2,
            carga_horaria: (+item.column3),
            qtd_creditos: (+item.column4),
            curso_id_curso: curso.id_curso,
            area_id_area: area.id_area,
          }

          /* Encaplsular em um try catch */
          let retorno = await this.createDisciplina(newDisciplina);

          if (!retorno) {
            console.log(`erro ao salavar a disciplina ${newDisciplina.nome_disciplina}`);
          } else {
            if (item.column5 === undefined) {
              item.column5 = "SEM TURMA"
            }

            if (typeof item.column5 === 'number') {
              item.column5 = item.column5.toString();
            }
            /* formandos */
            if (item.column10 === undefined) {
              item.column10 = null
            }
            /* Obseservações */
            if (item.column11 === undefined) {
              item.column11 = null
            }

            if (typeof item.column10 === 'number') {
              item.column10 = item.column10.toString();
            }

            /* Verifica tipo RichText */
            if (item.column11 && item.column11.richText) {
              item.column11 = item.column11.richText.map(part => part.text).join('');
            }

            let newOfeta = {
              turma: item.column5,
              formandos: item.column10,
              obs_colegiados: item.column11,
              disciplina_id_disciplina: retorno.id_disciplina,
              semestre_id_semestre: semestre.id_semestre,
              area_id_area: retorno.area_id_area,
            }
            /* Encapesulsar em um trycatch */
            await this.createOferta(newOfeta);
          }
        }
      }
    }
    console.log(erros);
    return erros;
  }

  async createOferta(newOferta: Oferta) {
    try {
      let retorno = await this._oferta.create(newOferta);
      /* if(retorno){console.log(retorno.disciplina_id_disciplina)} */
      /* if (!retorno) {
        throw new BadRequestException(`Erro ao tentar criar a oferta`);
      } */
    } catch (error) {
      throw new BadRequestException(`Erro ao tentar criar a oferta`);
    }
  }

  async createDisciplina(newDisciplina: Disicplina) {
    try {
      let retorno = await this._disciplina.create(newDisciplina);
      if (!retorno) {
        throw new BadRequestException(`Erro ao tentar criar a disciplina: ${newDisciplina.nome_disciplina}`);
      }
      return retorno;
    } catch (error) {
      throw new BadRequestException(`Erro ao tentar criar a disciplina: ${newDisciplina.nome_disciplina}`);
    }
  }

  async findDisciplina(item: any, id_curso: number) {
    let disciplina = await this._disciplina.findOneCodAndCurso(item.column2.trim(), item.column3.trim(), id_curso);
    if (disciplina === null || disciplina === undefined) {
      return null;
    } else {
      return disciplina;
    }
  }

  async findDisciplina2(item: any, id_curso: number) {

    let disciplina = await this._disciplina.findOneCodAndCurso(item.column1.trim(), item.column2.trim(), id_curso);
    if (disciplina === null || disciplina === undefined) {
      return null;
    } else {
      return disciplina;
    }
  }

  async findCurso(item: any) {
    let cursoExcel = item.column8.split(' ');
    let tamanho = cursoExcel.length;
    if (cursoExcel.length >= 2) {
      let curso = await this._curso.getContains(cursoExcel[tamanho - 1]);
      if (curso.length >= 1) {
        return curso[0];
      }
    } else {
      let curso = await this._curso.findByNome(cursoExcel[0]);
      if (curso.length >= 1) {
        return curso[0];
      }
    }
  }

  async findCurso2(item: any) {
    let cursoExcel = item.column7.split(' ');
    let tamanho = cursoExcel.length;
    if (cursoExcel.length >= 2) {
      let curso = await this._curso.getContains(cursoExcel[tamanho - 1]);
      if (curso.length >= 1) {
        return curso[0];
      }
    } else {
      let curso = await this._curso.findByNome(cursoExcel[0]);
      if (curso.length >= 1) {
        return curso[0];
      }
    }
  }
  /* Reaproveitado */
  async findSemestre(item: any) {
    let semestre = await this._semestre.findLatest();
    if (semestre == null || semestre === undefined) {
      return null;
    } else {
      return semestre;
    }
  }
  /* Reaproveitado */
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

  async finOneSemestre(id_semestre: number) {
    return this._semestre.findOne(id_semestre);
  }

  async finOneArea(id_area: number) {
    return this._area.findOne(id_area);
  }

  async download(id_area: number, id_semestre: number) {
    const area = await this._area.findOne(id_area);
    const semestre = await this._semestre.findOne(id_semestre);
    const ofertas = await this._oferta.findByArea(id_area);

    /* Nome do nosso arquivo */
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Indicação ${semestre.nome_semestre} - ${area.nome_area}`);

    /* Adicionar cabeçalhos na minha tabela */
    let headers = [
      { header: 'CÓD', key: 'id', width: 10 },
      { header: 'DISCIPLINA', key: 'disciplina', width: 50 },
      { header: 'CH', key: 'ch', width: 10 },
      { header: 'CHs', key: 'chs', width: 10 },
      { header: 'TURMA', key: 'turma', width: 15 },
      { header: 'B ou L', key: 'boul', width: 20 },
      { header: 'CURSO', key: 'curso', width: 30 },
      { header: 'PROFESSOR', key: 'professor', width: 60 },
      { header: 'ÁREA', key: 'area', width: 30 },
      { header: 'FORMANDOS', key: 'formandos', width: 30 },
      { header: 'OBSERVAÇÕES', key: 'obs', width: 70 },
    ];

    worksheet.columns = headers;

    /* Aplicando estilo */
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Cor da fonte branca
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0000FF' } // Cor de fundo azul
      };
    });


    /* Adicionar os dados a planilha */
    ofertas.forEach(oferta => {
      /*  console.log(`COD: ${oferta.disciplina.cod}`);
        console.log(`DISCIPLINA: ${oferta.disciplina.nome_disciplina}`);
        console.log(`CH: ${oferta.disciplina.carga_horaria}`);
        console.log(`CHs: ${oferta.disciplina.carga_horaria}`);
        console.log(`TURMA: ${oferta.turma}`);
        console.log(`B ou L: ${oferta.disciplina.curso.tipo_curso}`);
        console.log(`PROFESSOR: ${' '}`);
        console.log(`AREA: ${oferta.disciplina.area.nome_area}`);
        console.log(`FORMANDOS: ${oferta.formandos}`);
        console.log(`OBS: ${oferta.obs_colegiado}`);
        console.log("--------------------------------------------------") */
      worksheet.addRow({
        id: oferta.disciplina.cod,
        disciplina: oferta.disciplina.nome_disciplina,
        ch: oferta.disciplina.carga_horaria,
        chs: oferta.disciplina.qtd_creditos,
        turma: oferta.turma,
        boul: oferta.disciplina.curso.tipo_curso,
        curso: oferta.disciplina.curso.nome_curso,
        professor: " ",
        area: oferta.disciplina.area.nome_area,
        formandos: oferta.formandos,
        obs: oferta.obs_colegiado,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
