import { Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { LoginComponent } from './components/login/login.component';
export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostsListComponent },
  {
    path: 'post/:slug',
    loadComponent: () =>
      import('./components/post-view/post-view.component').then(
        (m) => m.PostViewComponent
      ),
  },
  { path: 'add-post', component: AddPostComponent },
  { path: 'login', component: LoginComponent },
];
