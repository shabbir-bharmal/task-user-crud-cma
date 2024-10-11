import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { from } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  @Input() viewMode = false;

  @Input() currentUser: User = {
    name: '',
    email: '',
    password: '',
    dateOfBirth:'',
  };

  message = '';
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', []),
    dateOfBirth: new FormControl('', [Validators.required, dateNotInFuture()]),
  });

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getUser(this.route.snapshot.params['id']);
    }
  }

  getUser(id: string): void {
    this.userService.get(id).subscribe({
      next: (data) => {
        this.currentUser = data;
        console.log(data);
        this.currentUser.dateOfBirth = new Date(this.currentUser.dateOfBirth);
        this.currentUser.dateOfBirth = this.formatDate(this.currentUser.dateOfBirth);
        console.log(this.currentUser);
        
        this.userForm.patchValue(this.currentUser);
      },
      error: (e) => console.error(e)
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format to YYYY-MM-DD
  }

  updateUser(): void {
    if (this.userForm.valid) {
    this.message = '';

    this.userService
      .update(this.currentUser.id, this.userForm?.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'This user was updated successfully!';
              this.router.navigate(['users'])
              Swal.fire({
                text: 'This user was updated successfully!',
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
        error: (e) => console.error(e)
      });
    }
  }

  backToListing():void{
    this.router.navigate(['users'])
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