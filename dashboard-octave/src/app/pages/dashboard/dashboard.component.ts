import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Environment } from '../../models/environment.model';
import { ApiService } from '../../services/api.service';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CardComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  environments = signal<Environment[]>([]);
  api = inject(ApiService);
  data: any;
  dataChart: any;
  color : string = 'red';
  selectedVariable = 'co2EquivalentValue';

  variables = [
    { label: 'CO₂ Equivalent Value (ppm)', value: 'co2EquivalentValue' },
    { label: 'Breath VOC Value', value: 'breathVocValue' },
    { label: 'Temperature (°C)', value: 'temperature' },
    { label: 'Humidity (%)', value: 'humidity' },
    { label: 'Pressure (Pa)', value: 'pressure' },
    { label: 'IAQ Value', value: 'iaqValue' }
  ];
  ngOnInit(): void {
    this.api.getData().subscribe(
      (response) => {
        console.log('here');
        const data = response.body;
        if (data && Array.isArray(data)) {
          this.environments.set(
            data.map(item => item.elems?.environment).filter(env => env)
          );
          this.initializeChart();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }

  initializeChart(): void {
    const initialData = this.environments().map(env => env.co2EquivalentValue);
    const labels = this.environments().map((_, index) => `Env ${index + 1}`);
    console.log(initialData);
    this.dataChart = new Chart('dataChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label:' Equivalents Value ',
            data: initialData,
            borderColor: '#9F2B68',
            backgroundColor: '#9F2B68',
            tension:0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Environment Data'
            }
          },
          y: {
            title: {
              display: true,
              text: this.getVariableLabel(this.selectedVariable)
            }
          }
        }
      }
    });
  }
  updateChart(variable:string): void {
    console.log('changed');
    console.log(variable);
    console.log(this.selectedVariable);
    this.selectedVariable = variable
    const newData = this.getNewData(this.selectedVariable);

    this.dataChart.data.datasets[0].data = newData;
    this.dataChart.data.datasets[0].label = this.getVariableLabel(this.selectedVariable);
    this.dataChart.options.scales.y.title.text = this.getVariableLabel(this.selectedVariable);
    this.dataChart.update();
  }
  

  getVariableLabel(variable: string): string {
    const variableItem = this.variables.find(v => v.value === variable);
    return variableItem ? variableItem.label : 'Unknown Variable';
  }
  getNewData(variable: string):any{
    switch(variable){
      case "iaqValue": { return this.environments().map(env => env.iaqValue);
        break;
      }
      case "breathVocValue": { return this.environments().map(env => env.breathVocValue);
        break;
      }
      case "temperature": {return this.environments().map(env => env.temperature);
        break;
      }
      case "humidity": {return this.environments().map(env => env.humidity);
        break;
      }
      case "pressure": {return this.environments().map(env => env.pressure);
        break;
      }
      default: {return this.environments().map(env => env.co2EquivalentValue);
        break;
      }
    }
  }
}
