import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, Download } from "lucide-react"

interface GenerateProps {
  traitCategories: {
    name: string;
    assets: {
      id: string;
      name: string;
      url?: string;
      rarity: number;
    }[];
  }[];
  collectionSize: number
  setCollectionSize: (size: number) => void
  isGenerating: boolean
  generationProgress: number
  isDownloading: boolean
  downloadProgress: number
  testImageGeneration: () => void
  generateCollection: () => void
  downloadCollection: () => void
  generatedNFTs: {
    id: string;
    name: string;
    imageUrl: string;
    metadata: Record<string, any>;
    }[]
  generatedCount: number // Add this prop to track actual generated NFT count
}

export default function Generate(props: GenerateProps) {
    return (
        <TabsContent value="generate" className="space-y-6">
          <Card className="bg-black-100 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Generate NFT Collection
              </CardTitle>
              <CardDescription>Generate your NFT collection with unique trait combinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="collection-size">Collection Size</Label>
                  <Input
                    id="collection-size"
                    type="number"
                    value={props.collectionSize}
                    onChange={(e) => props.setCollectionSize(Number.parseInt(e.target.value))}
                    min={1}
                    max={10000}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Number of unique NFTs to generate</p>
                </div>

                {props.isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating NFTs...</span>
                      <span>{Math.round(props.generationProgress)}%</span>
                    </div>
                    <Progress value={props.generationProgress} />
                  </div>
                )}

                {props.isDownloading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preparing download...</span>
                      <span>{Math.round(props.downloadProgress)}%</span>
                    </div>
                    <Progress value={props.downloadProgress} />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={props.testImageGeneration} disabled={props.traitCategories.length === 0} variant="outline">
                    Test Single Image
                  </Button>
                  <Button
                    onClick={props.generateCollection}
                    disabled={props.isGenerating || props.traitCategories.length === 0}
                    size="lg"
                  >
                    {props.isGenerating ? "Generating..." : "Generate Collection"}
                  </Button>

                  {props.generatedCount > 0 && (
                    <Button
                      onClick={props.downloadCollection}
                      disabled={props.isDownloading}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      {props.isDownloading ? "Preparing..." : `Download Collection (${props.generatedCount})`}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
    ); 
}