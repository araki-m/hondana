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
  const containerId = 'scanner-region';
  const scannedRef = useRef(false);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!active) return;
    scannedRef.current = false;

    const scanner = new Html5Qrcode(containerId);
    let stopped = false;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 150 } },
        (decodedText) => {
          if (scannedRef.current || stopped) return;
          const code = decodedText.replace(/[^0-9]/g, '');
          if (isValidBookISBN(code)) {
            scannedRef.current = true;
            scanner.stop().catch(() => {});
            onScanRef.current(code);
          }
        },
        () => {}
      )
      .catch((err) => {
        console.error('カメラ起動エラー:', err);
      });

    return () => {
      stopped = true;
      scanner.stop().catch(() => {});
      try {
        scanner.clear();
      } catch {
        // DOM already removed by React
      }
    };
  }, [active]);

  return <div id={containerId} className="scanner-container" />;
}
