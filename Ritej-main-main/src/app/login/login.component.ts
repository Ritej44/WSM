import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  
  showPassword = false;
  currentClient: any =[];
  ClientsArray : any[] = [];
  name :string="";
  role:string="";
  currentClientID = "";
  email: string ="";
  password: string ="";

  constructor(private router: Router,private http: HttpClient,private toastr:ToastrService ) {
  }
 private url: string = "http://localhost:8080/api/user/login";
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  validateEmail() {
    if (this.email && !this.emailRegex.test(this.email)) {
      this.toastr.error('Veuillez entrer un email valide.');
    }
  }
  

  validateFields(): boolean {
    if (!this.name) {
      this.toastr.error('Le nom est requis');
      return false;
    }
    if (!this.email) {
      this.toastr.error('L\'email est requis');
      return false;
    }
    if (!this.password) {
      this.toastr.error('Le mot de passe est requis');
      return false;
    }
    if (!this.emailRegex.test(this.email)) {
      this.toastr.error('Veuillez entrer un email valide');
      return false;
    }
    
    return true;
  }  
 Login() {
  if (!this.validateFields()) {
      return;}
  let bodyData = {
    name: this.name,
    email: this.email,
    password: this.password,

  };

  this.http.post<any>("http://localhost:8080/api/user/login", bodyData).subscribe(

    (resultData) => {
      console.log(resultData);
      if ((resultData as any).message == "Email not exits") {
        this.toastr.error('Email not exits');
      } else if ((resultData as any).message == "Login Success") {
        this.router.navigateByUrl("/about");
      }
    }
  );
 
}


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  storedUser: any = localStorage.getItem('currentUser');

  }



  


