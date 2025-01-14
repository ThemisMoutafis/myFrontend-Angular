import { Component, Input, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-api-news-feed',
  standalone: true,
  imports: [],
  templateUrl: './api-news-feed.component.html',
  styleUrl: './api-news-feed.component.css',
})
export class ApiNewsFeedComponent {
  http: HttpClient = inject(HttpClient);
  userService = inject(UserService);
  user = this.userService.user;
  stringNews: {
    title: string;
    author: string | null;
    description: string;
    url: string | null;
  }[] = [];

  private readonly today: Date = new Date();
  private readonly yesterday: Date = new Date(new Date().setDate(this.today.getDate() - 1));


  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  API_KEY: string = '280a11c1ef4146bd859954fa436e3b1e';

  request: string = `https://newsapi.org/v2/everything?q=${this.userService.user()?.countryName}&from=${this.formatDate(this.today)}&to=${this.formatDate(this.yesterday)}&sortBy=popularity&apiKey=${this.API_KEY}`;

  ngOnInit() {
    this.displayNews();
    console.log(this.formatDate(this.yesterday))
    console.log(this.request)
  }

  getNews() {
    return this.http.get<any>(this.request, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
  displayNews() {
    this.getNews().subscribe((data: any) => {
      // Map through articles to display title, author, and description
      this.stringNews = data.articles.map((article: any) => {
        return {
          title: article.title,
          author: article.author,
          description: article.description,
          url: article.url,
        };
      });
    });
  }
}
