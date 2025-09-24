"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, FileText, CheckCircle, AlertCircle, Database, ArrowRight } from "lucide-react"
import { useLoading } from "@/components/loading-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ImportPage() {
  const { setLoading } = useLoading()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResult, setImportResult] = useState<any>(null)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  // Show alert message
  const showAlert = (type: string, message: string) => {
    setAlert({ show: true, type, message })
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000)
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.name.endsWith(".csv")) {
        showAlert("error", "Please select a CSV file")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        showAlert("error", "File size must be less than 10MB")
        return
      }
      setSelectedFile(file)
      setImportResult(null)
    }
  }

  // Download sample template
  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/families/import")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "family-import-template.csv"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        showAlert("success", "Template downloaded successfully")
      }
    } catch (error) {
      showAlert("error", "Failed to download template")
    }
  }

  // Process CSV import
  const processImport = async () => {
    if (!selectedFile) {
      showAlert("error", "Please select a file first")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setLoading(true, "Processing import file...")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/families/import", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (result.success) {
        setImportResult(result.data)
        showAlert("success", result.message)
      } else {
        showAlert("error", result.error)
        if (result.validation_errors) {
          setImportResult({ validation_errors: result.validation_errors })
        }
      }
    } catch (error) {
      console.error("Import error:", error)
      showAlert("error", "Failed to process import")
    } finally {
      setIsUploading(false)
      setLoading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />

      {/* Alert Messages */}
      {alert.show && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className={alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Page Header */}
      <section className="py-8 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">Family Data Import</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bulk import family information from CSV files. Support for up to 2,500 families per import.
            </p>
          </div>

          {/* Import Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">1. Download Template</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Get the CSV template with required columns and sample data
                </CardDescription>
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-4">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">2. Prepare Your Data</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fill in your family data using the template format with required fields
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-4">
                <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">3. Upload & Import</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Upload your CSV file and process the bulk import with validation</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Import Interface */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>Select your family data CSV file for import</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum file size: 10MB. Up to 2,500 families per import.
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Size: {(selectedFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                <Button onClick={processImport} disabled={!selectedFile || isUploading} className="w-full">
                  {isUploading ? (
                    <>Processing Import...</>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Process Import
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Requirements & Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  CSV Requirements
                </CardTitle>
                <CardDescription>Follow these guidelines for successful import</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Required Columns:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• family_name - Full family name</li>
                    <li>• head_of_family - Name of family head</li>
                    <li>• phone - Contact phone number</li>
                    <li>• email - Valid email address</li>
                    <li>• address - Full address</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Optional Columns:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• postal_code - Postal/ZIP code</li>
                    <li>• city - City name</li>
                    <li>• country - Country (default: Canada)</li>
                    <li>• notes - Additional notes</li>
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Use the template to ensure proper formatting. Family IDs will be
                    auto-generated during import.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Import Results */}
          {importResult && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importResult.successful_imports ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {importResult.total_processed && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{importResult.successful_imports}</div>
                      <div className="text-sm text-green-700">Successful Imports</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{importResult.failed_imports}</div>
                      <div className="text-sm text-red-700">Failed Imports</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{importResult.total_processed}</div>
                      <div className="text-sm text-blue-700">Total Processed</div>
                    </div>
                  </div>
                )}

                {importResult.validation_errors && importResult.validation_errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Validation Errors:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {importResult.validation_errors.map((error: string, index: number) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResult.imported_families && (
                  <div>
                    <h4 className="font-medium mb-2">Sample Imported Families:</h4>
                    <div className="space-y-2">
                      {importResult.imported_families.map((family: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">{family.family_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {family.family_id} • {family.head_of_family}
                            </div>
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Imported
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResult.successful_imports > 0 && (
                  <div className="flex justify-center pt-4">
                    <Button asChild>
                      <a href="/sanda-collection">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Go to SANDA Collection
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
