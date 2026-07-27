const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

const money = (n, currency = 'PKR') => `${currency} ${Number(n).toLocaleString()}`;

const baseLayout = (title, bodyHtml) => `
  <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #F7F5F0;">
    <div style="background: #1B4332; padding: 24px 32px;">
      <span style="color:#F7F5F0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">GULLY CRICKET</span>
    </div>
    <div style="padding: 32px; background: #ffffff;">
      <h2 style="color:#1B4332; margin-top:0;">${title}</h2>
      ${bodyHtml}
    </div>
    <div style="padding: 20px 32px; color: #888; font-size: 12px;">
      GULLY Cricket &middot; Premium Cricket Equipment &middot; Pakistan &amp; Worldwide
    </div>
  </div>
`;

const send = async (to, subject, html) => {
  // If email credentials are not configured, log instead of throwing — keeps checkout flow functional in dev.
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log(`[email:mock] To: ${to} | Subject: ${subject}`);
    return { mocked: true };
  }
  const transporter = createTransporter();
  return transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

const sendOrderConfirmationEmail = async (order) => {
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;">${i.name} × ${i.quantity}</td><td style="text-align:right;">${money(
          i.lineTotal,
          order.pricing.currency
        )}</td></tr>`
    )
    .join('');

  const html = baseLayout(
    'Order Confirmed',
    `
    <p>Hi ${order.customer.fullName},</p>
    <p>Thanks for your order! We've received it and will begin processing shortly.</p>
    <p><strong>Order #${order.orderNumber}</strong></p>
    <table style="width:100%; border-collapse:collapse; margin: 16px 0;">${itemsHtml}</table>
    <table style="width:100%; margin-top: 12px; border-top: 1px solid #eee; padding-top: 8px;">
      <tr><td>Subtotal</td><td style="text-align:right;">${money(order.pricing.subtotal, order.pricing.currency)}</td></tr>
      <tr><td>Shipping (${order.shippingMethod.name})</td><td style="text-align:right;">${money(order.pricing.shippingCost, order.pricing.currency)}</td></tr>
      <tr><td><strong>Total</strong></td><td style="text-align:right;"><strong>${money(order.pricing.total, order.pricing.currency)}</strong></td></tr>
    </table>
    <p>Shipping to: ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
    <p>Payment method: ${order.paymentMethod.toUpperCase()}</p>
  `
  );
  return send(order.customer.email, `Order Confirmed - #${order.orderNumber}`, html);
};

const sendAdminNewOrderEmail = async (order) => {
  const html = baseLayout(
    'New Order Received',
    `<p>A new order <strong>#${order.orderNumber}</strong> was placed by ${order.customer.fullName} (${order.customer.email}).</p>
     <p>Total: ${money(order.pricing.total, order.pricing.currency)} &middot; Payment: ${order.paymentMethod}</p>
     <p>${order.isInternationalOrder ? 'International order' : 'Local (Pakistan) order'} — ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>`
  );
  return send(process.env.ADMIN_EMAIL, `New Order #${order.orderNumber}`, html);
};

const sendOrderStatusUpdateEmail = async (order) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and will be processed shortly.',
    processing: 'Your order is now being prepared for shipment.',
    shipped: 'Your order is on its way!',
    delivered: 'Your order has been delivered. We hope you enjoy your gear!',
    cancelled: 'Your order has been cancelled.',
  };
  const html = baseLayout(
    `Order Update: ${order.status.toUpperCase()}`,
    `<p>Hi ${order.customer.fullName},</p>
     <p>${statusMessages[order.status] || 'Your order status has been updated.'}</p>
     <p><strong>Order #${order.orderNumber}</strong> — Status: <strong>${order.status}</strong></p>`
  );
  return send(order.customer.email, `Order #${order.orderNumber} - ${order.status}`, html);
};

module.exports = { sendOrderConfirmationEmail, sendAdminNewOrderEmail, sendOrderStatusUpdateEmail };
