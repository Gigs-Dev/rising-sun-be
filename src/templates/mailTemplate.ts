const standardBody = (title: string, name: string, body: string, otp: string) => {
  const otpDigits = otp.split("").map((digit) => `<span>${digit}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${title}" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f8f8f8;
        font-family: Arial, Helvetica, sans-serif;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      }

      .logo {
        display: block;
        margin: 0 auto 20px;
        max-width: 180px;
      }

      .banner {
        width: 100%;
        border-radius: 6px;
        margin-bottom: 20px;
      }

      h2 {
        color: #333333;
        text-align: center;
        margin-bottom: 10px;
      }

      p {
        color: #444444;
        font-size: 15px;
        line-height: 1.6;
      }

      .otp {
        display: flex;
        justify-content: center;
        margin: 20px auto;
      }

      .otp span {
        display: inline-block;
        background-color: #892cdc0d;
        padding: 15px 20px;
        margin: 0 5px;
        font-size: 1.6rem;
        font-weight: bold;
        border-radius: 4px;
        color: #333333;
        border: 1px solid #ddd;
      }

      .socials {
        text-align: center;
        margin: 25px 0;
      }

      .socials a {
        display: inline-block;
        width: 36px;
        height: 36px;
        margin: 0 5px;
        background-color: #6922d1;
        border-radius: 50%;
        text-align: center;
        line-height: 36px;
      }

      .socials img {
        width: 18px;
        height: 18px;
        vertical-align: middle;
      }

      .footer {
        font-size: 12px;
        text-align: center;
        color: #888888;
        margin-top: 20px;
        line-height: 1.4;
      }

      .footer a {
        color: #6922d1;
        text-decoration: none;
        margin: 0 5px;
      }

      .banicoop-mail {
        color: #6922d1;
        text-decoration: none;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img class="logo" src="https://res.cloudinary.com/daiiyjdvo/image/upload/v1720390793/logo_hpmxyz.png" alt="Banicoop Logo" />
      <img class="banner" src="https://res.cloudinary.com/daiiyjdvo/image/upload/v1720390794/flyer_wyngwe.png" alt="Banicoop Flyer" />

      <p>Hi ${name},</p>
      ${body}

      <div class="otp">
        ${otpDigits}
      </div>

      <p style="text-align:center;">OTP will expire in <b>5 minutes</b>.</p>

      <p>Best Regards,<br>
        <a class="banicoop-mail" href="mailto:infobanicoop@gmail.com">Rising Sun Inc</a>
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />

      <div class="socials">
        <a href="https://www.instagram.com/banicoop_ng?igsh=aGJvZ2IyY3ZncXBr&utm_source=qr" target="_blank" rel="noopener noreferrer">
          <img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/instagram@2x.png" alt="Instagram" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61553631940908&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
          <img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/facebook@2x.png" alt="Facebook" />
        </a>
      </div>

      <div class="footer">
        &copy; ${new Date().getFullYear()} Banicoop. All rights reserved.<br>
        You are receiving this mail because you registered on Banicoop. If this wasn't you, you can
        <a href="https://banicoop-server-7cas.onrender.com/auth/unsubscribe" target="_blank" rel="noopener noreferrer">unsubscribe</a> anytime.
        <br><br>
        <a href="https://www.banicoopng.com/" target="_blank" rel="noopener noreferrer">Privacy Policy</a> |
        <a href="https://www.banicoopng.com/" target="_blank" rel="noopener noreferrer">Terms of Service</a> |
        <a href="https://www.banicoopng.com/" target="_blank" rel="noopener noreferrer">Help Center</a>
      </div>
    </div>
  </body>
</html>`;
};

export const sendRegistrationOTP = (email: string, otp: string) => {
  return standardBody(
    "OTP Verification Mail",
    email,
    `<p>Please use the OTP below to verify your email address for Rising Sun Account:</p>`,
    otp
  );
};
