type mailType = {
    title: string;
    name: string;
    body: string;
    otp: string
}


const standardBody = ({title, name, body, otp}: mailType) => {
  return `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>${title}</title>
    <meta name="description" content=${title} />
    <style type="text/css">
      a.banicoop-mail {
        color: #6922d1;
        text-decoration: none !important;
      }

        p {
        margin-top: 0px;
        margin-bottom: 0px;
      }

      .socials {
        width: max-content;
        margin: 20px auto;
      }
        
      .socials a {
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        line-height: 3.3rem;
        background-color: #6922d1;
        border-radius: 100%;
        text-align: center;
        position: relative;
      }

      .socials a img {
        width: 1.6rem;
      }

      .socials a:last-child img {
        margin-left: 6px;
      }

      .base a {
        color: black;
        padding: 0px 5px;
      }

      .base a:hover {
        color: #6922d1;
      }

      .otp {
        margin: 20px auto;
        width: max-content;
      }      

      .otp span {
        background-color: #892CDC0D;
        padding: 15px 25px;
        margin: auto 2px;
        font-size: 1.8rem;
        border-radius: 2px;
      }

    </style>
  </head>
  <body>
    <div
      style="
        font-family: Helvetica, Arial, sans-serif;
        min-width: 1000px;
        overflow: auto;
        line-height: 2;
      "
    >
      <div
        style="
          margin: 20px auto 0;
          width: 70%;
          padding: 20px 0;
        "
      >
        <div style="margin: 0 auto 10px; text-align: center">
          <img src="https://res.cloudinary.com/daiiyjdvo/image/upload/v1720390793/logo_hpmxyz.png" alt="RisingSun Logo" />
        </div>
        <img style="width: 100%; margin: 20px auto" src="https://res.cloudinary.com/daiiyjdvo/image/upload/v1720390794/flyer_wyngwe.png" alt="RisingSun Flyer" />
        <p style="font-size: 1.5rem; margin: 20px auto">Hi ${name},</p>
        ${body}
        <div class="otp">
          <span>${otp[0]}</span>
          <span>${otp[1]}</span>
          <span>${otp[2]}</span>
          <span>${otp[3]}</span>
        </div>
        <p style="margin: 20px auto">OTP will expire in <b>5 minutes</b></p>
        <p style="margin: 20px auto">
          Best Regards,<br />
          <a class="banicoop-mail" href="mailto:infobanicoop@gmail.com"
            >Banicoop Team</a
          >
        </p>
        <hr style="border: none; border-top: 1px solid #eee; width: 100%" />
        <div class="socials">
          <a
            href="https://www.instagram.com/banicoop_ng?igsh=aGJvZ2IyY3ZncXBr&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            ><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/instagram@2x.png" alt="Banicoop Instagram Handle"
          /></a>

          <a
            href="https://www.facebook.com/profile.php?id=61553631940908&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            ><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/facebook@2x.png" alt="Banicoop Instagram Handle"
          /></a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; width: 100%" />
        <div
          style="
            padding: 8px 0;
            font-size: 0.9rem;
            line-height: 1.3;
            text-align: center;
            font-weight: 400;
          "
        >
          <p>
            &copy; ${new Date().getFullYear()} Banicoop. All rights reserved.
          </p>
          <p style="width: 80%; margin: 20px auto">
            You are receiving this mail because you registered to join the
            Banicoop platform as a user or a merchant. This also shows that you
            agree to our Terms of use and Privacy Policies. If you no longer
            want to receive mails from use, click the unsubscribe link below to
            unsubscribe.
            <p class="base" style="margin: 20px auto; gap: 10px">
              <a 
              href="https://www.banicoopng.com/"
              target="_blank"
              rel="noopener noreferrer">Privacy policy</a>
              <a 
              href="https://www.banicoopng.com/"
              target="_blank"
              rel="noopener noreferrer">Terms of service</a>
              <a 
              href="https://www.banicoopng.com/"
              target="_blank"
              rel="noopener noreferrer">Help center</a>
              <a 
              href="https://banicoop-server-7cas.onrender.com/auth/unsubscribe"
              target="_blank"
              rel="noopener noreferrer">Unsubscribe</a>
              </p>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
