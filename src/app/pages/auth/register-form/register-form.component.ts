import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';
import { InputComponent } from '../../../components/inputs/input/input.component';
import { CheckboxComponent } from '../../../components/inputs/checkbox/checkbox.component';
import { AuthService } from '../../../services/auth.service';

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

    constructor(private authService: AuthService) {
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
        this.authService.register(
            {
                "firstName": this.form.value.firstName!,
                "lastName": this.form.value.lastName!,
                "userName": this.form.value.username!,
                "email": this.form.value.email!,
                "password": this.form.value.password!
            }
        ).subscribe({
            next: () => {
                this.toggleForm();
                alert("Registration successful! Please log in to continue.");
            },
            error: error => {
                if (error.status === 0) {
                    this.errorMessage = "Server is not available";
                } else {
                    this.errorMessage = error.message;
                }
            },
        })
    }

    toggleForm() {
        this.toggleForms.emit()
    }
}
