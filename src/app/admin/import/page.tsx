"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Download,
  FileSpreadsheet
} from "lucide-react";

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    setError(null);
    setResult(null);
    if (!file) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/codes/import", { method: "POST", body: file });
      if (!res.ok) { 
        const data = await res.json();
        setError(data.error || "Ошибка импорта"); 
        return; 
      }
      const data = await res.json();
      setResult(`✅ Успешно импортировано: ${data.imported} кодов`);
      setFile(null);
    } catch {
      setError("Ошибка импорта файла");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Upload className="w-8 h-8" />
          Импорт кодов
        </h1>
        <p className="text-gray-600 mt-1">Загрузка кодов из CSV или Excel файлов</p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Инструкции по импорту
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Поддерживаемые форматы:</h4>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <FileSpreadsheet className="w-3 h-3" />
                CSV
              </Badge>
              <Badge variant="outline" className="gap-1">
                <FileSpreadsheet className="w-3 h-3" />
                Excel (.xlsx, .xls)
              </Badge>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Обязательные колонки:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">code</Badge>
                <span className="text-sm">код активации (формат: RBX100-XXXX-XXXX)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">nominal</Badge>
                <span className="text-sm">номинал в Robux (число)</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Опциональные колонки:</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline">status</Badge>
              <span className="text-sm">статус кода (active/used, по умолчанию: active)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example CSV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Пример CSV файла
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre>{`code,nominal,status
RBX100-1234-5678,100,active
RBX100-ABCD-EFGH,500,active
RBX100-WXYZ-1234,1000,active`}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Загрузить файл
          </CardTitle>
          <CardDescription>
            Выберите файл для импорта кодов в систему
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Выберите файл</Label>
            <Input 
              id="file-upload"
              type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {file && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <Badge variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Готов к загрузке
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={upload} 
            disabled={!file || loading}
            className="w-full gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Импорт...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Загрузить и импортировать
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Messages */}
      {result && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}


