import { Routes } from '@angular/router';
import { PublicLayout } from './public-layout/public-layout';
import { ServiceDetails } from './service-details/service-details';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { About } from './about/about';
import { ViewAll } from './public-layout/view-all/view-all';
import { Dashboard } from './provider-layout/dashboard/dashboard';
import { MyServices } from './provider-layout/my-services/my-services';
import { Bookings as ProviderBookings } from './provider-layout/bookings/bookings';
import { Messages } from './provider-layout/messages/messages';
import { Reviews } from './provider-layout/reviews/reviews';
import { ProfileSettings } from './provider-layout/profile-settings/profile-settings';
import { Overview } from './admin-layout/overview/overview';
import { Providers } from './admin-layout/providers/providers';
import { Services } from './admin-layout/admin-services/services';
import { Users } from './admin-layout/users/users';
import { Bookings as AdminBookings } from './admin-layout/bookings/bookings';
import { Chatbot } from './public-layout/chatbot/chatbot';
import { ProviderLayout } from './provider-layout/provider-layout';
import { AdminLayout } from './admin-layout/admin-layout';
import { TouristLayout } from './tourist-layout/tourist-layout';
import { TouristDashboard } from './tourist-layout/dashboard/dashboard';
import { TouristBookings } from './tourist-layout/bookings/bookings';
import { TouristWishlist } from './tourist-layout/wishlist/wishlist';
import { TouristReviews } from './tourist-layout/reviews/reviews';
import { TouristMessages } from './tourist-layout/messages/messages';
import { TouristProfile } from './tourist-layout/profile/profile';
import { TouristSettings } from './tourist-layout/settings/settings';
import { TouristPayments } from './tourist-layout/payments/payments';

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
    path: 'chatbot',
    component: Chatbot,
    title: 'Chatbot - Itinera',
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
        component: ProviderBookings,
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
    path: 'tourist',
    component: TouristLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: TouristDashboard,
        title: 'Tourist Dashboard - Itinera',
      },
      {
        path: 'bookings',
        component: TouristBookings,
        title: 'My Bookings - Itinera',
      },
      {
        path: 'payments',
        component: TouristPayments,
        title: 'Payment Tracking - Itinera',
      },
      {
        path: 'wishlist',
        component: TouristWishlist,
        title: 'My Wishlist - Itinera',
      },
      {
        path: 'reviews',
        component: TouristReviews,
        title: 'My Reviews - Itinera',
      },
      {
        path: 'messages',
        component: TouristMessages,
        title: 'Messages - Itinera',
      },
      {
        path: 'profile',
        component: TouristProfile,
        title: 'My Profile - Itinera',
      },
      {
        path: 'settings',
        component: TouristSettings,
        title: 'Settings - Itinera',
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: Overview,
        title: 'Admin Dashboard - Itinera',
      },
      {
        path: 'providers',
        component: Providers,
        title: 'Providers - Admin - Itinera',
      },
      {
        path: 'services',
        component: Services,
        title: 'Services - Admin - Itinera',
      },
      {
        path: 'users',
        component: Users,
        title: 'Users - Admin - Itinera',
      },
      {
        path: 'bookings',
        component: AdminBookings,
        title: 'Bookings - Admin - Itinera',
      },
      {
        path: 'settings',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
