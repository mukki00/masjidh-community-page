"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, FileText, CheckCircle, AlertCircle, Database, ArrowRight, UserPlus } from "lucide-react"
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
import { AuthGuard } from "@/components/auth-guard"
import { log } from "console"

export default function ImportPage() {
  const { setLoading } = useLoading()
  const [activeTab, setActiveTab] = useState<"bulk" | "single">("bulk")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResult, setImportResult] = useState<any>(null)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  const [singleForm, setSingleForm] = useState({
    family_code: "",
    family_name: "",
    id_card_no: "",
    phone: "",
    sanda_amount: "",
    arrears: "",
  })
  const [isSavingSingle, setIsSavingSingle] = useState(false)

  const handleSingleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingleForm({ ...singleForm, [e.target.name]: e.target.value })
  }

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!singleForm.family_code.trim() || !singleForm.family_name.trim() || !singleForm.sanda_amount.trim()) {
      showAlert("error", "Family Code, Family Name, and SANDA Amount are required.")
      return
    }
    setIsSavingSingle(true)
    setLoading(true, "Saving family record...")
    try {
      const res = await fetch("/api/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_code: singleForm.family_code.trim().toUpperCase(),
          family_name: singleForm.family_name.trim(),
          id_card_no: singleForm.id_card_no.trim(),
          phone: singleForm.phone.trim(),
          sanda_amount: parseFloat(singleForm.sanda_amount),
          arrears: singleForm.arrears ? parseFloat(singleForm.arrears) : 0,
        }),
      })
      const result = await res.json()
      if (result.success) {
        showAlert("success", `Family "${result.data.family_name}" (${result.data.family_code}) added successfully.`)
        setSingleForm({ family_code: "", family_name: "", id_card_no: "", phone: "", sanda_amount: "", arrears: "" })
      } else {
        showAlert("error", result.error || "Failed to add family")
      }
    } catch {
      showAlert("error", "Failed to add family")
    } finally {
      setIsSavingSingle(false)
      setLoading(false)
    }
  }

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
        console.log(result.data);
        setImportResult(result.data)
        showAlert("success", result.message)
      } else {
        showAlert("error", result.error)
        if (result.validation_errors) {
          console.log(result.validation_errors);
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
    <AuthGuard>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Family Records</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Add families one by one or bulk import from a CSV file.
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

          {/* Tab Toggle */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === "single"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Add Single Family
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === "bulk"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Upload className="w-4 h-4" />
              Bulk CSV Import
            </button>
          </div>

          {/* Single Family Form */}
          {activeTab === "single" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Add Family Record
                  </CardTitle>
                  <CardDescription>Enter the details for a new family</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSingleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="family_code">
                          Family Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="family_code"
                          name="family_code"
                          placeholder="e.g. FAM001"
                          value={singleForm.family_code}
                          onChange={handleSingleFormChange}
                          disabled={isSavingSingle}
                          className="uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="family_name">
                          Family Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="family_name"
                          name="family_name"
                          placeholder="e.g. Abdul Rahman"
                          value={singleForm.family_name}
                          onChange={handleSingleFormChange}
                          disabled={isSavingSingle}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="id_card_no">NIC / ID Card No.</Label>
                      <Input
                        id="id_card_no"
                        name="id_card_no"
                        placeholder="e.g. 123456789V"
                        maxLength={12}
                        value={singleForm.id_card_no}
                        onChange={handleSingleFormChange}
                        disabled={isSavingSingle}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="e.g. 0771234567"
                        value={singleForm.phone}
                        onChange={handleSingleFormChange}
                        disabled={isSavingSingle}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="sanda_amount">
                          SANDA Amount (LKR) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sanda_amount"
                          name="sanda_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g. 5000"
                          value={singleForm.sanda_amount}
                          onChange={handleSingleFormChange}
                          disabled={isSavingSingle}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="arrears">Arrears (LKR)</Label>
                        <Input
                          id="arrears"
                          name="arrears"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g. 0"
                          value={singleForm.arrears}
                          onChange={handleSingleFormChange}
                          disabled={isSavingSingle}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSavingSingle}>
                      {isSavingSingle ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Family
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Field Guide
                  </CardTitle>
                  <CardDescription>What each field means</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-sm space-y-3">
                    <li>
                      <span className="font-medium text-foreground">Family Code</span>
                      <span className="ml-1 text-xs text-red-500 font-medium">required</span>
                      <p className="text-muted-foreground mt-0.5">Unique identifier for the family (e.g. FAM001). Must not already exist.</p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Family Name</span>
                      <span className="ml-1 text-xs text-red-500 font-medium">required</span>
                      <p className="text-muted-foreground mt-0.5">Full name of the head of family.</p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">NIC / ID Card No.</span>
                      <p className="text-muted-foreground mt-0.5">National ID card number, up to 12 characters.</p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Phone Number</span>
                      <p className="text-muted-foreground mt-0.5">Primary contact number for the family.</p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">SANDA Amount</span>
                      <span className="ml-1 text-xs text-red-500 font-medium">required</span>
                      <p className="text-muted-foreground mt-0.5">Monthly SANDA contribution amount in LKR.</p>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Arrears</span>
                      <p className="text-muted-foreground mt-0.5">Outstanding balance carried forward. Defaults to 0.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bulk CSV Import */}
          {activeTab === "bulk" && (
          <>
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
                    <li>• family_code - Unique family code</li>
                    <li>• family_name - Full family name</li>
                    <li>• id_card_no - NIC card number of family head</li>
                    <li>• phone - Contact phone number</li>
                    <li>• sanda_amount - Amount of sanda</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Optional Columns:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• arrears - Arrears amount</li>
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Use the template to ensure proper formatting.
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
                      <div className="text-2xl font-bold text-red-600">{importResult.validation_errors.length > 0 ? importResult.validation_errors.length : importResult.duplicate_keys.length > 0 ? importResult.duplicate_keys.length : 0}</div>
                      <div className="text-sm text-red-700">Failed Imports</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{importResult.total_processed}</div>
                      <div className="text-sm text-blue-700">Total Processed</div>
                    </div>
                  </div>
                )}

                
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Validation Errors:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {importResult.validation_errors.length > 0 ? (importResult.validation_errors.map((error: string, index: number) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))) : importResult.duplicate_keys.length > 0 ? (importResult.duplicate_keys.map((error: string, index: number) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))) : (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          No validation errors
                        </div>
                      ) }
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Sample Imported Families:</h4>
                    <div className="space-y-2">
                      
                      {importResult.imported_families.length > 0? (importResult.imported_families.map((family: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">{family.family_code}</div>
                            
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Imported
                          </Badge>
                        </div>
                      )))
                      : (<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">No records have been imported.</div>
                          </div>
                        </div>)
                      }
                    </div>
                  </div>   

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
          </> 
          )} {/* end bulk tab */}
        </div>
      </section>
      <Footer />
    </div>
    </AuthGuard>
  )
}
