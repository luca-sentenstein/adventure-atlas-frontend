import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';
import { InputComponent } from '../../../components/inputs/input/input.component';
import { CheckboxComponent } from '../../../components/inputs/checkbox/checkbox.component';

@Component({
    selector: 'app-register-form',
    imports: [
        ReactiveFormsModule,
        NgIf,
        SubmitButtonComponent,
        InputComponent,
        CheckboxComponent,
    ],
    templateUrl: './register-form.component.html',
    styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
    @Output() toggleForms = new EventEmitter<void>();
    protected errorMessage: string | null = null;
    private formBuilder: FormBuilder = inject(FormBuilder)
    form = this.formBuilder.group({
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        username: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        remember: [false, [Validators.required]]
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
        this.toggleForms.emit()
    }
}
