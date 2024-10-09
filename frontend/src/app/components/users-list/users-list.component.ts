import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users?: any;
  currentUser: User = {};
  currentIndex = -1;
  title = '';

  currentPage: number = 1;
  itemsPerPage: number = 10; // You can change the number of items per page
  totalItems: number = 10;

  constructor(private userService: UserService) { }

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

  searchTitle(): void {
    this.currentUser = {};
    this.currentIndex = -1;
    this.userService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.users = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
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
}
