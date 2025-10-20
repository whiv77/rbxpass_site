"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Lock, AlertTriangle } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch("/api/v1/admin/login", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ password }) 
      });
      
      if (!res.ok) { 
        setError("Неверный пароль"); 
        return; 
      }
      
      window.location.href = "/admin/orders";
    } catch {
      setError("Ошибка подключения");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation currentPage="admin" />

      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">RBXPass</h1>
            <h3 className="mt-2 text-xl font-semibold text-gray-600">Админ панель</h3>
            <p className="mt-2 text-sm text-gray-600">
              Войдите в систему для управления кодами и заказами
            </p>
          </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
            <CardDescription className="text-center">
              Введите пароль администратора для доступа к панели управления
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль администратора</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите пароль"
                  className="font-mono"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Войти в админку
                  </>
                )}
              </Button>
            </form>

            <Separator />

  
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">🔐 Безопасность</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Используйте надежный пароль</li>
                    <li>• Не передавайте доступ третьим лицам</li>
                    <li>• Выходите из системы после работы</li>
                    <li>• Регулярно меняйте пароль</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">ℹ️ Информация</p>
                <p>
                  Админ панель предоставляет полный доступ к управлению системой. 
                  Убедитесь, что вы авторизованы для доступа к этой области.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            RBXPass Admin Panel • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
    </div>
  )}
