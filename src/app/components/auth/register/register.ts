import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {}
