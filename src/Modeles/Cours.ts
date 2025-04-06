import { Etape } from "./Etape";

export interface Cours{
    id:number;
    titre:string;
    cotenu:string;
    niveau:string;
    etapes: Etape[];   //liste des etapes
   
    
}