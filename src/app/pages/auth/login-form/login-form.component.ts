import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { InputComponent } from '../../../components/inputs/input/input.component';
import { CheckboxComponent } from '../../../components/inputs/checkbox/checkbox.component';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';

@Component({
    selector: 'app-login-form',
    imports: [
        ReactiveFormsModule,
        NgIf,
        InputComponent,
        CheckboxComponent,
        SubmitButtonComponent
    ],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
    @Output() toggleForms = new EventEmitter<void>();
    protected errorMessage: string | null = null;
    private formBuilder: FormBuilder = inject(FormBuilder)
    form = this.formBuilder.group({
        username: ["", [Validators.required]],
        password: ["", [Validators.required]],
        remember: [false, [Validators.required]],
    })

    constructor() {
        this.form.valueChanges.subscribe(_ => {
            this.errorMessage = null;
        })
    }

    onSubmit(event: SubmitEvent) {
        if (this.form.invalid) {
            setTimeout(() => {
                (event.submitter as HTMLButtonElement).disabled = false;
            });
            this.errorMessage = "Invalid form data";
            return;
        }
        console.log(this.form.value);
    }

    toggleForm() {
        this.toggleForms.emit();
    }
}
