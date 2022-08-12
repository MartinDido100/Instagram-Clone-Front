import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path:'',
        component: PrincipalComponent
      },
      {
        path:'explore',
        component: ExploreComponent
      },
      {
        path: 'direct/imbox',
        component: ChatsComponent
      },
      {
        path: ':username',
        component: ProfileComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

