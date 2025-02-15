import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrangeComponent } from './strange.component';

describe('StrangeComponent', () => {
  let component: StrangeComponent;
  let fixture: ComponentFixture<StrangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
