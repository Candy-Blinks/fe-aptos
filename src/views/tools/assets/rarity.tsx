import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label";

type RarityProps = {
  traitCategories: {
    name: string;
    assets: {
      id: string;
      name: string;
      url?: string;
      rarity: number;
    }[];
  }[];
  updateAssetRarity: (categoryName: string, assetId: string, rarity: number) => void;
}

export default function Rarity({ traitCategories, updateAssetRarity }: RarityProps) {
  return (
        <TabsContent value="rarity" className="space-y-6">
          <Card className="bg-black-100 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configure Trait Rarity
              </CardTitle>
              <CardDescription>
                Set the rarity percentage for each trait. Higher values make traits more common.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {traitCategories.map((category) => (
                <div key={category.name} className="space-y-4">
                  <div className="grid gap-4">
                    {category.assets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-4 p-4 border border-white-100/25 rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={asset.url || "/placeholder.svg"}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{asset.name}</p>
                          <div className="flex items-center gap-20 mt-2">
                            <Label className="text-sm capitalize">{category.name}</Label>
                            <div className="flex-1 max-w-xxl">
                              <Slider
                                value={[asset.rarity]}
                                onValueChange={([value]) => updateAssetRarity(category.name, asset.id, value)}
                                max={100}
                                min={1}
                                step={1}
                                className="flex-1 bg-pink-100"
                              />
                            </div>
                            <div className="gap-2 flex items-center">
                                <Label className="text-sm">Rarity:</Label>
                                <Badge variant="outline" className="min-w-[60px] text-center">
                                {asset.rarity}%
                                </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
  )
}
