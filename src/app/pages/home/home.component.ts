import { Component } from '@angular/core';
import {LinkComponent} from "../../components/links/link/link.component";
import {LogoComponent} from "../../components/logo/logo.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
    imports: [
        LinkComponent,
        LogoComponent,
        RouterLink
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
