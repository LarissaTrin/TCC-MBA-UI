import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonAppearance, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() appearance: MatButtonAppearance = 'text';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() disabled: boolean = false;
  @Input() onClick: () => void = () => {};
}
