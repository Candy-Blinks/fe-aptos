import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type PreviewProps = {
  previewGeneratedNFTs: {
    id: string;
    name: string;
    imageUrl: string;
    metadata: Record<string, any>;
  }[];
    previewNFT: {
        id: string;
        name: string;
        imageUrl: string;
        metadata: Record<string, any>;
    } | null;
    setPreviewNFT: (nft: {
        id: string;
        name: string;
        imageUrl: string;
        metadata: Record<string, any>;
    } | null) => void;
    generatePreview: () => void;
    traitCategories: {
        name: string;
        assets: {
            id: string;
            name: string;
            imageUrl: string;
            metadata: Record<string, any>;
        }[];
    }[];
}

export default function Preview({ previewGeneratedNFTs, previewNFT, setPreviewNFT, generatePreview, traitCategories }: PreviewProps) {
    return (
            <TabsContent value="preview" className="space-y-6">
            <Card className="bg-black-100 text-white border-0">
                <CardHeader className="flex flex-row mx-2 justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Preview NFTs
                        </CardTitle>
                        <CardDescription>Preview generated NFTs and their trait combinations</CardDescription>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={generatePreview} disabled={traitCategories.length === 0}>
                        Generate Random Preview
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">

                {previewNFT && (
                    <div className="grid md:grid-cols-2 gap-6 border border-white-16 rounded-lg p-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Preview Image</h3>
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden max-w-md">
                        <img
                            src={previewNFT.imageUrl || "/placeholder.svg"}
                            alt={`NFT #${previewNFT.id}`}
                            className="w-full h-full object-cover"
                        />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Traits</h3>
                        <div className="space-y-3">
                        {Object.entries(previewNFT.metadata.traits).map(([category, asset]) => {
                            const trait = asset as { name: string; rarity: number };
                            return (
                                <div key={category} className="flex justify-between items-center p-3 border border-white-16 rounded">
                                    <div>
                                        <p className="font-medium capitalize">{category}</p>
                                        <p className="text-sm text-muted-foreground">{trait.name}</p>
                                    </div>
                                    <Badge variant="secondary">{trait.rarity}% rarity</Badge>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                    </div>
                )}

                {previewGeneratedNFTs.length > 0 ? (
                    <div>
                    <h3 className="text-lg font-semibold mb-4">Preview Generated Collection</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {previewGeneratedNFTs.slice(0, 12).map((nft) => (
                        <div
                            key={nft.id}
                            className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                            onClick={() => {setPreviewNFT(nft); console.log("Previewing NFT:", nft.id);}}
                        >
                            <img
                                src={nft.imageUrl || "/placeholder.svg"}
                                alt={`NFT #${nft.id}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        ))}
                    </div>
                    {previewGeneratedNFTs.length > 12 && (
                        <p className="text-sm text-muted-foreground mt-4">
                        Showing first 12 of {previewGeneratedNFTs.length} preview generated NFTs. Click any NFT to preview.
                        </p>
                    )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2">No preview NFTs generated yet</p>
                        <p className="text-sm text-muted-foreground">Click "Generate Random Preview" to create preview NFTs</p>
                    </div>
                )}
                </CardContent>
            </Card>
            </TabsContent>
    );
}       