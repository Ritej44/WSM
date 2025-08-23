import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  logoSrc = '../../assets/logo__2_-removebg-preview.png';
  paymentSrc = '../../assets/payment.png';
  contactEmail1 = 'ritejbouaicha@gmail.com';
  contactEmail2 = 'israbouaicha@gmail.com';
  contactPhone = '+123 456 7890';
  footer = 'assets/footer.PNG';
}
