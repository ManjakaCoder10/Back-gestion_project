export class CreateProjectDto {
    id?: number;
    nomProjet: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    taches: { nom: string,description: string,  id: number ,deadline: Date ,taskid?:number}[];
  }
  