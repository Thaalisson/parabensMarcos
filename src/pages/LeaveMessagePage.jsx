import { useState } from "react";
import SecretAccess from "../components/SecretAccess";
import MessageForm from "../components/MessageForm";

export default function LeaveMessagePage() {
  const [accessGranted, setAccessGranted] = useState(false);

  return (
    <div className="w-full min-h-screen bg-black text-white flex items-center justify-center p-4">
      {!accessGranted ? (
        <SecretAccess onSuccess={() => setAccessGranted(true)} />
      ) : (
        <MessageForm />
      )}
    </div>
  );
}
