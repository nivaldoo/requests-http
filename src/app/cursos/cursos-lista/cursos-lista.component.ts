import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from '../curso';
import { CursosService } from '../cursos.service';
import {
  Observable,
  Subscription,
  catchError,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from 'src/app/alert-modal/alert-modal.component';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { emptyCurso } from 'common/helper';

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
    this.deleteModalRef = this.modalService.show(this.deleteModal, {
      class: 'modal-sm',
    });
  }

  onConfirmDelete() {
    console.log('confirm');
    this.service.remove(this.cursoSelecionado?.id).subscribe(
      (next) => {
        this.onRefresh();
        this.onDeclineDelete();
      },
      (error) => {
        this.alertService.showAlertDanger(
          'Erro ao remover curso. Tente novamente.'
        );
        this.onDeclineDelete();
      }
    );
  }

  onDeclineDelete() {
    this.deleteModalRef?.hide();
  }
}
