import { Injectable } from '@angular/core';
import { UserProvider } from '../models/user-provider';

@Injectable({
  providedIn: 'root',
})
export class UserProviderService {
  providersList: UserProvider[] = [
    {
      id: 101,
      first_name: 'Karim',
      last_name: 'Benali',
      email: 'karim.benali@saharapalace.tn',
      phone: '+216 74 470 123',
      address: 'Route des Dunes, Douz, Kébili 4260',
      profile_picture: '/images/providers/karim-benali.jpg',
      validation_status: 'approved',
    },
    {
      id: 102,
      first_name: 'Yasmine',
      last_name: 'Chaouachi',
      email: 'yasmine.chaouachi@maisonbleue.tn',
      phone: '+216 71 740 456',
      address: 'Rue Sidi Bou Saïd, Sidi Bou Saïd, Tunis 2026',
      profile_picture: '/images/providers/yasmine-chaouachi.jpg',
      validation_status: 'approved',
    },
    {
      id: 103,
      first_name: 'Mehdi',
      last_name: 'Trabelsi',
      email: 'mehdi.trabelsi@darzarrouk.tn',
      phone: '+216 71 561 789',
      address: 'Rue Sidi Bou Khrissan, Médina de Tunis, Tunis 1008',
      profile_picture: '/images/providers/mehdi-trabelsi.jpg',
      validation_status: 'approved',
    },
    {
      id: 104,
      first_name: 'Amal',
      last_name: 'Jebali',
      email: 'amal.jebali@carthaguide.tn',
      phone: '+216 71 730 234',
      address: 'Avenue Habib Bourguiba, Carthage, Tunis 2016',
      profile_picture: '/images/providers/amal-jebali.jpg',
      validation_status: 'approved',
    },
    {
      id: 105,
      first_name: 'Nizar',
      last_name: 'Hamdi',
      email: 'nizar.hamdi@transfertunisie.tn',
      phone: '+216 98 456 012',
      address: 'Rue de Marseille, Le Bardo, Tunis 2000',
      profile_picture: '/images/providers/nizar-hamdi.jpg',
      validation_status: 'pending',
    },
    {
      id: 106,
      first_name: 'Salma',
      last_name: 'Ouertani',
      email: 'salma.ouertani@djerbaexplore.tn',
      phone: '+216 75 653 678',
      address: 'Zone Touristique Midoun, Djerba, Médenine 4116',
      profile_picture: '/images/providers/salma-ouertani.jpg',
      validation_status: 'rejected',
    },
  ];

  getProviders(): UserProvider[] {
    return this.providersList;
  }
}
