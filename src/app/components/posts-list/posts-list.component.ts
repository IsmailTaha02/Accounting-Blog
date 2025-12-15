import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService, Post } from '../../services/post.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    AsyncPipe,
    RouterModule,
    FormsModule,
    TopbarComponent,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts$ = new BehaviorSubject<Post[]>([]);
  searchQuery: string = '';

  constructor(private postService: PostService, public auth: AuthService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts;
      this.filteredPosts$.next(posts);
    });
  }

  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    const filtered = this.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );
    this.filteredPosts$.next(filtered);
  }

  deletePost(event: Event, slug: string) {
    event.stopPropagation(); // ⛔ stop routerLink
    event.preventDefault(); // ⛔ extra safety
    if (!confirm('Are you sure you want to delete this post?')) return;

    const token = this.auth.getToken();
    if (!token) return;

    this.postService.deletePost(slug, token).subscribe({
      next: () => {
        // Remove from local list
        this.posts = this.posts.filter((p) => p.slug !== slug);
        this.filteredPosts$.next(this.posts);
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete post');
      },
    });
  }
}
