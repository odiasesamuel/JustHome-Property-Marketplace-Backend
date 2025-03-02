export const signUpEmailTemplate = (name: string, verificationLink: string) => {
  return `
<div style="max-width:600px; margin:20px auto; background-color:#ffffff; border:1px solid #ddd; border-radius:8px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">

    <div style="background-color:#1F4B43; color:#ffffff; text-align:center; padding:15px; font-size:24px; font-weight:bold;">
        Welcome to JustHome
    </div>

    <div style="padding:20px; color:#333; font-size:16px; line-height:1.6;">

        <p style="margin:0 0 15px;">Hi <strong>${name}</strong>,</p>

        <p style="margin:0 0 15px;">
            Welcome to <strong>JustHome</strong>, your trusted marketplace for buying, selling, and renting properties.
        </p>

        <p style="margin:0 0 15px;">With JustHome, you can:</p>

        <ul style="padding-left:20px; margin:0 0 15px;">
            <li>Browse thousands of properties across various locations.</li>
            <li>List your property for sale or rent in just a few clicks.</li>
            <li>Connect directly with property owners and verified agents.</li>
        </ul>

        <p style="margin:0 0 15px;">Get started today and find your perfect property!</p>

        <div style="text-align:center; margin:25px 0;">
            <a href="${verificationLink}" 
               style="display:inline-block; background-color:#E7C873; color:#ffffff; padding:12px 25px; text-decoration:none; font-weight:bold; border-radius:5px; font-size:16px;">
                Verify Your Email
            </a>
        </div>

        <p style="margin:0 0 15px;">
            If you did not sign up for PropertyHub, no further action is required
        </p>

</div>
    `;
};
