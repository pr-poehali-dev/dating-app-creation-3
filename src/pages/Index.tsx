import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileDetail from '@/components/ProfileDetail';
import SearchFilters, { SearchFiltersState } from '@/components/SearchFilters';
import ChatWindow from '@/components/ChatWindow';

interface Profile {
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
  distance?: number;
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: 'Анна',
    age: 26,
    bio: 'Люблю путешествия, йогу и хорошую музыку. Ищу искренние отношения 🌸',
    verified: true,
    interests: ['Путешествия', 'Йога', 'Музыка'],
    photos: 4,
    location: 'Москва, в 5 км от вас',
    work: 'Маркетолог в IT-компании',
    education: 'МГУ, факультет журналистики',
    height: '168 см',
    lookingFor: 'Серьёзные отношения',
    distance: 5
  },
  {
    id: 2,
    name: 'Мария',
    age: 24,
    bio: 'Фотограф и художник. Обожаю закаты и долгие прогулки ✨',
    verified: true,
    interests: ['Искусство', 'Фотография', 'Природа'],
    photos: 6,
    location: 'Москва, в 3 км от вас',
    work: 'Фотограф-фрилансер',
    education: 'Академия художеств',
    height: '165 см',
    lookingFor: 'Знакомство и общение',
    distance: 3
  },
  {
    id: 3,
    name: 'София',
    age: 28,
    bio: 'Работаю в IT, в свободное время читаю книги и смотрю сериалы 📚',
    verified: false,
    interests: ['Книги', 'Кино', 'Технологии'],
    photos: 3,
    location: 'Москва, в 7 км от вас',
    work: 'Frontend разработчик',
    education: 'МФТИ',
    height: '172 см',
    lookingFor: 'Серьёзные отношения',
    distance: 7
  }
];

const mockLikes = [
  { id: 1, name: 'Елена', age: 25, mutual: true },
  { id: 2, name: 'Виктория', age: 27, mutual: false },
  { id: 3, name: 'Дарья', age: 23, mutual: true }
];

const mockMessages = [
  { id: 1, name: 'Анна', lastMessage: 'Привет! Как дела?', time: '10:30', unread: 2 },
  { id: 2, name: 'Мария', lastMessage: 'Давай встретимся сегодня?', time: 'Вчера', unread: 0 },
  { id: 3, name: 'София', lastMessage: 'Спасибо за интересную беседу!', time: '2 дня', unread: 0 }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [openChat, setOpenChat] = useState<{ name: string; initial: string; verified: boolean } | null>(null);
  const [filters, setFilters] = useState<SearchFiltersState>({
    ageRange: [18, 50],
    distance: 50,
    verified: false,
    selectedInterests: []
  });

  const filteredProfiles = useMemo(() => {
    return mockProfiles.filter(profile => {
      if (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1]) {
        return false;
      }

      if (profile.distance && profile.distance > filters.distance) {
        return false;
      }

      if (filters.verified && !profile.verified) {
        return false;
      }

      if (filters.selectedInterests.length > 0) {
        const hasCommonInterest = profile.interests.some(interest =>
          filters.selectedInterests.includes(interest)
        );
        if (!hasCommonInterest) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const currentProfile = filteredProfiles[currentProfileIndex];

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50) count++;
    if (filters.distance !== 50) count++;
    if (filters.verified) count++;
    if (filters.selectedInterests.length > 0) count++;
    return count;
  }, [filters]);

  const handleLike = () => {
    setLikedProfiles([...likedProfiles, currentProfile.id]);
    nextProfile();
  };

  const handleSkip = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentProfileIndex < filteredProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const handleFiltersChange = (newFilters: SearchFiltersState) => {
    setFilters(newFilters);
    setCurrentProfileIndex(0);
  };

  if (openChat) {
    return (
      <ChatWindow
        contactName={openChat.name}
        contactInitial={openChat.initial}
        verified={openChat.verified}
        onBack={() => setOpenChat(null)}
      />
    );
  }

  if (selectedProfile) {
    return (
      <ProfileDetail
        profile={selectedProfile}
        onBack={() => setSelectedProfile(null)}
        onLike={() => {
          handleLike();
          setSelectedProfile(null);
        }}
        onMessage={() => {
          setOpenChat({
            name: selectedProfile.name,
            initial: selectedProfile.name[0],
            verified: selectedProfile.verified
          });
          setSelectedProfile(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LoveConnect
          </h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Bell" size={20} />
          </Button>
        </header>

        <main className="flex-1 overflow-auto pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden" />

            <TabsContent value="search" className="p-4 mt-0 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center flex-1">
                    <h2 className="text-xl font-semibold mb-1">Найди свою половинку</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredProfiles.length === 0 
                        ? 'Нет профилей по фильтрам' 
                        : `${filteredProfiles.length} ${filteredProfiles.length === 1 ? 'профиль' : 'профилей'}`}
                    </p>
                  </div>
                  <SearchFilters 
                    filters={filters} 
                    onChange={handleFiltersChange}
                    activeFiltersCount={activeFiltersCount}
                  />
                </div>

                {filteredProfiles.length === 0 ? (
                  <Card className="p-8 text-center space-y-4 animate-fade-in">
                    <div className="w-20 h-20 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
                      <Icon name="Search" size={32} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Нет подходящих профилей</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Попробуйте изменить фильтры, чтобы увидеть больше людей
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => handleFiltersChange({
                          ageRange: [18, 50],
                          distance: 50,
                          verified: false,
                          selectedInterests: []
                        })}
                      >
                        Сбросить фильтры
                      </Button>
                    </div>
                  </Card>
                ) : currentProfile ? (
                  <Card 
                    className="overflow-hidden border-2 border-border shadow-lg animate-scale-in cursor-pointer"
                    onClick={() => setSelectedProfile(currentProfile)}
                  >
                    <div className="relative h-96 bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                      <div className="text-center">
                        <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white shadow-xl">
                          <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                            {currentProfile.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Badge className="bg-white text-primary hover:bg-white">
                          {currentProfile.photos} фото
                        </Badge>
                      </div>
                      {currentProfile.verified && (
                        <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                          <Icon name="BadgeCheck" size={24} className="text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold flex items-center gap-2">
                            {currentProfile.name}
                            <span className="text-lg text-muted-foreground font-normal">
                              {currentProfile.age}
                            </span>
                          </h3>
                        </div>
                        {currentProfile.verified && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Icon name="ShieldCheck" size={14} />
                            Проверен
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">{currentProfile.bio}</p>

                      <div className="flex flex-wrap gap-2">
                        {currentProfile.interests.map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="px-3 py-1">
                            {interest}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 rounded-full border-2 hover:scale-105 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSkip();
                          }}
                        >
                          <Icon name="X" size={24} />
                        </Button>
                        <Button
                          size="lg"
                          className="flex-1 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike();
                          }}
                        >
                          <Icon name="Heart" size={24} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : null}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="p-4 mt-0 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Твои лайки</h2>
                <p className="text-sm text-muted-foreground">Люди, которым ты понравился</p>
              </div>

              <div className="space-y-3">
                {mockLikes.map((like, idx) => (
                  <Card
                    key={like.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {like.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{like.name}</h3>
                            <span className="text-sm text-muted-foreground">{like.age}</span>
                          </div>
                          {like.mutual && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              <Icon name="Heart" size={12} className="mr-1" />
                              Взаимная симпатия
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => setOpenChat({ name: like.name, initial: like.name[0], verified: like.mutual })}
                      >
                        <Icon name="MessageCircle" size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="p-4 mt-0 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Сообщения</h2>
                <p className="text-sm text-muted-foreground">Твои беседы</p>
              </div>

              <div className="space-y-2">
                {mockMessages.map((msg, idx) => (
                  <Card
                    key={msg.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    onClick={() => setOpenChat({ name: msg.name, initial: msg.name[0], verified: true })}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-14 h-14 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                          {msg.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{msg.name}</h3>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{msg.lastMessage}</p>
                          {msg.unread > 0 && (
                            <Badge className="ml-2 rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs">
                              {msg.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="p-4 mt-0 animate-fade-in">
              <div className="space-y-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-secondary text-white">
                      Я
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">Твой профиль</h2>
                  <Badge variant="secondary" className="mt-2">
                    <Icon name="BadgeCheck" size={14} className="mr-1" />
                    Профиль проверен
                  </Badge>
                </div>

                <Card className="p-6 space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="User" size={18} className="mr-3" />
                    Редактировать профиль
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Settings" size={18} className="mr-3" />
                    Настройки
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="ShieldCheck" size={18} className="mr-3" />
                    Верификация
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="HelpCircle" size={18} className="mr-3" />
                    Помощь и поддержка
                  </Button>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Shield" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Безопасность превыше всего</h3>
                      <p className="text-sm text-muted-foreground">
                        Мы проверяем все профили и следим за соблюдением правил безопасности
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
          <div className="max-w-md mx-auto px-4 py-3 flex justify-around items-center">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'search' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Search" size={24} />
              <span className="text-xs font-medium">Поиск</span>
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                activeTab === 'likes' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Heart" size={24} />
              <span className="text-xs font-medium">Лайки</span>
              <Badge className="absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full">
                3
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                activeTab === 'messages' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="MessageCircle" size={24} />
              <span className="text-xs font-medium">Чаты</span>
              <Badge className="absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full">
                2
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="User" size={24} />
              <span className="text-xs font-medium">Профиль</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Index;