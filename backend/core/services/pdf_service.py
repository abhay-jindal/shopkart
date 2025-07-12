from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from io import BytesIO
import datetime
from decimal import Decimal

class InvoicePDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom styles for the invoice"""
        # Main title style
        self.styles.add(ParagraphStyle(
            name='MainTitle',
            parent=self.styles['Heading1'],
            fontSize=28,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1f2937'),
            fontName='Helvetica-Bold'
        ))
        
        # Company info style
        self.styles.add(ParagraphStyle(
            name='CompanyInfo',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=3,
            alignment=TA_LEFT,
            textColor=colors.HexColor('#6b7280'),
            fontName='Helvetica'
        ))
        
        # Section title style
        self.styles.add(ParagraphStyle(
            name='SectionTitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.HexColor('#1f2937'),
            fontName='Helvetica-Bold'
        ))
        
        # Invoice info style
        self.styles.add(ParagraphStyle(
            name='InvoiceInfo',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_RIGHT,
            textColor=colors.HexColor('#374151'),
            fontName='Helvetica'
        ))
        
        # Customer info style
        self.styles.add(ParagraphStyle(
            name='CustomerInfo',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=4,
            alignment=TA_LEFT,
            textColor=colors.HexColor('#374151'),
            fontName='Helvetica'
        ))
        
        # Terms style
        self.styles.add(ParagraphStyle(
            name='Terms',
            parent=self.styles['Normal'],
            fontSize=9,
            spaceAfter=4,
            alignment=TA_JUSTIFY,
            textColor=colors.HexColor('#6b7280'),
            fontName='Helvetica'
        ))

    def generate_invoice_pdf(self, order, order_items, user, shipping_address, payment):
        """Generate professional invoice PDF for an order"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4, 
            rightMargin=1*cm, 
            leftMargin=1*cm, 
            topMargin=1.5*cm, 
            bottomMargin=1.5*cm
        )
        
        story = []
        
        # Add professional header with logo placeholder
        story.extend(self._create_professional_header())
        story.append(Spacer(1, 30))
        
        # Add invoice and order information
        story.extend(self._create_invoice_info_section(order))
        story.append(Spacer(1, 25))
        
        # Add customer and shipping information
        story.extend(self._create_customer_section(user, shipping_address))
        story.append(Spacer(1, 25))
        
        # Add items table with professional styling
        story.extend(self._create_professional_items_table(order_items))
        story.append(Spacer(1, 25))
        
        # Add payment information
        story.extend(self._create_payment_section(payment))
        story.append(Spacer(1, 25))
        
        # Add professional footer
        story.extend(self._create_footer())
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer

    def _create_professional_header(self):
        """Create professional header with logo and company info"""
        elements = []
        
        # Create a table for the header layout
        header_data = [
            [
                # Left side - Company info
                Paragraph("""
                    <para align="left">
                        <b><font size="24" color="#1f2937">SHOPKART</font></b><br/>
                        <font size="10" color="#6b7280">Premium E-commerce Platform</font><br/>
                        <font size="9" color="#9ca3af">123 Business Street, Mumbai, Maharashtra 400001</font><br/>
                        <font size="9" color="#9ca3af">Phone: +91-22-12345678 | Email: support@shopkart.com</font><br/>
                        <font size="9" color="#9ca3af">Website: www.shopkart.com | GST: 27ABCDE1234F1Z5</font>
                    </para>
                """, self.styles['Normal']),
                
                # Right side - Invoice title
                # Paragraph("""
                #     <para align="right">
                #         <b><font size="20" color="#1f2937">INVOICE</font></b><br/>
                #         <font size="10" color="#6b7280">Professional Invoice</font>
                #     </para>
                # """, self.styles['Normal'])
            ]
        ]
        
        header_table = Table(header_data, colWidths=[4*inch, 2*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        elements.append(header_table)
        return elements

    def _create_invoice_info_section(self, order):
        """Create professional invoice information section"""
        elements = []
        
        # Create a table for invoice details
        invoice_data = [
            [
                # Left column - Invoice details
                Paragraph(f"""
                    <para align="left">
                        <b><font size="11" color="#1f2937">Invoice Details</font></b><br/>
                        <font size="10" color="#374151">Invoice Number: <b>INV-{order.id:06d}</b></font><br/>
                        <font size="10" color="#374151">Invoice Date: {order.created_at.strftime('%B %d, %Y')}</font><br/>
                        <font size="10" color="#374151">Due Date: {order.created_at.strftime('%B %d, %Y')}</font>
                    </para>
                """, self.styles['Normal']),
                
                # Right column - Order details
                Paragraph(f"""
                    <para align="right">
                        <b><font size="11" color="#1f2937">Order Details</font></b><br/>
                        <font size="10" color="#374151">Order Number: <b>ORD-{order.id:06d}</b></font><br/>
                        <font size="10" color="#374151">Order Date: {order.created_at.strftime('%B %d, %Y')}</font><br/>
                        <font size="10" color="#374151">Status: <b>{order.order_status.value.title()}</b></font>
                    </para>
                """, self.styles['Normal'])
            ]
        ]
        
        invoice_table = Table(invoice_data, colWidths=[3*inch, 3*inch])
        invoice_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        elements.append(invoice_table)
        return elements

    def _create_customer_section(self, user, shipping_address):
        """Create professional customer and shipping information"""
        elements = []
        
        # Create a table for customer and shipping info
        customer_data = [
            [
                # Left column - Customer info
                Paragraph(f"""
                    <para align="left">
                        <b><font size="11" color="#1f2937">Bill To</font></b><br/>
                        <font size="10" color="#374151">{user.name}</font><br/>
                        <font size="10" color="#6b7280">{user.email}</font><br/>
                        <font size="10" color="#6b7280">{user.phone or 'N/A'}</font>
                    </para>
                """, self.styles['Normal']),
                
                # Right column - Shipping info
                Paragraph(f"""
                    <para align="right">
                        <b><font size="11" color="#1f2937">Ship To</font></b><br/>
                        <font size="10" color="#374151">{shipping_address.alias}</font><br/>
                        <font size="10" color="#6b7280">{shipping_address.address_line1}</font><br/>
                        <font size="10" color="#6b7280">{shipping_address.city}, {shipping_address.state} - {shipping_address.zip_code}</font>
                    </para>
                """, self.styles['Normal'])
            ]
        ]
        
        customer_table = Table(customer_data, colWidths=[3*inch, 3*inch])
        customer_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        elements.append(customer_table)
        return elements

    def _create_professional_items_table(self, order_items):
        """Create professional items table with better styling"""
        elements = []
        
        # Table headers with professional styling
        headers = ['Item', 'Product', 'Size', 'Color', 'Qty', 'Unit Price', 'Total']
        
        # Table data
        table_data = [headers]
        subtotal = Decimal('0.00')
        
        for item in order_items:
            # Get product and variant information
            product = item.variant.product
            variant = item.variant
            
            row = [
                f'#{item.id}',
                product.name,
                variant.size or 'N/A',
                variant.color or 'N/A',
                str(item.quantity),
                f'{item.unit_price:.2f}',
                f'{(item.quantity * item.unit_price):.2f}'
            ]
            table_data.append(row)
            subtotal += item.quantity * item.unit_price
        
        # Add summary rows
        shipping_fee = Decimal('20.00')
        total = subtotal + shipping_fee
        
        # Add empty row for spacing
        table_data.append(['', '', '', '', '', '', ''])
        
        # Add subtotal
        table_data.append(['', '', '', '', '', 'Subtotal:', f'{subtotal:.2f}'])
        
        # Add shipping fee
        table_data.append(['', '', '', '', '', 'Shipping Fee:', f'{shipping_fee:.2f}'])
        
        # Add total with emphasis
        table_data.append(['', '', '', '', '', 'Total:', f'{total:.2f}'])

        # Create table with professional styling
        items_table = Table(table_data, colWidths=[0.6*inch, 2*inch, 0.8*inch, 0.8*inch, 0.5*inch, 0.8*inch, 0.8*inch])
        items_table.setStyle(TableStyle([
            # Header styling
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('TOPPADDING', (0, 0), (-1, 0), 8),
            
            # Data rows styling
            ('FONTNAME', (0, 1), (-1, -4), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -4), 9),
            ('ALIGN', (0, 1), (-1, -4), 'CENTER'),
            ('ALIGN', (1, 1), (1, -4), 'LEFT'),
            ('ALIGN', (4, 1), (4, -4), 'CENTER'),
            ('ALIGN', (5, 1), (6, -4), 'RIGHT'),
            ('BOTTOMPADDING', (0, 1), (-1, -4), 6),
            ('TOPPADDING', (0, 1), (-1, -4), 6),
            
            # Summary rows styling
            ('FONTNAME', (5, -3), (6, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (5, -3), (6, -1), 10),
            ('ALIGN', (5, -3), (6, -1), 'RIGHT'),
            ('TEXTCOLOR', (5, -1), (6, -1), colors.HexColor('#dc2626')),
            ('FONTSIZE', (5, -1), (6, -1), 12),
            
            # Grid styling
            ('GRID', (0, 0), (-1, -4), 0.5, colors.HexColor('#e5e7eb')),
            ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#d1d5db')),
            ('LINEBELOW', (5, -4), (6, -4), 1, colors.HexColor('#d1d5db')),
            
            # Alternating row colors
            ('BACKGROUND', (0, 1), (-1, -4), colors.HexColor('#ffffff')),
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#f9fafb')),
            ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#f9fafb')),
            ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#f9fafb')),
        ]))
        
        elements.append(items_table)
        return elements

    def _create_payment_section(self, payment):
        """Create professional payment information section"""
        elements = []
        
        # Add section title
        elements.append(Paragraph("Payment Information", self.styles['SectionTitle']))
        
        # Create payment info table
        payment_data = [
            [
                Paragraph("Payment Method", self.styles['Normal']),
                Paragraph(payment.payment_method or 'N/A', self.styles['Normal'])
            ],
            [
                Paragraph("Transaction ID", self.styles['Normal']),
                Paragraph(str(payment.transaction_id) or 'N/A', self.styles['Normal'])
            ],
            [
                Paragraph("Payment Status", self.styles['Normal']),
                Paragraph(payment.status.title(), self.styles['Normal'])
            ],
            [
                Paragraph("Payment Date", self.styles['Normal']),
                Paragraph(payment.paid_at.strftime('%B %d, %Y') if payment.paid_at else 'N/A', self.styles['Normal'])
            ],
            [
                Paragraph("Amount Paid", self.styles['Normal']),
                Paragraph(f'{payment.amount:.2f}', self.styles['Normal'])
            ],
            [
                Paragraph("Currency", self.styles['Normal']),
                Paragraph(payment.currency or 'INR', self.styles['Normal'])
            ]
        ]
        
        payment_table = Table(payment_data, colWidths=[2*inch, 3*inch])
        payment_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
        ]))
        
        elements.append(payment_table)
        return elements

    def _create_footer(self):
        """Create professional footer with terms and conditions"""
        elements = []
        
        # Add terms and conditions
        elements.append(Paragraph("Terms and Conditions", self.styles['SectionTitle']))
        
        terms_text = """
        <para align="justify">
            <font size="9" color="#6b7280">
                1. This invoice is computer generated and does not require a signature.<br/>
                2. Payment is due upon receipt of this invoice.<br/>
                3. All prices are in Indian Rupees (INR) and include applicable taxes.<br/>
                4. Returns and exchanges are subject to our return policy within 30 days.<br/>
                5. For any queries, please contact our customer support at support@shopkart.com.<br/>
                6. Thank you for shopping with ShopKart! We appreciate your business.
            </font>
        </para>
        """
        
        elements.append(Paragraph(terms_text, self.styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Add footer note
        footer_text = """
        <para align="center">
            <font size="8" color="#9ca3af">
                This is a computer generated invoice. No signature required.<br/>
                ShopKart - Premium E-commerce Platform | www.shopkart.com
            </font>
        </para>
        """
        
        elements.append(Paragraph(footer_text, self.styles['Normal']))
        
        return elements 