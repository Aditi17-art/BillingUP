import { useState } from "react";
import { Upload, FileSpreadsheet, Users, Check, AlertCircle, Download } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ImportParty = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }
    
    setUploadedFile(file);
    setImportStatus("idle");
  };

  const handleImport = async () => {
    if (!uploadedFile) return;
    
    setImportStatus("processing");
    
    // Simulate import process
    setTimeout(() => {
      setImportStatus("success");
      toast.success("Parties imported successfully!");
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    const csvContent = "Name,Phone,Email,Address,GSTIN,Party Type,Opening Balance\n" +
      "Sample Customer,9876543210,sample@email.com,123 Main St,29XXXXX1234X1ZX,customer,0\n" +
      "Sample Vendor,9123456789,vendor@email.com,456 Oak Ave,29XXXXX5678X1ZX,vendor,5000";
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "party_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  return (
    <MobileLayout companyName="Import Party" showBackButton>
      <div className="px-4 py-4 space-y-4">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-5 text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <span className="font-medium">Import Parties</span>
          </div>
          <p className="text-sm opacity-90">
            Quickly add multiple parties by uploading a CSV or Excel file
          </p>
        </div>

        {/* Download Template */}
        <div className="bg-card rounded-2xl p-4 shadow-card animate-slide-up">
          <h3 className="font-semibold text-foreground mb-2">Step 1: Download Template</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Download our template file and fill in your party details
          </p>
          <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2">
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>

        {/* Upload Area */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <h3 className="font-semibold text-foreground">Step 2: Upload File</h3>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">
                {uploadedFile ? uploadedFile.name : "Drop file here or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports CSV, XLS, XLSX
              </p>
            </label>
          </div>

          {uploadedFile && (
            <div className="flex items-center gap-3 p-3 bg-accent rounded-xl">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {importStatus === "success" && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </div>
          )}
        </div>

        {/* Import Status */}
        {importStatus === "success" && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-700 dark:text-green-400">Import Successful</p>
              <p className="text-sm text-green-600 dark:text-green-500">All parties have been added</p>
            </div>
          </div>
        )}

        {/* Import Button */}
        <Button
          onClick={handleImport}
          className="w-full h-12 gap-2"
          disabled={!uploadedFile || importStatus === "processing" || importStatus === "success"}
        >
          {importStatus === "processing" ? (
            <>Processing...</>
          ) : (
            <>
              <Users className="w-4 h-4" />
              Import Parties
            </>
          )}
        </Button>

        {/* Instructions */}
        <div className="bg-card rounded-2xl p-4 shadow-card animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            File Format Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Include column headers in the first row
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Name column is required
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Party Type: "customer" or "vendor"
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Phone numbers without country code
            </li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ImportParty;
