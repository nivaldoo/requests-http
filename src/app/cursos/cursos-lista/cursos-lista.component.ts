import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from '../curso';
import { CursosService } from '../cursos.service';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  of,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from 'src/app/alert-modal/alert-modal.component';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { emptyCurso } from 'common/helper';
import { error } from 'console';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  //cursos: Curso[] = [];

  deleteModalRef: BsModalRef | null = null;
  @ViewChild('deleteModal') deleteModal = null;

  cursos$: Observable<Curso[]> = of();
  sub: Observable<Curso[]> = new Observable<any>();
  bsModalRef: BsModalRef | any = null;

  cursoSelecionado: Curso | null = null;

  constructor(
    private service: CursosService,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.service.list()
    //   .subscribe(dados => this.cursos = dados);
    this.onRefresh();
  }

  onRefresh() {
    this.cursos$ = this.service.list().pipe(
      catchError((error) => {
        this.handleError();
        return of();
      })
    );
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar cursos.');
    // this.bsModalRef = this.modalService.show(AlertModalComponent);
    // this.bsModalRef.content.type = 'danger';
    // this.bsModalRef.content.message = 'Erro ao carregar cursos.';
  }

  onEdit(id: number) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(curso: Curso) {
    this.cursoSelecionado = curso;
    // this.deleteModalRef = this.modalService.show(this.deleteModal, {
    //   class: 'modal-sm',
    // });
    const result$ = this.alertService.showConfirm(
      'Confirmação',
      'Tem certeza que deseja remover esse curso?'
    );

    result$
      .asObservable()
      .pipe(
        take(1),
        switchMap((result) => (result ? this.service.remove(curso.id) : EMPTY)),
        catchError(_ => {
          this.alertService.showAlertDanger(
            'Erro ao remover curso. Tente novamente.2'
          );
          this.onDeclineDelete();
          return EMPTY;
        })
      )
      .subscribe(_ => {
        this.alertService.showAlertSuccess('Curso removido com sucesso');
        this.onRefresh();
      });
  }

  onConfirmDelete() {
    console.log('confirm');
    this.service
      .remove(this.cursoSelecionado?.id)
      // .pipe(
      //   catchError((e) => {
      //     this.alertService.showAlertDanger(
      //       'Erro ao remover curso. Tente novamente.2'
      //     );
      //     this.onDeclineDelete();
      //     return EMPTY;
      //   })
      // )
      .subscribe(
        //   n => {
        //   this.onRefresh();
        //   this.onDeclineDelete();
        // }
        {
          next(value) {
            super.onRefresh();
            super.onDeclineDelete();
          },
          error(err) {
            super.alertService.showAlertDanger(
              'Erro ao remover curso. Tente novamente.2'
            );
            super.onDeclineDelete();
          },
          complete() {
            console.log('opa');
          },
        }
      );
  }

  onDeclineDelete() {
    this.deleteModalRef?.hide();
  }
}
