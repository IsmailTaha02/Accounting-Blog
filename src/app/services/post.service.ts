import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // private apiUrl = 'http://127.0.0.1:5000/api/posts';
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPost(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${slug}`);
  }

  addPost(data: any) {
    const token = localStorage.getItem('admin_token');

    return this.http.post(this.apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deletePost(slug: string, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${slug}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
}
