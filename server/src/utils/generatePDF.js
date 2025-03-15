import fs from "fs";
import path from "path";
import PdfPrinter from "pdfmake";

const receiptsPath = path.resolve("./receipts");
if (!fs.existsSync(receiptsPath)) {
  fs.mkdirSync(receiptsPath, { recursive: true });
}
const fonts = {
  Roboto: {
    normal: path.join("./src/fonts/Roboto-Regular.ttf"),
    bold: path.join("./src/fonts/Roboto-Bold.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

const generateReceipt = async (booking) => {
  return new Promise((resolve, reject) => {
    const filePath = `./receipts/receipt_${booking._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    // Load Staysphere Logo
    const logoPath = path.join("./src/assets/logos", "stayspherelogo3.png");
    const logoExists = fs.existsSync(logoPath);

    const upiPaymentLink = `upi://pay?pa=upi@razorpay&pn=${booking.user.email}&am=${booking.price}&cu=INR&tn=Staysphere%20Booking`;

    // Define PDF structure
    const docDefinition = {
      content: [
        //Header Section
        {
          columns: [
            logoExists ? { image: logoPath, width: 100, height: 90 } : {},
            // { text: "Staysphere", fontSize: 22, bold: true, alignment: "left" },
            {
              text: "Staysphere Booking Receipt",
              fontSize: 22,
              bold: true,
              alignment: "center",
              color: "#e67e22",
            },
            // logoExists ? { image: logoPath, width: 100, height: 90 } : {},
          ],
          margin: [5, 15, 0, 10],
        },
        {
          text: `📌 Booking ID: ${booking._id}`,
          fontSize: 12,
          bold: true,
          margin: [0, 10],
        },

        // 🔹 Booking Details
        {
          style: "tableStyle",
          table: {
            widths: ["30%", "70%"],
            body: [
              ["👤 User Name", booking.user.name ?? "N/A"],
              ["👤 User Email", booking.user.email ?? "N/A"],
              ["👤 Host ", booking.updatedPlace.host?.name ?? "N/A"],
              ["🏠 Place Name", booking.updatedPlace.placeName || "N/A"],
              ["📅 Check-in", new Date(booking.checkIn).toDateString()],
              ["📅 Check-out", new Date(booking.checkOut).toDateString()],
            ],
          },
        },

        // 🔹 Order Summary
        { text: "Order Summary", style: "sectionHeader" },
        {
          style: "tableStyle",
          table: {
            widths: ["60%", "40%"],
            body: [
              ["Nightly Rate", `₹ ${booking.price.toFixed(2)}`],
              ["Taxes & Fees (5%)", `₹ ${(booking.price * 0.05).toFixed(2)}`],
              [
                { text: "Total Payable Amount", bold: true },
                { text: `₹ ${(booking.price * 1.05).toFixed(2)}`, bold: true },
              ],
            ],
          },
        },

        // 🔹 Payment Details
        { text: "Payment Details", style: "sectionHeader" },
        {
          style: "tableStyle",
          table: {
            widths: ["30%", "70%"],
            body: [
              ["💳 Payment Method", "Razorpay UPI"],
              ...(booking.paymentId
                ? [["🆔 Payment ID", booking.paymentId]]
                : []),
            ],
          },
        },

        // 🔹 Add QR Code for Payment (Optional: Show Only If Needed)
        {
          text: "Scan to Pay",
          style: "sectionHeader",
          alignment: "center",
          color: "#e67e22",
          margin: [0, 20],
        },
        {
          qr: upiPaymentLink,
          fit: 100,
          alignment: "center",
        },

        {
          text: "Thank you for booking with Staysphere!",
          style: "footer",
          color: "#e67e22",
        },
        {
          text: "For any inquiries, contact support@staysphere.com",
          style: "footer",
          color: "#e67e22",
        },
        {
          columns: [
            { text: "Staysphere", style: "footer" },
            logoExists
              ? {
                  image: logoPath,
                  width: 50,
                  alignment: "right",
                }
              : {},
          ],
        },
      ],

      styles: {
        tableStyle: {
          margin: [0, 10, 0, 10],
          fontSize: 12,
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        footer: {
          fontSize: 10,
          alignment: "left center",
          margin: [0, 20, 0, 0],
          color: "#555",
        },
      },
    };

    // Create PDF
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(stream);
    pdfDoc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};

export default generateReceipt;
