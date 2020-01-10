import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  // Definitions
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;  
  context: CanvasRenderingContext2D;
  boundings: any;

  // Specifications
  mouseX: number = 0;
  mouseY: number = 0;
  isDrawing: boolean = false;
  lineCap: CanvasLineCap = 'round'; // initial brush cap

  // Handle colors
  colors: string[] = [
    '#F73D2B',
    '#F4015D',
    '#9D02B0',
    '#4F2393',
    '#3C49B6',
    '#44AF51',
    '#009687',
    '#01BBD4',
    '#00A3F3',
    '#0F91F2',
    '#86C64B',
    '#CCDE37',
    '#FDED32',
    '#FEC224',
    '#FF951B',
    '#000000',
    '#5F7C8C',
    '#9D9D9D',
    '#795546',
    '#F9560B',
  ]

  // Handle Brushes
  brushes: string[] = ['1', '2', '4', '8'];

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.boundings = this.canvas.nativeElement.getBoundingClientRect();

    this.context.strokeStyle = this.colors[15];
    this.context.lineWidth = +this.brushes[0];
    this.context.lineCap = this.lineCap;
        
    // To apturie mouse events
    this.captureEvents(this.canvas.nativeElement);
  }

  /**
   * 
   * @param canvasEl 
   */
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // Capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // Record all mousemoves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // The user releases the mouse   
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // The mouse leaves the canvas
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // Draw a line from the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
  
        // Previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        // Do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  /**
   * 
   * @param prevPos 
   * @param currentPos 
   */
  private drawOnCanvas(
    prevPos: { x: number, y: number }, 
    currentPos: { x: number, y: number }
  ) {
    // Incase the context is not set
    if (!this.context) { return; }
  
    // Start our drawing path
    this.context.beginPath();
  
    // Draw lines so need a previous position
    if (prevPos) {
      // Sets the start point
      this.context.moveTo(prevPos.x, prevPos.y); // from
  
      // Draws a line from the start pos until the current position
      this.context.lineTo(currentPos.x, currentPos.y);
  
      // Strokes the current path with the styles we set earlier
      this.context.stroke();
    }
  }

  /**
   * 
   * @param e 
   */
  setColor(e): void {
    this.context.strokeStyle = e.target.value || 'black';
  }

  /**
   * 
   * @param e 
   */
  setBrush(e): void {
    this.context.lineWidth = e.target.value || 1;
  }

  onUndo(): void {
    // TODO: Implement
  }

  onRedo(): void {
    // TODO: Implement
  }
}
