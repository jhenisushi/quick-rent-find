
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login: React.FC = () => {
  const { login, register, isLoading } = useUser();
  const navigate = useNavigate();
  
  // Estado para o formulário de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estado para o formulário de cadastro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  // Estado para erros de validação
  const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    const errors: { [key: string]: string } = {};
    
    if (!loginEmail) {
      errors.email = 'Email é obrigatório';
    }
    
    if (!loginPassword) {
      errors.password = 'Senha é obrigatória';
    }
    
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }
    
    // Limpar erros
    setLoginErrors({});
    
    try {
      await login(loginEmail, loginPassword);
      navigate('/'); // Redirecionar para a página inicial após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    const errors: { [key: string]: string } = {};
    
    if (!registerName) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!registerEmail) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      errors.email = 'Email inválido';
    }
    
    if (!registerPassword) {
      errors.password = 'Senha é obrigatória';
    } else if (registerPassword.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (registerPassword !== registerConfirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
    
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    
    // Limpar erros
    setRegisterErrors({});
    
    try {
      await register(registerName, registerEmail, registerPassword);
      navigate('/'); // Redirecionar para a página inicial após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md p-4">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-6 text-3xl font-bold text-rent-primary">
            RentFind
          </Link>
          <h1 className="text-2xl font-bold">Bem-vindo(a) ao RentFind</h1>
          <p className="text-muted-foreground">
            Faça login ou crie uma conta para começar
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Entre com seu email e senha para acessar sua conta
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={loginErrors.email ? 'border-destructive' : ''}
                    />
                    {loginErrors.email && (
                      <p className="text-sm text-destructive">{loginErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Senha</Label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={loginErrors.password ? 'border-destructive' : ''}
                    />
                    {loginErrors.password && (
                      <p className="text-sm text-destructive">{loginErrors.password}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para criar sua conta
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className={registerErrors.name ? 'border-destructive' : ''}
                    />
                    {registerErrors.name && (
                      <p className="text-sm text-destructive">{registerErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className={registerErrors.email ? 'border-destructive' : ''}
                    />
                    {registerErrors.email && (
                      <p className="text-sm text-destructive">{registerErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className={registerErrors.password ? 'border-destructive' : ''}
                    />
                    {registerErrors.password && (
                      <p className="text-sm text-destructive">{registerErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar senha</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className={registerErrors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {registerErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{registerErrors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
