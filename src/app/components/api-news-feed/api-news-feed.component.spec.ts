import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiNewsFeedComponent } from './api-news-feed.component';

describe('ApiNewsFeedComponent', () => {
  let component: ApiNewsFeedComponent;
  let fixture: ComponentFixture<ApiNewsFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiNewsFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiNewsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
