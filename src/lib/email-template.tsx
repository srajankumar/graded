import * as React from "react";

interface EmailTemplateProps {
  Message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  Message,
}) => (
  <div>
    <h1>Hello Student 👋</h1>
    <h2>{Message}</h2>
  </div>
);
