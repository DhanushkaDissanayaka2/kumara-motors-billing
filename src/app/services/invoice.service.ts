import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private currentInvoice = new BehaviorSubject<Invoice | null>(null);
  currentInvoice$ = this.currentInvoice.asObservable();

  constructor() {}

  generateInvoiceNumber(): string {
    return 'INV-' + Date.now();
  }

  calculateTotals(invoice: Invoice): Invoice {
    invoice.subtotal = invoice.products.reduce((sum, product) => {
      product.total = product.quantity * product.price;
      return sum + product.total;
    }, 0);
    
    invoice.tax = invoice.subtotal * 0.00; // 0.01% tax
   
    
    return invoice;
  }

  setCurrentInvoice(invoice: Invoice) {
    this.currentInvoice.next(invoice);
  }
}