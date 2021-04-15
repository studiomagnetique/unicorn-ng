import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const CURRENT_YEAR: number = new Date().getFullYear();

@Component({
  selector: 'app-manage-unicorn',
  templateUrl: './manage-unicorn.component.html',
  styleUrls: ['./manage-unicorn.component.scss'],
})
export class ManageUnicornComponent {
  public formGroup: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    birthyear: [CURRENT_YEAR, [Validators.min(1800), Validators.max(CURRENT_YEAR)]],
  });

  constructor(private readonly formBuilder: FormBuilder) {}
}
