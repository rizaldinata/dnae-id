import { NextResponse } from 'next/server';

const FONNTE_API_URL = 'https://api.fonnte.com/send';

async function sendToFonnte(target, message, token) {
  const res = await fetch(FONNTE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ target, message }),
  });

  const data = await res.json();
  return { success: data.status === true || data.success === true, data };
}

function formatOrderMessage(order) {
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

  return `*HALO GABIN BAR! SAYA MAU PESAN* 🍪🔥
----------------------------------
*Kode Pesanan:* #${order.orderCode}
*Tanggal:* ${formattedDate}

*Rincian Pesanan:*
${itemsText}

----------------------------------
*Total Bayar:* *Rp ${order.totalPrice.toLocaleString('id-ID')}*

*Data Pemesan:*
👤 *Nama:* ${order.customerName}
📞 *No HP/WA:* +${order.customerPhone}
📍 *Metode Ambil:* ${order.orderType === 'delivery' ? 'Dikirim' : 'Ambil di Toko'}
💳 *Bayar:* ${order.paymentMethod === 'qris' ? 'QRIS' : 'COD (Bayar di Tempat)'}
${order.address ? `🏠 *Alamat:* ${order.address}` : ''}
${order.notes ? `📝 *Catatan Tambahan:* ${order.notes}` : ''}

Mohon konfirmasi pesanan ya min. Terima kasih! 🙏`;
}

export async function POST(request) {
  try {
    const { order } = await request.json();

    const token = process.env.FONNTE_API_TOKEN;
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    const groupId = process.env.FONNTE_GROUP_ID;

    if (!token) {
      return NextResponse.json(
        { error: 'FONNTE_API_TOKEN tidak dikonfigurasi' },
        { status: 500 }
      );
    }

    if (!order || !order.orderCode) {
      return NextResponse.json(
        { error: 'Data pesanan tidak valid' },
        { status: 400 }
      );
    }

    const message = formatOrderMessage(order);

    const targets = [];
    if (adminNumber) targets.push({ target: adminNumber, label: 'admin' });
    if (groupId) targets.push({ target: groupId, label: 'group' });

    if (targets.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada target WhatsApp yang dikonfigurasi' },
        { status: 500 }
      );
    }

    const results = await Promise.allSettled(
      targets.map((t) => sendToFonnte(t.target, message, token))
    );

    const sent = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    );
    const failed = results.filter(
      (r) => r.status === 'rejected' || !r.value?.success
    );

    return NextResponse.json({
      success: sent.length > 0,
      message: `Terkirim ke ${sent.length}/${targets.length} target`,
      details: results.map((r, i) => ({
        target: targets[i].label,
        success: r.status === 'fulfilled' && r.value?.success,
      })),
    });
  } catch (error) {
    console.error('Fonnte send-order error:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim notifikasi' },
      { status: 500 }
    );
  }
}
