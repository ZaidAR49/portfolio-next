
export const emailBodyTouser = (name: string, portfolioUrl: string) => `<div style="max-width:600px; margin:auto; font-family:Arial, sans-serif; background-color:#000; color:#fff; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.5);">
  <h2 style="color:#eee;">We've Received Your Message</h2>

  <hr style="border: 1px solid #333; margin:20px 0;" />

  <div style="background:#111; padding:15px; border-radius:8px;">
    <h3 style="color:#eee;">Dear ${name}</h3>
    <p style="color:#eee;">Thank you for reaching out! We have received your message and will get back to you shortly.</p>

    <p style="color:#eee;">Best regards,<br />Zaid Radaideh</p>
       <a href="${portfolioUrl}" style="display:inline-block; background:rgb(6,182,212); border-radius:5px; color:#fff; padding:12px 20px; text-decoration:none; font-weight:bold;">Go Back to Portfolio</a>

  </div>
</div>
`;

export const emailBodyToOwner = (subject: string, name: string, email: string, message: string) => `<div style="max-width:600px; margin:auto; font-family:Arial, sans-serif; background-color:#000; color:#fff; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.5);">
  <h2 style=" color:#eee"> message from your portfolio</h2>
  

  <hr style="border: 1px solid #333; margin:20px 0;" />

  <div style="background:#111; padding:15px; border-radius:8px;">
    <h3 style="color:#eee;">📌 Subject</h3>
    <p style="color:#eee;">${subject}</p>

    <h3 style="color:#eee;">👤 Name</h3>
    <p style="color:#eee;">${name}</p>

    <h3 style="color:#eee;">📧 Email</h3>
    <p style="color:#eee;">${email}</p>

    <h3 style="color:#eee;">💬 Message</h3>
    <p style="color:#eee;">${message}</p>
  </div>

</div>`;