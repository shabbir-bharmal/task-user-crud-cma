import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
	selector: 'app-add-user',
	templateUrl: './add-user.component.html',
	styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
	user: User = {
		name: '',
		email: '',
		password: '',
		dateOfBirth: '',
	};
	userForm = new FormGroup({
		name: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required, Validators.minLength(6)]),
		dateOfBirth: new FormControl('', [Validators.required, dateNotInFuture()]),
	});

	submitted = false;

	constructor(private userService: UserService,
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private cdr: ChangeDetectorRef,
	) { }

	saveUser(): void {
		if (!this.userForm.valid) {
			this.userForm.touched;
			this.cdr.markForCheck();
			this.userForm.markAllAsTouched();
			return;
		}
		if (this.userForm.valid) {
			const data = this.userForm.value;

			if (data.dateOfBirth) {
				data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0]; // Format: YYYY-MM-DD
			}
			this.userService.create(data).subscribe({
				next: (res) => {
					console.log(res);
					this.submitted = true;
					this.router.navigate(['users'])
					Swal.fire({
						text: 'User Information Submitted Successfully.',
						icon: 'success',
						showCancelButton: false,
						confirmButtonText: 'Ok',
						reverseButtons: false,
					}).then((result) => {
						if (result.isConfirmed) {
							this.router.navigate(['users']);
						}
					});
				},
				error: (e) => {
					if (e.error?.errorType === 'duplicate_email') {
						Swal.fire('Error', 'Email already exists. Please use a different email.', 'error');
					} else if (e.error?.errorType === 'invalid_data') {
						Swal.fire('Error', 'Failed to add user. Please try again later.', 'error');
					}
				}
			});
		}
	}

	newUser(): void {
		this.submitted = false;
		this.user = {
			name: '',
			email: '',
			password: '',
		};
		this.userForm.reset();
	}
	cancel(): void {
		this.router.navigate(['users']);
	}
}

// Custom validator to check if the date is not in the future
export function dateNotInFuture(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: boolean } | null => {
		const date = new Date(control.value);
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
		return date > today ? { futureDate: true } : null;
	};
}
