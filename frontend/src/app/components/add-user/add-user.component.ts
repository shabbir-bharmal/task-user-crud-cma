import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  };
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  submitted = false;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  saveUser(): void {
    if (!this.userForm.valid) {
      this.userForm.touched;
      this.cdr.markForCheck();
      return;
    }
    if (this.userForm.valid) {
       const data = this.userForm.value;
    this.userService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
      },
      error: (e) => console.error(e)
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
}
