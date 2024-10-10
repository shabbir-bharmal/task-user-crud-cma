import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { from } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  };

  message = '';
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', []),
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
        this.userForm.patchValue(this.currentUser);
      },
      error: (e) => console.error(e)
    });
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
            alert('This user was updated successfully!');
              this.router.navigate(['users'])
        },
        error: (e) => console.error(e)
      });
    }
  }

  backToListing():void{
    this.router.navigate(['users'])
  }
}
