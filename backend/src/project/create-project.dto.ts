export class CreateProjectDto {
    nomProjet: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    taches: { nom: string,description: string,  id: number ,deadline: Date }[];
  }
  