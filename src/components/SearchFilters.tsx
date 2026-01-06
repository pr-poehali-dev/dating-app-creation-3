import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface SearchFiltersState {
  ageRange: [number, number];
  distance: number;
  verified: boolean;
  selectedInterests: string[];
}

interface SearchFiltersProps {
  filters: SearchFiltersState;
  onChange: (filters: SearchFiltersState) => void;
  activeFiltersCount: number;
}

const availableInterests = [
  'Путешествия',
  'Йога',
  'Музыка',
  'Искусство',
  'Фотография',
  'Природа',
  'Книги',
  'Кино',
  'Технологии',
  'Спорт',
  'Кулинария',
  'Мода',
  'Танцы',
  'Животные',
  'Игры',
  'Наука'
];

export default function SearchFilters({ filters, onChange, activeFiltersCount }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFiltersState>(filters);

  const handleApply = () => {
    onChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: SearchFiltersState = {
      ageRange: [18, 50],
      distance: 50,
      verified: false,
      selectedInterests: []
    };
    setLocalFilters(defaultFilters);
    onChange(defaultFilters);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = localFilters.selectedInterests.includes(interest)
      ? localFilters.selectedInterests.filter(i => i !== interest)
      : [...localFilters.selectedInterests, interest];
    
    setLocalFilters({ ...localFilters, selectedInterests: newInterests });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-full relative">
          <Icon name="SlidersHorizontal" size={18} className="mr-2" />
          Фильтры
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Фильтры поиска</SheetTitle>
        </SheetHeader>

        <div className="space-y-8 mt-6 pb-24">
          <Card className="p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Icon name="Calendar" size={18} className="text-primary" />
                  Возраст
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  От {localFilters.ageRange[0]} до {localFilters.ageRange[1]} лет
                </p>
              </div>
            </div>
            <Slider
              value={localFilters.ageRange}
              onValueChange={(value) => setLocalFilters({ ...localFilters, ageRange: value as [number, number] })}
              min={18}
              max={70}
              step={1}
              className="mt-4"
            />
          </Card>

          <Card className="p-5 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Icon name="MapPin" size={18} className="text-primary" />
                  Расстояние
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  До {localFilters.distance} км от вас
                </p>
              </div>
            </div>
            <Slider
              value={[localFilters.distance]}
              onValueChange={(value) => setLocalFilters({ ...localFilters, distance: value[0] })}
              min={1}
              max={100}
              step={1}
              className="mt-4"
            />
          </Card>

          <Card className="p-5 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="ShieldCheck" size={18} className="text-primary" />
                <div>
                  <h3 className="font-semibold">Только проверенные</h3>
                  <p className="text-sm text-muted-foreground">Профили с верификацией</p>
                </div>
              </div>
              <Switch
                checked={localFilters.verified}
                onCheckedChange={(checked) => setLocalFilters({ ...localFilters, verified: checked })}
              />
            </div>
          </Card>

          <Card className="p-5 space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Sparkles" size={18} className="text-primary" />
              <div>
                <h3 className="font-semibold">Интересы</h3>
                <p className="text-sm text-muted-foreground">Выберите общие увлечения</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={localFilters.selectedInterests.includes(interest) ? 'default' : 'outline'}
                  className={`px-3 py-2 cursor-pointer transition-all ${
                    localFilters.selectedInterests.includes(interest)
                      ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>

            {localFilters.selectedInterests.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Выбрано: {localFilters.selectedInterests.length}
                </p>
              </div>
            )}
          </Card>

          <div className="pt-4 space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs text-muted-foreground text-center px-4">
              Фильтры помогают найти людей с похожими интересами и целями. Чем точнее настройки, тем лучше совпадения!
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t space-y-2">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Сбросить
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              Применить
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
