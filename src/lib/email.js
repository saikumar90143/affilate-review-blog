import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendWelcomeEmail = async (email) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Skipping email.");
    return;
  }

  try {
    await resend.emails.send({
      from: 'Elite Reviews <hello@elitereviews.in>',
      to: email,
      subject: 'Elite Reviews | Your Exclusive Intel Access Granted',
      html: `
        <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="color: #3b82f6; font-size: 32px; font-weight: 900; letter-spacing: -2px;">ELITE REVIEWS</h1>
          <p style="font-size: 18px; color: #9ca3af; line-height: 1.6;">Welcome to the inner circle.</p>
          <hr style="border: none; border-top: 1px solid #1f2937; margin: 30px 0;" />
          <p style="font-size: 16px; line-height: 1.6;">
            You have successfully secured access to our proprietary tech archives and weekly market analysis. 
            Expect our first deep-dive report in your inbox within 24 hours.
          </p>
          <div style="margin-top: 40px; padding: 20px; background-color: #111; border: 1px solid #3b82f633; border-radius: 15px;">
             <p style="margin: 0; color: #3b82f6; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Next Step</p>
             <p style="margin-top: 5px; font-size: 14px; color: #fff;">Make sure to whitelist this email so you never miss a field report.</p>
          </div>
          <p style="margin-top: 50px; font-size: 12px; color: #4b5563;">
            Elite Reviews © 2026. All rights reserved.
          </p>
        </div>
      `
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendPriceAlertEmail = async (email, productName, currentPrice, productSlug, alternatives = []) => {
  if (!process.env.RESEND_API_KEY) return;

  const siteUrl = process.env.NEXTAUTH_URL || 'https://elitereviews.com';

  let alternativeHTML = "";
  if (alternatives && alternatives.length > 0) {
    alternativeHTML = `
      <div style="margin-top: 40px; padding: 20px; background-color: #111; border: 1px solid #3b82f633; border-radius: 15px;">
         <p style="margin: 0; color: #a855f7; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 15px;">Elite Intel: Top Alternatives</p>
         <p style="font-size: 14px; color: #9ca3af; margin-bottom: 20px;">Still deciding? Here are the highest-rated competitors in the lab right now:</p>
         ${alternatives.map(alt => `
           <div style="margin-bottom: 15px; border-bottom: 1px solid #1f2937; padding-bottom: 15px;">
             <p style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;">${alt.title}</p>
             <p style="margin: 5px 0 10px 0; font-size: 14px; color: #facc15; font-weight: bold;">Score: ${alt.rating}/5</p>
             <a href="${siteUrl}/reviews/${alt.slug}" style="color: #60a5fa; text-decoration: none; font-size: 14px;">Read Full Review &rarr;</a>
           </div>
         `).join('')}
      </div>
    `;
  }

  try {
    await resend.emails.send({
      from: 'Elite Reviews <hello@elitereviews.in>',
      to: email,
      subject: `Price Drop Alert: ${productName}`,
      html: `
        <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px;">
          <h2 style="color: #3b82f6;">Target Aquired!</h2>
          <p style="font-size: 18px;">The price of <strong>${productName}</strong> has just dropped.</p>
          <p style="font-size: 24px; font-weight: bold; color: #10b981;">New Price: $${currentPrice}</p>
          <p>Don't wait—this target won't stay vulnerable for long.</p>
          <a href="${siteUrl}/reviews/${productSlug}" style="display: inline-block; background-color: #3b82f6; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;">Secure the Deal</a>
          ${alternativeHTML}
        </div>
      `
    });
  } catch (error) {
    console.error("Error sending price alert email:", error);
  }
};
