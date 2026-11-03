import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from '../models/invoice.model';
import { InvoiceService } from '../services/invoice.service';
import jsPDF from 'jspdf';
import autoTable from  'jspdf-autotable';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="invoice">
      <div class="card" id="invoice-preview">
        <div class="text-right">
          <button class="btn btn-primary" (click)="downloadPDF()">Download PDF</button>
        </div>

        <div class="invoice-header">
          <img src="assets/LOGOs-min.png" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;" />
          <h3>INVOICE</h3>
        </div>

        <div class="mb-3">
          <strong>Invoice #:</strong> {{ invoice.invoiceNumber }}<br>
          <strong>Date:</strong> {{ invoice.date | date:'mediumDate' }}<br>
          <strong><h1> company name: KUMARA MOTORS <br> NO17, Siriwardana Road, Dehiwela <br> Contact NO: 077-5036128 </h1></strong><br>
        </div>

        <div class="mb-3">
          <h3>Bill To:</h3>
          {{ invoice.customer.name }}<br>
          {{ invoice.customer.email  }}<br>
          {{ invoice.customer.address }}
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of invoice.products">
              <td>{{ product.name }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.price | number:'1.2-2' }}</td>
              <td>{{ product.total | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="text-right">
          <p>Subtotal: {{ invoice.subtotal | number:'1.2-2' }}</p>
          <p>Tax (0%): {{ invoice.tax | number:'1.2-2' }}</p>
          <p><strong>Total: {{ invoice.total | number:'1.2-2' }}</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @media print {
      .table {
        font-size: 12px;
      }
      .table th, .table td {
        padding: 6px;
      }
    }
  `]
})
export class InvoicePreviewComponent implements OnInit {
  invoice: Invoice | null = null;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.invoiceService.currentInvoice$.subscribe(invoice => this.invoice = invoice);
  }

  downloadPDF() {
    if (!this.invoice) return;
  
    const doc = new jsPDF({ unit: 'mm', format: 'A4' });
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

      // Add the company logo in the upper-right corner
      const logo = 'assets/LOGOs-min.png';  // Path to your images
      const logoWidth = 40;  // Logo width
      const logoHeight = 40; // Logo height
      const logoX = pageWidth - logoWidth - margin;  // Right-aligned logo
    
      // Add the logo to the PDF
      doc.addImage(logo, 'PNG', logoX, y, logoWidth, logoHeight);
    
  
    // Title
    doc.setFontSize(24);
    const title = 'INVOICE';
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
    doc.text(title, titleX, y);
    y += 15;
  
    // Invoice info
    doc.setFontSize(12);
    doc.text(`Invoice #: ${this.invoice.invoiceNumber}`, margin, y);
    y += 6;
    doc.text(`Date: ${new Date(this.invoice.date).toLocaleDateString()}`, margin, y);
    y += 10;
  
    // Company info
    doc.setFontSize(13);
    doc.text('KUMARA MOTORS', margin, y);
    y += 6;
    doc.setFontSize(12);
    doc.text('NO17, Siriwardana Road, Dehiwela', margin, y);
    y += 6;
    doc.text('Contact NO: 077-5036128', margin, y);
    y += 10;
  
    // Customer info
    doc.setFontSize(13);
    doc.text('Bill To:', margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(this.invoice.customer.name, margin, y);
    y += 6;
    doc.text(this.invoice.customer.email, margin, y);
    y += 6;
    doc.text(this.invoice.customer.address, margin, y);
    y += 10;
  
    // Product Table with AutoTable
    autoTable(doc, {
      startY: y,
      head: [['Product' ,'QTY','Price', 'Total']],
      body: this.invoice.products.map(p => [
        p.name,
        p.quantity.toString(),
        p.price.toFixed(2),
        p.total.toFixed(2)
      ]),
      

      columnStyles: {
        0: { cellWidth: 80 ,halign: 'left'  },   // Product
        1: { cellWidth: 15, halign: 'right' }, // Qty
        2: { cellWidth: 20, halign: 'right' }, // Price
        3: { cellWidth: 20, halign: 'right' }  // Total
      },
       styles:{ fontSize: 10  },

       headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        halign: 'right'
      },


      margin: { left: margin, right: margin },
      didDrawPage: (_data: any) => {
        const pageNumber = (doc as any).getCurrentPageInfo().pageNumber;
        const totalPages = (doc as any).getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${pageNumber} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }
    });
  
    const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
  
    // Totals
    doc.setFontSize(12);
    doc.text(`Subtotal: ${this.invoice.subtotal.toFixed(2)}`, pageWidth - margin - 60, finalY + 10);
    doc.text(`Tax (0%): ${this.invoice.tax.toFixed(2)}`, pageWidth - margin - 60, finalY + 17);
    doc.setFontSize(14);
    doc.text(`Total: ${this.invoice.total.toFixed(2)}`, pageWidth - margin - 60, finalY + 25);
  
    

      
    
    doc.save('invoice.pdf');
  }}