import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({ region: "us-west-2" });

export const sendRawEmail = async (recipient, subject, bodyText) => {
  const { EMAIL_FROM_ADDRESS } = process.env;
  const sender = EMAIL_FROM_ADDRESS;

  console.log({ sender, recipient, subject, bodyText });

  // NOTE: DON'T CHANGE THE FORMAT OF RAW EMAIL STRING
  const rawEmail = `From: ${sender}
To: ${recipient}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

  ${bodyText}`;

  console.log({ rawEmail });
  // Convert raw email string to a Buffer
  const emailBuffer = Buffer.from(rawEmail);

  // Prepare the command
  const command = new SendRawEmailCommand({
    RawMessage: { Data: emailBuffer },
  });

  try {
    const response = await sesClient.send(command);

    console.log("Email sent successfully!", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
