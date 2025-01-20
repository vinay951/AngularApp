import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikebuyerpredictionComponent } from './bikebuyerprediction.component';

describe('BikebuyerpredictionComponent', () => {
  let component: BikebuyerpredictionComponent;
  let fixture: ComponentFixture<BikebuyerpredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikebuyerpredictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikebuyerpredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
