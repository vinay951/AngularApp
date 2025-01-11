import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRegisterComponent } from './test-register.component';

describe('TestRegisterComponent', () => {
  let component: TestRegisterComponent;
  let fixture: ComponentFixture<TestRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
