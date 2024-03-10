import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperchatComponent } from './wrapperchat.component';

describe('WrapperchatComponent', () => {
  let component: WrapperchatComponent;
  let fixture: ComponentFixture<WrapperchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WrapperchatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WrapperchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
