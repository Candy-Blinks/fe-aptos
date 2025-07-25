import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"
import { Settings } from "lucide-react"
import { useState } from "react"

interface TraitCategory {
  name: string
  assets: Asset[]
}

interface Asset {
  id: string
  name: string
  file: File
  url: string
  rarity: number
}

interface LayerOrder {
  categoryName: string
  order: number
  enabled: boolean
}

type LayerProps = {
  layerOrder: LayerOrder[];
  setLayerOrder: (order: LayerOrder[]) => void;
  moveLayer: (fromIndex: number, toIndex: number) => void;
  toggleLayerEnabled: (categoryName: string) => void;
  removeLayerCategory: (categoryName: string) => void;
  traitCategories: TraitCategory[];
}; 

export default function Layer({
  layerOrder,
  setLayerOrder,
  moveLayer,
  toggleLayerEnabled,
  removeLayerCategory,
  traitCategories,
}: LayerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveLayer(draggedIndex, dropIndex)
    }
    
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <TabsContent value="layers" className="space-y-6">
      <Card className="bg-black-100 text-white border-0" >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configure Layer Order
          </CardTitle>
          <CardDescription>
            Drag layers to reorder them. Top layers will be drawn first (background), bottom layers last (foreground).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {layerOrder.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No trait categories yet. Add some categories in the Upload Assets tab first.
            </p>
          ) : (
            <div className="space-y-2">
              {layerOrder
                .sort((a, b) => a.order - b.order)
                .map((layer, index) => (
                  <div
                    key={`${layer.categoryName}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-4 p-4 border border-white-100/25 rounded-lg cursor-move transition-all duration-200 ${
                      layer.enabled ? "bg-background" : "bg-muted/10"
                    } ${
                      draggedIndex === index ? "opacity-50 scale-95" : ""
                    } ${
                      dragOverIndex === index && draggedIndex !== index ? "border-primary bg-primary/10 scale-105" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                      <Badge variant="outline" className="min-w-[40px] text-center">
                        {index + 1}
                      </Badge>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveLayer(index, Math.max(0, index - 1))
                          }}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveLayer(index, Math.min(layerOrder.length - 1, index + 1))
                          }}
                          disabled={index === layerOrder.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          ↓
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium capitalize">{layer.categoryName}</h3>
                        <Badge variant={layer.enabled ? "default" : "secondary"}>
                          {layer.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {traitCategories.find((cat) => cat.name === layer.categoryName)?.assets.length || 0} assets
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLayerEnabled(layer.categoryName)
                        }}
                      >
                        {layer.enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeLayerCategory(layer.categoryName)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {layerOrder.length > 0 && (
            <div className="mt-6 p-4 bg-white-100/10 rounded-lg">
              <h4 className="font-medium mb-2">Layer Order Preview:</h4>
              <div className="flex flex-wrap gap-2">
                {layerOrder
                  .filter((layer) => layer.enabled)
                  .sort((a, b) => a.order - b.order)
                  .map((layer, index) => (
                    <Badge key={layer.categoryName} variant="outline">
                      {index + 1}. {layer.categoryName}
                    </Badge>
                  ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This is the order layers will be drawn (left = background, right = foreground)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>        
  )
}