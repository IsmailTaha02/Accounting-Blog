import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router, RouterModule } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [FormsModule, RouterModule, TopbarComponent],
  templateUrl: './add-post.component.html',

  styleUrl: './add-post.component.scss',
})
export class AddPostComponent {
  title = '';
  // slug = '';
  content = '';

  constructor(private postService: PostService, private router: Router) {}

  addPost() {
    const newPost = {
      title: this.title,
      // slug: this.slug,
      content: this.content,
    };

    this.postService.addPost(newPost).subscribe(() => {
      this.router.navigate(['/posts']);
    });
  }
}
