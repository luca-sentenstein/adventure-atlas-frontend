import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthComponent } from './pages/auth/auth.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TripsComponent } from './pages/trips/trips.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "discover", component: DiscoverComponent},
    {path: "about", component: AboutComponent},
    {path: "auth", component: AuthComponent},
    {path: "trips", component: TripsComponent, canActivate: [authGuard]},
    {path: "**", component: NotFoundComponent}
];
