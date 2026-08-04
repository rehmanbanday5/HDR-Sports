const nodemailer = require("nodemailer");

const getTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

exports.sendAdminNewOrderEmail = async (order) => {
  const transporter = getTransporter();

  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.attributes ? JSON.stringify(item.attributes) : "-"}</td>
      <td>${item.quantity}</td>
      <td>Rs. ${item.unitPrice}</td>
    </tr>
  `,
    )
    .join("");

  const html = `
  <h2>New HDR Sports Order Received</h2>

  <h3>Customer Details</h3>
  <p><b>Name:</b> ${order.customer.fullName}</p>
  <p><b>Email:</b> ${order.customer.email}</p>
  <p><b>Phone:</b> ${order.customer.phone}</p>

  <h3>Address</h3>
  <p>
  ${order.shippingAddress.addressLine1}<br/>
  ${order.shippingAddress.city}<br/>
  ${order.shippingAddress.country}
  </p>

  <h3>Products</h3>

  <table border="1" cellpadding="8">
    <tr>
      <th>Product</th>
      <th>Size/Variant</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>

    ${itemsHTML}

  </table>

  <h3>Payment</h3>
  <p><b>Method:</b> ${order.paymentMethod}</p>
  <p><b>Total:</b> Rs. ${order.pricing.total}</p>

 

  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "rehmanbanday5@gmail.com",
    subject: `New HDR Sports Order - ${order.orderNumber}`,
    html,
  });
};

exports.sendOrderStatusUpdateEmail = async (order) => {
  const transporter = getTransporter();

  const html = `
    <h2>HDR Sports Order Update</h2>

    <p>Your order status has been updated.</p>

    <h3>Order Details</h3>

    <p><b>Order Number:</b> ${order.orderNumber}</p>

    <p><b>New Status:</b> ${order.status}</p>

    <p><b>Total:</b> Rs. ${order.pricing.total}</p>

    <p>
      Thank you for shopping with HDR Sports.
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: order.customer.email,
    subject: `HDR Sports Order Status Update - ${order.orderNumber}`,
    html,
  });
};