import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  onScan: (isbn: string) => void;
  active: boolean;
}

function isValidBookISBN(code: string): boolean {
  return /^(978|979)\d{10}$/.test(code);
}

export default function Scanner({ onScan, active }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'scanner-region';

  useEffect(() => {
    if (!active) return;

    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 150 } },
        (decodedText) => {
          const code = decodedText.replace(/[^0-9]/g, '');
          if (isValidBookISBN(code)) {
            scanner.stop().catch(() => {});
            onScan(code);
          }
        },
        () => {}
      )
      .catch((err) => {
        console.error('カメラ起動エラー:', err);
      });

    return () => {
      scanner.stop().catch(() => {});
      scanner.clear();
    };
  }, [active, onScan]);

  return <div id={containerId} className="scanner-container" />;
}
