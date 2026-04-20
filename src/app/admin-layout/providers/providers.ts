import { Component } from '@angular/core';

interface ProviderRow {
  id: string;
  business: string;
  owner: string;
  location: string;
  rating: string;
  services: number;
  earnings: string;
  status: 'Active' | 'Pending' | 'Suspended';
}

@Component({
  selector: 'app-providers',
  imports: [],
  templateUrl: './providers.html',
  styleUrl: './providers.css',
})
export class Providers {
  providers: ProviderRow[] = [
    {
      id: 'PR-1001',
      business: 'Dar El Medina Group',
      owner: 'Hedi Mansour',
      location: 'Tunis',
      rating: '4.8',
      services: 3,
      earnings: '$12,400',
      status: 'Active',
    },
    {
      id: 'PR-1002',
      business: 'Blue Coast Tours',
      owner: 'Yasmine Rejeb',
      location: 'Sidi Bou Said',
      rating: '4.7',
      services: 5,
      earnings: '$18,200',
      status: 'Active',
    },
    {
      id: 'PR-1003',
      business: 'Sahara Expeditions',
      owner: 'Khaled Dridi',
      location: 'Douz',
      rating: '4.9',
      services: 2,
      earnings: '$9,800',
      status: 'Active',
    },
    {
      id: 'PR-1004',
      business: 'Medina Flavors',
      owner: 'Fatma Ben Ali',
      location: 'Tunis',
      rating: '4.4',
      services: 1,
      earnings: '$3,600',
      status: 'Pending',
    },
    {
      id: 'PR-1005',
      business: 'Cap Bon Rentals',
      owner: 'Sami Gharbi',
      location: 'Hammamet',
      rating: '4.2',
      services: 4,
      earnings: '$7,100',
      status: 'Active',
    },
    {
      id: 'PR-1006',
      business: 'Carthage Heritage',
      owner: 'Rim Ksouri',
      location: 'Carthage',
      rating: '4.6',
      services: 2,
      earnings: '$5,500',
      status: 'Pending',
    },
  ];
}
