import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "discover", component: DiscoverComponent},
    {path: "about", component: AboutComponent},
    {path: "auth", component: AuthComponent}
];
