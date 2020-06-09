import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatisticsService } from '../services/statistics.service';


@Component({
  selector: 'app-time-spent-graph',
  templateUrl: './time-spent-graph.component.html',
  styleUrls: ['./time-spent-graph.component.css']
})
export class TimeSpentGraphComponent implements OnInit {
  constructor(private statisticsService: StatisticsService) {}

  bubbleData: any[];
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Time Spent (min.)';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  maxRadius: number = 20;
  minRadius: number = 5;
  yScaleMin: number = 0.3;
  yScaleMax: number = 120;
  lodaded = false;

  colorScheme = {
    domain: ['#007bff']
  };

  ngOnInit() {
    this.statisticsService.getTimeSpent().subscribe((res: any[]) => {
      this.bubbleData = res;
      this.lodaded = true;
    })
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
