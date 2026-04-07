export const securityCodeEmailTemplate = (securityCode: string, link: string) => `
<div style="max-width:600px; margin:auto; font-family:Arial, sans-serif; background-color:#000; color:#fff; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.5);">
  <h2 style="text-align:center; color:#eee;">🔐 Admin Login Access</h2>
  <p style="text-align:center; color:#aaa;">You requested an access code for the portfolio dashboard.</p>

  <hr style="border: 1px solid #333; margin:20px 0;" />

  <div style="background:#111; padding:15px; border-radius:8px; text-align:center;">
    <h3 style="color:#eee; margin-bottom:10px;">Your Security Code</h3>
    <div style="font-size:24px; font-weight:bold; letter-spacing:4px; padding:10px; border-radius:5px; background:#222; color:rgb(6,182,212); border:1px dashed rgb(6,182,212); display:inline-block;">
      ${securityCode}
    </div>
  </div>

  <p style="color:#ccc; font-size:14px; margin-top:20px;">
    🔑 <strong>Security Note:</strong> This code is valid until a new one is generated. Please do not share it with anyone.
  </p>

  <div style="text-align:center; margin-top:30px;">
    <a href="${link}" style="display:inline-block; background:rgb(6,182,212); border-radius:5px; color:#fff; padding:12px 20px; text-decoration:none; font-weight:bold;">Go to Login Page</a>
  </div>

  <hr style="border: 1px solid #333; margin:20px 0;" />
  <p style="text-align:center; font-size:12px; color:#666;">If you did not request this code, please ignore this email.</p>
</div>
`;
