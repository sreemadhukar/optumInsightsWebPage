import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  barChartsArray = [
    { question: 'QUESTION1', answer: 'ANSWER1' },
    { question: 'QUESTION2', answer: 'ANSWER2' },
    { question: 'QUESTION3', answer: 'ANSWER3' },
    { question: 'QUESTION4', answer: 'ANSWER4' },
    { question: 'QUESTION5', answer: 'ANSWER5' }
  ];
  constructor() {}

  ngOnInit() {}
}
