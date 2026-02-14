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
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!active) {
      // active が false になったらスキャナを停止
      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .then(() => {
            try { scanner.clear(); } catch { /* ignore */ }
          })
          .catch(() => {
            try { scanner.clear(); } catch { /* ignore */ }
          });
        scannerRef.current = null;
      }
      return;
    }

    // active が true: スキャナを開始
    scannedRef.current = false;
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 150 } },
        (decodedText) => {
          if (scannedRef.current) return;
          const code = decodedText.replace(/[^0-9]/g, '');
          if (isValidBookISBN(code)) {
            scannedRef.current = true;
            // stop せずにコールバックだけ呼ぶ。停止は active=false 経由で行う
            onScanRef.current(code);
          }
        },
        () => {}
      )
      .catch((err) => {
        console.error('カメラ起動エラー:', err);
      });

    return () => {
      scannerRef.current = null;
      scanner
        .stop()
        .then(() => {
          try { scanner.clear(); } catch { /* ignore */ }
        })
        .catch(() => {
          try { scanner.clear(); } catch { /* ignore */ }
        });
    };
  }, [active]);

  return <div id={containerId} className="scanner-container" />;
}
