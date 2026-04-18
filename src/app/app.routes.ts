import { Routes } from '@angular/router';
import { PublicLayout } from './public-layout/public-layout';
import { ServiceDetails } from './service-details/service-details';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { About } from './about/about';
import { ViewAll } from './public-layout/view-all/view-all';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    title: 'Home - Itinera',
  },
  {
    path: 'sign-in',
    component: SignIn,
    title: 'Sign In - Itinera',
  },
  {
    path: 'sign-up',
    component: SignUp,
    title: 'Sign Up - Itinera',
  },
  {
    path: 'home',
    component: PublicLayout,
    title: 'Home - Itinera',
  },
  {
    path: 'service-details',
    component: ServiceDetails,
    title: 'Service Details - Itinera',
  },
  {
    path: 'about-us',
    component: About,
    title: 'About Us - Itinera',
  },
  {
    path: 'view-all',
    component: ViewAll,
    title: 'Explore Services - Itinera',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
