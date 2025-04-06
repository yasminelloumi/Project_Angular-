import { Cours } from "./Cours";

export interface Etape{
    id: number;
    titre: String;
    contenu: String;
    ordre: number;
    estComplete: Boolean;
    cours: Cours;  
    
}