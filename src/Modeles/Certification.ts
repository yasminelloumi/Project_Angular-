import { Cours } from "./Cours";
import { Etudiant } from "./Etudiant";

export interface Quiz{
    id:number;
    etudiant:Etudiant;
    cours:Cours; 
    
}