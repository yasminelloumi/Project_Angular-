import { Cours } from "./Cours";
import { Quiz } from "./Quiz";

export interface Etape{
    id: number;
    titre: string;
    description: string;
    contentType: 'video' | 'text' | 'quiz'; // Nouveau champ pour indiquer le type de contenu
    contentData: string | Quiz[]; // Nouveau champ pour les données du contenu
    ordre: number;
    estComplete:boolean;
    cours: Cours;  
    
}
