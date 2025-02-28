import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [MatToolbarModule,MatIconModule],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  signIn() {
    // Add your sign-in logic here
    console.log('Sign In button clicked');
  }
}
