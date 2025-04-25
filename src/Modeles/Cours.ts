import { Etape } from "./Etape";

export interface Cours{
    id:number;
    titre:string;
    contenu:string;
    niveau:string;
    imageUrl: string;
    etapes: Etape[];   //liste des etapes
   
    
}
