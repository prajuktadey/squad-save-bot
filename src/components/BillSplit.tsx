import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PixelMascot } from './PixelMascot';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus, Loader2 } from 'lucide-react';

interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedTo: string[]; // Array of person IDs
}

interface Person {
  id: string;
  name: string;
}

export const BillSplit = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [billImage, setBillImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [items, setItems] = useState<BillItem[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'oops!',
        description: 'please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'file too big!',
        description: 'please upload an image under 5mb',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('bills')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('bills')
        .getPublicUrl(data.path);

      setBillImage(publicUrl);
      
      toast({
        title: 'success',
        description: 'bill uploaded! now extracting items...',
      });

      // Extract items from bill
      await extractItems(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'upload failed',
        description: 'something went wrong uploading your bill',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const extractItems = async (imageUrl: string) => {
    setIsExtracting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('extract-bill-items', {
        body: { imageUrl }
      });

      if (error) throw error;

      const extractedItems = data.items.map((item: any, index: number) => ({
        id: `item-${index}`,
        name: item.name || 'unknown item',
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        assignedTo: [],
      }));

      setItems(extractedItems);
      
      toast({
        title: 'extraction complete',
        description: `found ${extractedItems.length} items. add people to split the bill!`,
      });
    } catch (error) {
      console.error('Extraction error:', error);
      toast({
        title: 'extraction failed',
        description: 'couldn\'t extract items. try another image?',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const addPerson = () => {
    if (!newPersonName.trim()) return;
    
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: newPersonName.trim(),
    };
    
    setPeople([...people, newPerson]);
    setNewPersonName('');
    
    toast({
      title: 'person added',
      description: `${newPerson.name} is in the squad`,
    });
  };

  const removePerson = (personId: string) => {
    setPeople(people.filter(p => p.id !== personId));
    // Remove person from all items
    setItems(items.map(item => ({
      ...item,
      assignedTo: item.assignedTo.filter(id => id !== personId)
    })));
  };

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (personId: string) => {
    if (!draggedItem) return;
    
    setItems(items.map(item => {
      if (item.id === draggedItem) {
        // Add person if not already assigned
        if (!item.assignedTo.includes(personId)) {
          return { ...item, assignedTo: [...item.assignedTo, personId] };
        }
      }
      return item;
    }));
    
    setDraggedItem(null);
  };

  const togglePersonForItem = (itemId: string, personId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        if (item.assignedTo.includes(personId)) {
          // Remove person
          return { ...item, assignedTo: item.assignedTo.filter(id => id !== personId) };
        } else {
          // Add person
          return { ...item, assignedTo: [...item.assignedTo, personId] };
        }
      }
      return item;
    }));
  };

  const unassignPersonFromItem = (itemId: string, personId: string) => {
    setItems(items.map(item =>
      item.id === itemId 
        ? { ...item, assignedTo: item.assignedTo.filter(id => id !== personId) }
        : item
    ));
  };

  const calculateTotal = (personId: string) => {
    return items
      .filter(item => item.assignedTo.includes(personId))
      .reduce((sum, item) => {
        const splitCount = item.assignedTo.length;
        const splitAmount = (item.price * item.quantity) / splitCount;
        return sum + splitAmount;
      }, 0);
  };

  const resetBill = () => {
    setBillImage(null);
    setItems([]);
    setPeople([]);
    setNewPersonName('');
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">bill split wizard</h2>
        <p className="text-sm text-muted-foreground">
          upload a bill, add your squad, and split it fairly
        </p>
      </div>

      {!billImage ? (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <div className="flex flex-col items-center gap-4">
              <PixelMascot size="md" isAnimating={isUploading} />
              <div>
                <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                <p className="font-medium">
                  {isUploading ? 'uploading...' : 'click to upload bill'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  jpg, png, or webp (max 5mb)
                </p>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bill Image */}
          <div className="relative">
            <img 
              src={billImage} 
              alt="uploaded bill" 
              className="w-full rounded-lg border border-border max-h-64 object-contain"
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={resetBill}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Extraction Loading */}
          {isExtracting && (
            <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-sm">extracting items with ai...</p>
            </div>
          )}

          {/* Add People */}
          <div className="space-y-3">
            <Label>add people</Label>
            <div className="flex gap-2">
              <Input
                placeholder="enter name..."
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              />
              <Button onClick={addPerson} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* People & Items */}
          {people.length > 0 && items.length > 0 && (
            <div className="space-y-4">
              <Label>drag items to people</Label>
              
              {/* All Items - Drag to assign */}
              <div className="space-y-2">
                <p className="text-sm font-medium">all items (drag to people)</p>
                <div className="space-y-2 p-3 bg-muted rounded-lg min-h-[60px]">
                  {items.map(item => {
                    const isAssigned = item.assignedTo.length > 0;
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item.id)}
                        className={`flex items-center justify-between p-2 bg-background rounded border cursor-move hover:border-primary transition-colors ${
                          isAssigned ? 'border-primary/50 opacity-75' : 'border-border'
                        }`}
                      >
                        <span className="text-sm">
                          {item.quantity}x {item.name}
                          {isAssigned && (
                            <span className="ml-2 text-xs text-primary">
                              (assigned to {item.assignedTo.length})
                            </span>
                          )}
                        </span>
                        <span className="text-sm font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* People with their items */}
              {people.map(person => {
                const personItems = items.filter(item => item.assignedTo.includes(person.id));
                const total = calculateTotal(person.id);

                return (
                  <div
                    key={person.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(person.id)}
                    className="space-y-2 p-3 bg-card border border-border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{person.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">₹{total.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePerson(person.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 min-h-[40px]">
                      {personItems.map(item => {
                        const splitCount = item.assignedTo.length;
                        const splitAmount = (item.price * item.quantity) / splitCount;
                        const isShared = splitCount > 1;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                          >
                            <span className="flex items-center gap-2">
                              {item.quantity}x {item.name}
                              {isShared && (
                                <span className="text-xs text-muted-foreground">
                                  (split {splitCount} ways)
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                ₹{splitAmount.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => unassignPersonFromItem(item.id, person.id)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      {personItems.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          drag items here or click items to share
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Grand Total */}
              <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-lg">
                <span className="font-bold">total bill</span>
                <span className="text-xl font-bold">
                  ₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Instructions */}
          {items.length > 0 && people.length === 0 && (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <PixelMascot size="sm" isAnimating />
              <p className="text-sm">add people above to start splitting the bill!</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
