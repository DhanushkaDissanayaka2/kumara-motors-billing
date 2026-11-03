import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice, Customer, Product } from '../models/invoice.model';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-form',
  
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  
    <div class="container">
      <div class="card">
      <!-- Company Logo -->
    <img src="assets/LOGOs-min.png" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;" />
  
        <h2>New Invoice</h2>
        
        <!-- Customer Details -->
        <div class="form-group">
          <h3>Customer Information</h3>
          <input
            type="text"
            class="form-control"
            [(ngModel)]="customer.name"
            placeholder="Customer Name"

          />

 
          <input
            type="email"
            class="form-control"
            [(ngModel)]="customer.email"
            placeholder="Customer Email"
          />
          <textarea
            class="form-control"
            [(ngModel)]="customer.address"
            placeholder="Customer Address"
          ></textarea>
        </div>

        <!-- Products -->
        <div class="form-group">
          <h3>Products</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products; let i = index">
                <td>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="product.name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control"
                    [(ngModel)]="product.quantity"
                    (change)="calculateProductTotal(i)"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control"
                    [(ngModel)]="product.price"
                    (change)="calculateProductTotal(i)"
                  />
                </td>
                <td>{{ product.total | number:'1.2-2' }}</td>
                <td>
                  <button class="btn btn-secondary" (click)="removeProduct(i)">
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" (click)="addProduct()">
            Add Product
          </button>
        </div>

        <!-- Totals -->
        <div class="text-right">
          <p>Subtotal: {{ subtotal | number:'1.2-2' }}</p>
          <p>Tax (0.0%): {{ tax | number:'1.2-2' }}</p>
          <p><strong>Total: {{ total | number:'1.2-2' }}</strong></p>
        </div>

        <button class="btn btn-primary" (click)="generateInvoice()">
          Generate Invoice
        </button>
      </div>
    </div>
  `
})
export class InvoiceFormComponent {
  
  customer: Customer = {
    name: '',
    address: '',
    email: ''
  };

  products: Product[] = [];
  subtotal = 0;
  tax = 0;
  total = 0;

  constructor(private invoiceService: InvoiceService) {
    this.addProduct();
  }

  addProduct() {
    this.products.push({
      name: '',
      quantity: 1,
      price: 0,
      total: 0
    });
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.calculateTotals();
  }

  calculateProductTotal(index: number) {
    const product = this.products[index];
    product.total = product.quantity * product.price;
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.products.reduce((sum, product) => sum + product.total, 0);
    this.tax = this.subtotal * 0.0;
    this.total = this.subtotal + this.tax;
  }

  generateInvoice() {
    const invoice: Invoice = {
      invoiceNumber: this.invoiceService.generateInvoiceNumber(),
      date: new Date(),
      customer: this.customer,
      products: this.products,
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total
    };

    this.invoiceService.setCurrentInvoice(invoice);
  }
}