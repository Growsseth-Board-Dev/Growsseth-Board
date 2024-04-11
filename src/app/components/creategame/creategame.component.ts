import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/tauri";
import { app } from '@tauri-apps/api';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './creategame.component.html'
})

export class CreateGameComponent implements OnInit {

  @ViewChild('playerNameInput') playerName!: ElementRef;

  ngOnInit() {
    
  }

  constructor(private router: Router ) {

  }

  toMenu() {
    this.router.navigate(['']);
  }

  async createRoom() {
    try {
      let name = this.playerName.nativeElement.value;
      if(name == "")
      {
        throw new Error("Input field empty");
      }

      let api_key = null;
      let ip = null;

      await Promise.all([
        invoke("retrieve_env").then((message) => {
          api_key = message;
        }),
        invoke("retrieve_ip").then((message) => {
          ip = message;
        })
      ]);

      if(api_key != null)
      {
        const response = await axios.get('http://127.0.0.1:5000/createLobby/' + api_key + "/" + ip + "/" + name);
        console.log(response);
      }
    } catch (error) {
      console.error('Error fetching lobby data:', error);
    }
  }

}