import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-primary-foreground py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center justify-items-center w-full max-w-4xl">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image src="/logo-pluto.png" alt="PLUTO Logo" width={150} height={75} />
            </Link>
            <Link
              href="https://politikwissenschaft.univie.ac.at/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo-uniwien.png"
                alt="University of Vienna Logo"
                width={175}
                height={75}
              />
            </Link>
            <Link
              href="https://digitize.univie.ac.at/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image src="/logo-digitize.png" alt="Digitize Logo" width={200} height={75} />
            </Link>
          </div>

          <div className="w-full max-w-4xl pt-8 border-t border-gray-100">
            <div className="flex flex-wrap justify-center gap-8 pb-6">
              <Link href="/imprint" className="text-gray-600 hover:text-primary transition-colors">
                Imprint
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/feedback" className="text-gray-600 hover:text-primary transition-colors">
                Feedback
              </Link>
              <Link href="/news" className="text-gray-600 hover:text-primary transition-colors">
                News
              </Link>
            </div>
            <p className="text-center text-sm text-gray-600">
              University of Vienna, Universitätsring 1, 1010 Vienna, Austria
            </p>
            <p className="text-center text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} PLUTO - Public Value Assessment Tool
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
