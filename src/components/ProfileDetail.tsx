import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProfileDetailProps {
  profile: {
    id: number;
    name: string;
    age: number;
    bio: string;
    verified: boolean;
    interests: string[];
    photos: number;
    location?: string;
    work?: string;
    education?: string;
    height?: string;
    lookingFor?: string;
  };
  onBack: () => void;
  onLike?: () => void;
  onMessage?: () => void;
}

const mockPhotos = [
  { id: 1, color: 'from-pink-300 to-rose-300' },
  { id: 2, color: 'from-purple-300 to-indigo-300' },
  { id: 3, color: 'from-orange-300 to-amber-300' },
  { id: 4, color: 'from-blue-300 to-cyan-300' },
  { id: 5, color: 'from-green-300 to-emerald-300' },
  { id: 6, color: 'from-violet-300 to-fuchsia-300' }
];

export default function ProfileDetail({ profile, onBack, onLike, onMessage }: ProfileDetailProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const photos = mockPhotos.slice(0, profile.photos);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h2 className="text-lg font-semibold">{profile.name}</h2>
        </div>

        <div className="relative">
          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            <DialogTrigger asChild>
              <div className="relative h-[500px] cursor-pointer overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${photos[selectedPhotoIndex]?.color} flex items-center justify-center transition-all duration-300`}>
                  <Avatar className="w-48 h-48 border-4 border-white shadow-2xl">
                    <AvatarFallback className="text-6xl bg-primary text-primary-foreground">
                      {profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {profile.verified && (
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg animate-scale-in">
                    <Icon name="BadgeCheck" size={24} className="text-primary" />
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex gap-1">
                  {photos.map((photo, idx) => (
                    <button
                      key={photo.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIndex(idx);
                      }}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        idx === selectedPhotoIndex
                          ? 'bg-white'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </DialogTrigger>

            <DialogContent className="max-w-md p-0 gap-0">
              <div className="relative">
                <div className={`h-[600px] bg-gradient-to-br ${photos[selectedPhotoIndex]?.color} flex items-center justify-center`}>
                  <Avatar className="w-64 h-64 border-4 border-white shadow-2xl">
                    <AvatarFallback className="text-8xl bg-primary text-primary-foreground">
                      {profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex gap-2 justify-center">
                    {photos.map((photo, idx) => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`w-16 h-16 rounded-lg border-2 transition-all ${
                          idx === selectedPhotoIndex
                            ? 'border-white scale-105'
                            : 'border-white/40 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-full h-full rounded-lg bg-gradient-to-br ${photo.color}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPhotoIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                  >
                    <Icon name="ChevronLeft" size={24} />
                  </Button>
                )}

                {selectedPhotoIndex < photos.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                  >
                    <Icon name="ChevronRight" size={24} />
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
            {onLike && (
              <Button
                size="lg"
                onClick={onLike}
                className="rounded-full w-14 h-14 bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-transform shadow-xl"
              >
                <Icon name="Heart" size={24} />
              </Button>
            )}
            {onMessage && (
              <Button
                size="lg"
                onClick={onMessage}
                className="rounded-full w-14 h-14 shadow-xl hover:scale-110 transition-transform"
              >
                <Icon name="MessageCircle" size={24} />
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6 mt-8">
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  {profile.name}
                  <span className="text-xl text-muted-foreground font-normal">
                    {profile.age}
                  </span>
                </h1>
                {profile.location && (
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <Icon name="MapPin" size={16} />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
              </div>
              {profile.verified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Icon name="ShieldCheck" size={14} />
                  Проверен
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed text-base">{profile.bio}</p>
          </div>

          {profile.interests.length > 0 && (
            <Card className="p-5 space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={18} className="text-primary" />
                <h3 className="font-semibold">Интересы</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1.5 text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {profile.work && (
              <Card className="p-4 flex items-start gap-3">
                <Icon name="Briefcase" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Работа</p>
                  <p className="font-medium">{profile.work}</p>
                </div>
              </Card>
            )}

            {profile.education && (
              <Card className="p-4 flex items-start gap-3">
                <Icon name="GraduationCap" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Образование</p>
                  <p className="font-medium">{profile.education}</p>
                </div>
              </Card>
            )}

            {profile.height && (
              <Card className="p-4 flex items-start gap-3">
                <Icon name="Ruler" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Рост</p>
                  <p className="font-medium">{profile.height}</p>
                </div>
              </Card>
            )}

            {profile.lookingFor && (
              <Card className="p-4 flex items-start gap-3">
                <Icon name="Heart" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ищу</p>
                  <p className="font-medium">{profile.lookingFor}</p>
                </div>
              </Card>
            )}
          </div>

          <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>Все профили проходят проверку для вашей безопасности. Если что-то кажется подозрительным, сообщите нам.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
