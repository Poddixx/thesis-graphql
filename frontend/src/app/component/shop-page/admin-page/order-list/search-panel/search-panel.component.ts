import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SelectItem} from '../../../../../shared/interface/select-item.interface';
import {FilterArg} from '../../../../../shared/interface/query-list-args.interface';
import {FilterOperator} from '../../../../../shared/enum/filter-operator.enum';
import {InputType} from 'src/app/shared/enum/input.type';
import {ORDER_STATUS} from '../../../../../shared/const/order-status.const';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styles: [],
})
export class SearchPanelComponent implements OnInit {

  InputType = InputType;
  ORDER_STATUS = ORDER_STATUS;

  form: FormGroup;

  readonly categories: SelectItem[] = ORDER_STATUS;

  @Output()
  search = new EventEmitter<FilterArg[]>();

  constructor() {
  }

  ngOnInit(): void {
    this.prepareFormGroup();
  }

  searchClick() {
    if (this.form.valid) {
      this.search.emit(this.mapDataToFilterArgs());
    }
  }

  resetForm() {
    this.form.reset();
    this.search.emit([]);
  }

  private prepareFormGroup() {
    this.form = new FormGroup({
      number: new FormControl(''),
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
      status: new FormControl(''),
    });
  }

  private mapDataToFilterArgs(): FilterArg[] {
    const value = this.form.value;
    const result: FilterArg[] = [];
    result.push({key: 'orderNo', value: (value.number || '').toString(), op: FilterOperator.EQ});
    result.push({key: 'createdAt', value: value?.dateFrom?.toISOString?.(), op: FilterOperator.GT});
    result.push({key: 'createdAt', value: value?.dateTo?.toISOString?.(), op: FilterOperator.LT});
    result.push({key: 'status', value: (value.status || []).join(), op: FilterOperator.IN});
    return result.filter(el => el.value);
  }
}
