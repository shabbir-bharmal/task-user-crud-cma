import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users?: any;
  currentUser: User = {};
  loggedInUserId;
  currentIndex = -1;
  title = '';

  currentPage: number = 1;
  itemsPerPage: number = 10; // You can change the number of items per page
  totalItems: number = 10;

  constructor(
    private userService: UserService
    , private router: Router
    , private cdr: ChangeDetectorRef
  ) { 
    this.loggedInUserId = localStorage.getItem('userId')?.toString();    
  }



  ngOnInit(): void {
    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.totalItems = this.users?.length;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveUsers();
    this.currentUser = {};
    this.currentIndex = -1;
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  removeAllUsers(): void {
    // this.userService.deleteAll().subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     this.refreshList();
    //   },
    //   error: (e) => console.error(e)
    // });
  }
  deleteUser(id: any): any {
    var userId = localStorage.getItem('userId');    
    if(userId == id){
      Swal.fire({
        title: 'Warning!',
        text: 'Logged-in user can\'t be deleted.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        reverseButtons: false,
        toast: true,
      }).then((result) => {
      });
      return false;  
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e)
        });
      }
    });
  }

  addUser(): void {
    this.router.navigate(['/users/add']);
  }

  searchTitle(): void {
    this.currentUser = {};
    this.currentIndex = -1;
    if (this.title) {
      this.userService.findByTitle(this.title).subscribe({
        next: (data) => {
          this.users = data;
          this.cdr.markForCheck();
          console.log(data);
        },
        error: (e) => console.error(e)
      });
    } else {
      this.refreshList();
    }
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    console.log(start);
    console.log(end);
    return this.users?.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.users?.length / this.itemsPerPage);
  }

  // Method to change page
  changePage(page: number) {
    this.currentPage = page;
    return false;
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }

  editUser(id: any): void {
    this.router.navigate(['users', id])
  }

  getDisplayedPages(): number[] {
    const totalPagesToShow = 5; // Adjust this value to change the number of adjacent pages to display
    const pages: number[] = [];
    
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
