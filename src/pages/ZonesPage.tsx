import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Share2, Inbox } from 'lucide-react';

const ZONES = [
  { id: 'arizona', name: 'Arizona', description: 'Share and receive items in Arizona campus' },
  { id: 'california', name: 'California', description: 'Share and receive items in California campus' },
];

export default function ZonesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-4">Select Your Zone</h1>
        <p className="text-lg text-muted-foreground">Choose a campus zone to start sharing or receiving items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {ZONES.map((zone) => (
          <Card key={zone.id} className="shadow-card hover:shadow-hover transition-shadow animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-6 h-6 text-primary" />
                <CardTitle>{zone.name}</CardTitle>
              </div>
              <CardDescription>{zone.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => navigate(`/share-zone/${zone.id}`)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Zone
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/receive-zone/${zone.id}`)}
              >
                <Inbox className="w-4 h-4 mr-2" />
                Receive Zone
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
