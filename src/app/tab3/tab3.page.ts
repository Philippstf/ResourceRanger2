import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  categories = [
    { name: 'Barcode einscannen', icon: 'barcode-outline' },
    { name: 'Metall', icon: 'hammer-outline' },
    { name: 'Holz', icon: 'leaf-outline' }, 
    { name: 'Kunststoffe', icon: 'cube-outline' },
    { name: 'Farbe', icon: 'color-fill-outline' },
    { name: 'Putzmaterial', icon: 'construct-outline' },
    { name: 'Werkzeuge', icon: 'hammer-outline' },
    // Fügen Sie hier weitere Kategorien hinzu
  ];

  constructor() { }

  selectCategory(category: any) {
    // Implementieren Sie hier die Logik für das Auswählen einer Kategorie
    console.log('Selected category:', category.name);
    // Navigation zur Detailansicht oder Aktivieren der entsprechenden Funktion
  }
}

