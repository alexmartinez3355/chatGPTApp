import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class ChatgptService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  })

  constructor(
    private http: HttpClient
  ) { }

  obtenerRespuesta(pregunta: string){
    return this.http.post('https://api.openai.com/v1/chat/completions', {
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": pregunta}],
      "temperature": 0.7,
      "max_tokens": 2048
    }, {headers: this.headers})
  }
}
