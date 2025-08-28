import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {}
