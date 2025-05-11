import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFaceidComponent } from './login-faceid.component';

describe('LoginFaceidComponent', () => {
  let component: LoginFaceidComponent;
  let fixture: ComponentFixture<LoginFaceidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFaceidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFaceidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
