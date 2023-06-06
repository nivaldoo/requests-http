import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CursosService } from '../cursos.service';
import { Location } from '@angular/common';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { catchError, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Curso } from '../curso';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss'],
})
export class CursosFormComponent implements OnInit {
  submited = false;

  form: FormGroup | any = null;

  constructor(
    private fb: FormBuilder,
    private service: CursosService,
    private location: Location,
    private modal: AlertModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.route.params.pipe(
    //   map((params) => params['id']),
    //   switchMap((id) => this.service.loadById(id))
    // ).subscribe(
    //   (curso: Curso) => this.updateForm(curso)
    // );

    // this.form = this.fb.group({
    //   id: [null],
    //   nome: [
    //     null,
    //     [
    //       Validators.required,
    //       Validators.minLength(3),
    //       Validators.maxLength(50),
    //     ],
    //   ],
    // });
    const curso = this.route.snapshot.data['curso'];

    this.form = this.fb.group({
      id: [curso.id],
      nome: [
        curso.nome,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  // updateForm(curso: Curso) {
  //   this.form.patchValue({
  //     id: curso.id,
  //     nome: curso.nome,
  //   });
  // }

  hasErrors(field: string) {
    return this.form.get(field).errors;
  }

  onSubmit() {
    this.submited = true;
    console.log('this.form)');
    if (this.form.valid) {
      console.log(this.form.value);
      this.service.create(this.form.value).subscribe(
        (next) => {
          this.modal.showAlertSuccess('Curso criado com sucesso!');
          this.location.back();
        },
        (error) => this.modal.showAlertDanger('Não foi possível criar o curso')
      );
    }
  }

  onCancel() {
    this.submited = false;
    this.form.reset();
  }
}
