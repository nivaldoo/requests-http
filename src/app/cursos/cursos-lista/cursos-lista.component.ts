import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  //cursos: Curso[] = [];

  cursos$: Observable<Curso[]> = of();
  sub: Observable<Curso[]> = new Observable<any>();
  bsModalRef: BsModalRef | any = null;

  constructor(
    private service: CursosService,
    //private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.service.list()
    //   .subscribe(dados => this.cursos = dados);

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
}
