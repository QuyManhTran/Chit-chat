import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewChatComponent } from './preview-chat.component';

describe('PreviewChatComponent', () => {
  let component: PreviewChatComponent;
  let fixture: ComponentFixture<PreviewChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
