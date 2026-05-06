import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_PORT === "465" ? true : false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EnquiryEmailParams {
  vendorEmail: string;
  vendorName: string;
  businessName: string;
  celebrantName: string;
  celebrantEmail: string;
  message: string;
  eventType?: string | null;
  eventDate?: string | null;
  dashboardUrl: string;
}

export async function sendEnquiryEmail(p: EnquiryEmailParams) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;

  const eventLine = [
    p.eventType && `Event: ${p.eventType}`,
    p.eventDate && `Date: ${p.eventDate}`,
  ]
    .filter(Boolean)
    .join(" · ");

  await transporter.sendMail({
    from: `"AYEYE" <${process.env.SMTP_USER}>`,
    to: vendorEmail(p.vendorEmail, p.businessName),
    subject: `New enquiry from ${p.celebrantName}`,
    html: buildHtml(p, eventLine),
    text: buildText(p, eventLine),
  });
}

function vendorEmail(email: string, name: string) {
  return `"${name}" <${email}>`;
}

function buildHtml(p: EnquiryEmailParams, eventLine: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#131313;font-family:'Inter',Arial,sans-serif;color:#e5e2e1;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#131313;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr>
          <td style="padding:0 0 32px 0;">
            <span style="font-family:Georgia,serif;font-size:28px;color:#f2ca50;letter-spacing:-0.02em;">AYEYE</span>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="height:1px;background:rgba(242,202,80,0.2);margin-bottom:32px;"></td></tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 0 0 0;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#f2ca50;">New Enquiry</p>
            <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:32px;font-weight:400;color:#e5e2e1;line-height:1.15;">
              ${p.celebrantName} wants to work with you
            </h1>

            <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(208,197,175,0.5);">From</p>
            <p style="margin:0 0 24px;font-size:15px;color:#e5e2e1;">${p.celebrantName} &middot; <span style="color:rgba(208,197,175,0.7);">${p.celebrantEmail}</span></p>

            ${eventLine ? `
            <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(208,197,175,0.5);">Event Details</p>
            <p style="margin:0 0 24px;font-size:15px;color:#e5e2e1;">${eventLine}</p>
            ` : ""}

            <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(208,197,175,0.5);">Message</p>
            <div style="margin:0 0 32px;padding:20px 24px;background:#1c1b1b;border-left:2px solid #f2ca50;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(229,226,225,0.9);">${p.message.replace(/\n/g, "<br>")}</p>
            </div>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0"><tr><td>
              <a href="${p.dashboardUrl}"
                style="display:inline-block;padding:14px 32px;background:#f2ca50;color:#3c2f00;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">
                View in Dashboard
              </a>
            </td></tr></table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:40px 0 0 0;border-top:1px solid rgba(77,70,53,0.4);margin-top:40px;">
            <p style="margin:0;font-size:11px;color:rgba(208,197,175,0.35);letter-spacing:0.1em;">
              AYEYE &middot; The Art of Celebration &middot; You are receiving this because you are a registered vendor.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildText(p: EnquiryEmailParams, eventLine: string) {
  return [
    "AYEYE — New Enquiry",
    "",
    `From: ${p.celebrantName} (${p.celebrantEmail})`,
    ...(eventLine ? [eventLine] : []),
    "",
    "Message:",
    p.message,
    "",
    `View in your dashboard: ${p.dashboardUrl}`,
  ].join("\n");
}

interface ReplyEmailParams {
  celebrantEmail: string;
  celebrantName: string;
  businessName: string;
  originalMessage: string;
  reply: string;
  dashboardUrl: string;
}

export async function sendReplyEmail(p: ReplyEmailParams) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"AYEYE" <${process.env.SMTP_USER}>`,
    to: p.celebrantEmail,
    subject: `${p.businessName} replied to your enquiry`,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#131313;font-family:'Inter',Arial,sans-serif;color:#e5e2e1;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#131313;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding:0 0 32px 0;">
          <span style="font-family:Georgia,serif;font-size:28px;color:#f2ca50;letter-spacing:-0.02em;">AYEYE</span>
        </td></tr>
        <tr><td style="height:1px;background:rgba(242,202,80,0.2);"></td></tr>
        <tr><td style="padding:32px 0 0 0;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#f2ca50;">Vendor Reply</p>
          <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:32px;font-weight:400;color:#e5e2e1;line-height:1.15;">
            ${p.businessName} has replied
          </h1>
          <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(208,197,175,0.5);">Their Reply</p>
          <div style="margin:0 0 24px;padding:20px 24px;background:#1c1b1b;border-left:2px solid #f2ca50;">
            <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(229,226,225,0.9);">${p.reply.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(208,197,175,0.5);">Your Original Message</p>
          <p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:rgba(208,197,175,0.5);">${p.originalMessage.replace(/\n/g, "<br>")}</p>
          <table cellpadding="0" cellspacing="0"><tr><td>
            <a href="${p.dashboardUrl}" style="display:inline-block;padding:14px 32px;background:#f2ca50;color:#3c2f00;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">
              View Enquiry
            </a>
          </td></tr></table>
        </td></tr>
        <tr><td style="padding:40px 0 0 0;border-top:1px solid rgba(77,70,53,0.4);margin-top:40px;">
          <p style="margin:0;font-size:11px;color:rgba(208,197,175,0.35);letter-spacing:0.1em;">
            AYEYE &middot; The Art of Celebration
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    text: `${p.businessName} replied to your enquiry on AYEYE.\n\nReply:\n${p.reply}\n\nYour original message:\n${p.originalMessage}\n\nView your enquiries: ${p.dashboardUrl}`,
  });
}
