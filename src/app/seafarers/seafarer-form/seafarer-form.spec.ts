import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeafarerFormComponent } from './seafarer-form';
// Fixed: Changed import name to match the actual component export

describe('SeafarerFormComponent', () => {
  let component: SeafarerFormComponent;
  let fixture: ComponentFixture<SeafarerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeafarerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeafarerFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});