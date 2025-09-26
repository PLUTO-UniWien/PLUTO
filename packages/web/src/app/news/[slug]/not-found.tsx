import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100">
          <FileQuestion className="w-12 h-12 text-gray-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">News Article Not Found</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Sorry, the news article you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="px-6">
            <Link href="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="px-6">
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
