import { Routes } from '@angular/router';
import { PublicLayout } from './public-layout/public-layout';
import { ServiceDetails } from './service-details/service-details';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { About } from './about/about';
import { ViewAll } from './public-layout/view-all/view-all';
import { ProviderLayout } from './provider-layout/provider-layout';
import { Dashboard } from './provider-layout/dashboard/dashboard';
import { MyServices } from './provider-layout/my-services/my-services';
import { Bookings } from './provider-layout/bookings/bookings';
import { Messages } from './provider-layout/messages/messages';
import { Reviews } from './provider-layout/reviews/reviews';
import { ProfileSettings } from './provider-layout/profile-settings/profile-settings';

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
    path: 'provider',
    component: ProviderLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
        title: 'Provider Dashboard - Itinera',
      },
      {
        path: 'my-services',
        component: MyServices,
        title: 'My Services - Itinera',
      },
      {
        path: 'bookings',
        component: Bookings,
        title: 'Bookings - Itinera',
      },
      {
        path: 'messages',
        component: Messages,
        title: 'Messages - Itinera',
      },
      {
        path: 'reviews',
        component: Reviews,
        title: 'Reviews - Itinera',
      },
      {
        path: 'profile-settings',
        component: ProfileSettings,
        title: 'Profile & Settings - Itinera',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
