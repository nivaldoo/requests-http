import { Curso } from "src/app/cursos/curso";

export function emptyCurso(): Curso {
  return {
    id: null,
    nome: null,
  };
}
