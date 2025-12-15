import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService, Post } from '../../services/post.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule, TopbarComponent],
  templateUrl: './post-view.component.html',

  styleUrl: './post-view.component.scss',
})
export class PostViewComponent implements OnInit {
  post$!: Observable<Post>;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.post$ = this.postService.getPost(slug);
  }
}
