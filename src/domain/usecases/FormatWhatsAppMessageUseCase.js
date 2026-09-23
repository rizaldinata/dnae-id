export class FormatWhatsAppMessageUseCase {
  constructor(whatsappNumber = '6281234567890') {
    this.whatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
  }

  execute(order) {
    const formattedDate = new Date(order.createdAt).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const itemsText = order.items
      .map(
        (item) =>
          `• *${item.name}* x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
      )
      .join('\n');

    const message = `*HALO GABIN BAR! SAYA MAU PESAN* 🍪🔥
----------------------------------
*Kode Pesanan:* #${order.orderCode}
*Tanggal:* ${formattedDate}

*Rincian Pesanan:*
${itemsText}

----------------------------------
*Total Bayar:* *Rp ${order.totalPrice.toLocaleString('id-ID')}*

*Data Pemesan:*
👤 *Nama:* ${order.customerName}
📞 *No HP/WA:* ${order.customerPhone}
📍 *Metode Ambil:* ${order.orderType === 'delivery' ? 'Dikirim' : 'Ambil di Toko'}
💳 *Bayar:* ${order.paymentMethod === 'qris' ? 'QRIS' : 'COD'}
${order.address ? `🏠 *Alamat:* ${order.address}` : ''}
${order.notes ? `📝 *Catatan Tambahan:* ${order.notes}` : ''}

Mohon konfirmasi pesanan dan metode pembayarannya ya min. Terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;

    return {
      messageText: message,
      whatsappUrl,
    };
  }
}
