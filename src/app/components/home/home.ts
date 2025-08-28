import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/widgets/button/button';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {}
