import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/**
 * ESGExtractorMain serves as the primary container for the entire
 * ESG report extraction feature. It will orchestrate the file upload,
 * progress display, and results view.
 */
const ESGExtractorMain = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>ESG Report Extractor</CardTitle>
        <CardDescription>
          Upload a sustainability report to automatically extract key ESG metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Other components like FileUploadInterface and ResultsDisplay will be added here in later stories */}
        <p>Feature implementation in progress...</p>
      </CardContent>
    </Card>
  );
};

export default ESGExtractorMain;