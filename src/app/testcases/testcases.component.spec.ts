import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcasesComponent } from './testcases.component';

describe('TestcasesComponent', () => {
  let component: TestcasesComponent;
  let fixture: ComponentFixture<TestcasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestcasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestcasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
