import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

export default function Lightning({ lnurl }) {
  const [qrCode, setQrCode] = useState();

  useEffect(() => {
    (async () => {
      if (lnurl) {
        const output = await QRCode.toDataURL(lnurl, { margin: 2, width: 500 });
        setQrCode(output);
      } else {
        setQrCode(null);
      }
    })();
  }, [lnurl]);

  if (!qrCode) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Image
        src={qrCode}
        alt="Login with lightning - QRCode"
        width={500}
        height={500}
      />

      <br />

      <button onClick={() => window.location.assign(lnurl)}>
        Open Lightning Wallet
      </button>
    </div>
  );
}
