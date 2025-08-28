import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  showFiller = false;
  @ViewChild('drawer') drawer!: MatDrawer;
  drawerWidth = 200; // valor inicial

  toggleDrawer() {
    this.drawerWidth = this.drawerWidth === 200 ? 50 : 200;
  }
}
