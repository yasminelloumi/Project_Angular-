import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { EtudiantParant } from 'Modeles/Etudiant-parant.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from 'app/confirmdialog/confirmdialog.component';
//import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'NumeroUnique',
    'Nom',
    'Prenom',
    'email',
    'niveau',
    'NomParent',
    'EmailParent',
    'actions'
  ];
  dataSource: EtudiantParant[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataService.getEtudiantsWithParants().subscribe({
      next: (data) => {
        this.dataSource = data;
        console.log('Fetched data:', data);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

   delete(id: number) {
   let dialogRef = this.dialog.open(ConfirmdialogComponent, {
      height: '200px',
       width: '300px',
     });

     dialogRef.afterClosed().subscribe((result) => {
       if (result) {
         this.dataService.deleteEtudiantById(id).subscribe({
           next: () => {
             this.dataService.getEtudiantsWithParants().subscribe((data) => {
               this.dataSource = data;
             });
           },
           error: (err) => {
            console.error('Error deleting etudiant:', err);
           }
         });
       }
     });
   }

  edit(id: number) {
    this.router.navigate(['admin', id, 'edit']);
  }
}