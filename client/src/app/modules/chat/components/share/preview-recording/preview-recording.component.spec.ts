import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRecordingComponent } from './preview-recording.component';

describe('PreviewRecordingComponent', () => {
  let component: PreviewRecordingComponent;
  let fixture: ComponentFixture<PreviewRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewRecordingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
