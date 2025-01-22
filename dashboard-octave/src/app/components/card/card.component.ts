import { Component, inject, input } from '@angular/core';
import { Environment } from '../../models/environment.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  apiServ= inject(ApiService);
  environment = input.required<Environment>();
  index = input.required();
}
