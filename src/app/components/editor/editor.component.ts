import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder } from '@angular/forms';

import jsPDF from 'jspdf';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { Configuration, OpenAIApi } from "openai";
import { ChatgptService } from 'src/app/services/chatgpt-service/chatgpt.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {



  configuration = new Configuration({
    apiKey: 'API-KEY',
  });

  formulario: FormGroup = new FormGroup({})

  respuestaChatGPT: string = '';

  @ViewChild('pdfTable') pdfTable: ElementRef;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text in this rich text editor....',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
    'insertVideo', 'backgroundColor']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private chatgptService: ChatgptService
  ) { }

  ngOnInit(): void {
    const openai = new OpenAIApi(this.configuration);
    const response = openai.listEngines();

    this.formulario = this.fb.group({
      htmlContent: [''],
      pregunta: ['']
    })

    this.formulario.get('htmlContent').valueChanges.subscribe(resp => {
      /* this.pdfTable.nativeElement.innerHTML = '' */
    })
  }

  exportarPDF(){
    let maqueta = this.formulario.get('htmlContent').value;
    const pdfTable = this.pdfTable.nativeElement;
    pdfTable.innerHTML = maqueta;
    let html = htmlToPdfmake(pdfTable.innerHTML);
    console.log(html);
    pdfTable.innerHTML = '';
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  }

  preguntar(){
    let pregunta: string = this.formulario.get('pregunta').value;
    this.chatgptService.obtenerRespuesta(pregunta).subscribe(resp => {
      this.respuestaChatGPT = resp['choices'][0].message.content;
    })
  }
}
