
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { createItem, itemCategories } from '@/services/itemService';
import { useUser } from '@/contexts/UserContext';
import { Location, ItemCategory } from '@/types';

const CreateItem: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const { toast } = useToast();
  
  // Redirecionar para a página de login se o usuário não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ItemCategory,
    pricePerDay: 50,
    maxRentalDays: 7,
    address: '',
    city: '',
    state: '',
    images: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para simular o upload de imagens
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    // Simulando URLs de imagens para cada arquivo selecionado
    const newImages = Array.from(files).map((_, index) => {
      // Usamos URLs aleatórias do Unsplash para simular as imagens carregadas
      const randomId = Math.floor(Math.random() * 1000);
      return `https://source.unsplash.com/random/800x600?item=${randomId}`;
    });
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFormData({
      ...formData,
      pricePerDay: value[0],
    });
  };

  const handleMaxDaysChange = (value: number[]) => {
    setFormData({
      ...formData,
      maxRentalDays: value[0],
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      errors.title = 'O título é obrigatório';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'A descrição é obrigatória';
    }
    
    if (!formData.category) {
      errors.category = 'A categoria é obrigatória';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'O endereço é obrigatório';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'A cidade é obrigatória';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'O estado é obrigatório';
    }
    
    if (formData.images.length === 0) {
      errors.images = 'Adicione pelo menos uma imagem';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Limpar erros
    setFormErrors({});
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular coordenadas de localização
      const location: Location = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        // Coordenadas simuladas para São Paulo
        latitude: -23.55 + (Math.random() * 0.1),
        longitude: -46.63 + (Math.random() * 0.1),
      };
      
      const newItem = await createItem(
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          pricePerDay: formData.pricePerDay,
          maxRentalDays: formData.maxRentalDays,
          images: formData.images,
          location,
          available: true,
        },
        user
      );
      
      toast({
        title: 'Item cadastrado com sucesso!',
        description: 'Seu anúncio já está disponível para visualização.',
      });
      
      // Redirecionar para a página do item
      navigate(`/item/${newItem.id}`);
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      toast({
        title: 'Erro ao cadastrar item',
        description: 'Ocorreu um erro ao cadastrar seu anúncio. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Não renderizar nada enquanto redireciona
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-10 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Criar novo anúncio</h1>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <form onSubmit={handleSubmit}>
                {/* Informações básicas */}
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold">Informações básicas</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título do anúncio</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Ex: Câmera DSLR Canon em ótimo estado"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={formErrors.title ? 'border-destructive' : ''}
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-destructive">{formErrors.title}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Descreva o item com detalhes, condições de uso, etc."
                        rows={5}
                        value={formData.description}
                        onChange={handleInputChange}
                        className={formErrors.description ? 'border-destructive' : ''}
                      />
                      {formErrors.description && (
                        <p className="mt-1 text-sm text-destructive">{formErrors.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger 
                          id="category" 
                          className={formErrors.category ? 'border-destructive' : ''}
                        >
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.category && (
                        <p className="mt-1 text-sm text-destructive">{formErrors.category}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Preço e duração */}
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold">Preço e duração</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="price">Valor por dia</Label>
                        <span className="font-medium text-rent-primary">
                          R$ {formData.pricePerDay.toFixed(2)}
                        </span>
                      </div>
                      <Slider
                        id="price"
                        min={10}
                        max={500}
                        step={5}
                        value={[formData.pricePerDay]}
                        onValueChange={handlePriceChange}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="max-days">Tempo máximo de aluguel</Label>
                        <span className="font-medium">
                          {formData.maxRentalDays} dias
                        </span>
                      </div>
                      <Slider
                        id="max-days"
                        min={1}
                        max={30}
                        step={1}
                        value={[formData.maxRentalDays]}
                        onValueChange={handleMaxDaysChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Localização */}
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold">Localização</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Rua, número, bairro"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={formErrors.address ? 'border-destructive' : ''}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-destructive">{formErrors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="Cidade"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={formErrors.city ? 'border-destructive' : ''}
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-sm text-destructive">{formErrors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          placeholder="Estado (UF)"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={formErrors.state ? 'border-destructive' : ''}
                        />
                        {formErrors.state && (
                          <p className="mt-1 text-sm text-destructive">{formErrors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Fotos */}
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold">Fotos</h2>
                  
                  <div>
                    <Label htmlFor="images" className="block mb-2">
                      Adicione fotos do seu item
                    </Label>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative w-24 h-24 overflow-hidden rounded-md">
                          <img
                            src={image}
                            alt={`Foto ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white rounded-full bg-destructive"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      
                      <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer border-muted-foreground/30 hover:border-primary/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 mb-1 text-muted-foreground"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <span className="text-xs text-muted-foreground">Adicionar</span>
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    
                    {formErrors.images && (
                      <p className="mt-1 text-sm text-destructive">{formErrors.images}</p>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      Adicione pelo menos uma foto do item. Fotos de boa qualidade aumentam as chances de aluguel.
                    </p>
                  </div>
                </div>
                
                {/* Botões de ação */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Publicando...' : 'Publicar anúncio'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateItem;
