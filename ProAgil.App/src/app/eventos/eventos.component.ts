import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eventos',
  templateUrl: './Eventos.component.html',
  styleUrls: ['./Eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  imagemLargura: number = 50;
  imagemMargem: number = 2;
  mostrarImagem: boolean = true;
  modalRef: BsModalRef;

  _filtroLista: string = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.getEventos();
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(value) : this.eventos;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  alterarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
    }, error => {
      console.log(error);
    });
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
}
