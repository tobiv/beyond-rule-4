import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { round } from '../../utilities/number-utility';

import { CalculateInput } from '../../models/calculate-input.model';
import { Forecast, MonthlyForecast } from '../../models/forecast.model';

@Component({
  selector: 'app-fi-text',
  templateUrl: 'fi-text.component.html'
})

export class FiTextComponent implements OnInit, OnChanges {
  @Input() calculateInput: CalculateInput;
  @Input() forecast: Forecast;

  safeWithdrawalTimes: number;
  safeWithdrawalRate: number;
  fiNumber: number;
  fiMonthForecast: MonthlyForecast;
  fiDate: string;
  dateDistance: string;

  leanFiNumber: number;
  leanFiDate: string;
  leanFiDateDistance: string;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    this.calculate();
  }

  calculate() {
    const safeWithdrawalTimes = 1 / this.calculateInput.annualSafeWithdrawalRate;
    this.safeWithdrawalTimes = round(safeWithdrawalTimes);
    this.safeWithdrawalRate = round(this.calculateInput.annualSafeWithdrawalRate * 100);
    const fiNumber = Math.max(0, round(safeWithdrawalTimes * this.calculateInput.annualExpenses));
    this.fiNumber = fiNumber;

    const leanFiNumber = Math.max(0, round(this.safeWithdrawalTimes * this.calculateInput.leanAnnualExpenses));
    this.leanFiNumber = leanFiNumber;

    if (!this.forecast) {
      return;
    }

    const foundFiForecast = this.forecast.monthlyForecasts.find(f => f.netWorth >= fiNumber);
    if (!foundFiForecast) {
      this.fiDate = 'Never';
      this.dateDistance = 'Forever';
      this.fiMonthForecast = undefined;
    } else {
      this.fiDate = foundFiForecast.toDateString();
      this.dateDistance = this.forecast.getDistanceFromFirstMonthText(foundFiForecast.date) || '0 Months';
      this.fiMonthForecast = foundFiForecast;
    }

    const foundLeanFiForecast = this.forecast.monthlyForecasts.find(f => f.netWorth >= leanFiNumber);
    if (!foundLeanFiForecast) {
      this.leanFiDate = 'Never';
      this.leanFiDateDistance = 'Forever';
    } else {
      this.leanFiDate = foundLeanFiForecast.toDateString();
      this.leanFiDateDistance = this.forecast.getDistanceFromFirstMonthText(foundLeanFiForecast.date) || '0 Months';
    }
  }
}
