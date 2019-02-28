import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipManagerComponent } from './flip-manager.component';

describe('FlipManagerComponent', () => {
  let component: FlipManagerComponent;
  let fixture: ComponentFixture<FlipManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
