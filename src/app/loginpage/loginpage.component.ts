import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginComponent implements OnInit {
  users: any[] = [];

  constructor(
    private builder: FormBuilder,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private userService: UserService,
    
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    this.loadUsers();
  }

  loginForm!: FormGroup;
  email: string = '';
  password: string = '';

  async onSubmit() {
    try {
      const isAdmin = this.checkAdminStatus();

      if (isAdmin) {
        console.log('Admin logged in:', this.email);
        this.router.navigateByUrl('/adminpage');
      } else {
        console.log('User is not an admin.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  private createLoginForm() {
    this.loginForm = this.builder.group({
      email: [''],
      password: ['']
    });
  }

  private loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      console.log('Users loaded:', this.users.length); 
    
    },
    error => {
      console.error('Error loading users:', error);
    });
  }

  private checkAdminStatus(): boolean {
    console.log(this.email)
    return this.users.some(user => user.role === 'admin' && user.email === this.email);
  }

}
