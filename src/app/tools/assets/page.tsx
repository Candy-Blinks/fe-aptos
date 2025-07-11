"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Upload, Download, ImageIcon, Trash2, Eye, Settings } from "lucide-react"
import JSZip from "jszip"

interface Asset {
  id: string
  name: string
  file: File
  url: string
  rarity: number
}

interface TraitCategory {
  name: string
  assets: Asset[]
}

interface GeneratedNFT {
  id: number
  traits: { [category: string]: Asset }
  canvas?: HTMLCanvasElement
}

interface LayerOrder {
  categoryName: string
  order: number
  enabled: boolean
}

interface RarityMapping {
  [key: string]: number
}

const DEFAULT_RARITY_MAPPING: RarityMapping = {
  COMMON: 50,
  UNCOMMON: 40,
  RARE: 30,
  EPIC: 20,
  LEGENDARY: 10,
  MYTHIC: 5,
  ULTRA_RARE: 3,
  SUPER_RARE: 15,
  VERY_RARE: 8,
}

export default function NFTGenerator() {
  const [traitCategories, setTraitCategories] = useState<TraitCategory[]>([])
  const [generatedNFTs, setGeneratedNFTs] = useState<GeneratedNFT[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [collectionSize, setCollectionSize] = useState(100)
  const [previewNFT, setPreviewNFT] = useState<GeneratedNFT | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layerOrder, setLayerOrder] = useState<LayerOrder[]>([])

  const addTraitCategory = useCallback(
    (categoryName: string) => {
      if (!traitCategories.find((cat) => cat.name === categoryName)) {
        setTraitCategories((prev) => [...prev, { name: categoryName, assets: [] }])
        // Add to layer order with next available order number
        setLayerOrder((prev) => [...prev, { categoryName, order: prev.length, enabled: true }])
      }
    },
    [traitCategories],
  )

  const handleFileUpload = useCallback((categoryName: string, files: FileList) => {
    const newAssets: Asset[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const asset: Asset = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ""),
          file,
          url: URL.createObjectURL(file),
          rarity: 50, // Default rarity
        }
        newAssets.push(asset)
      }
    })

    setTraitCategories((prev) =>
      prev.map((cat) => (cat.name === categoryName ? { ...cat, assets: [...cat.assets, ...newAssets] } : cat)),
    )
  }, [])

  const updateAssetRarity = useCallback((categoryName: string, assetId: string, rarity: number) => {
    setTraitCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              assets: cat.assets.map((asset) => (asset.id === assetId ? { ...asset, rarity } : asset)),
            }
          : cat,
      ),
    )
  }, [])

  const removeAsset = useCallback((categoryName: string, assetId: string) => {
    setTraitCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName ? { ...cat, assets: cat.assets.filter((asset) => asset.id !== assetId) } : cat,
      ),
    )
  }, [])

  const moveLayer = useCallback((fromIndex: number, toIndex: number) => {
    setLayerOrder((prev) => {
      const newOrder = [...prev]
      const [movedItem] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, movedItem)

      // Update order numbers
      return newOrder.map((item, index) => ({ ...item, order: index }))
    })
  }, [])

  const toggleLayerEnabled = useCallback((categoryName: string) => {
    setLayerOrder((prev) =>
      prev.map((layer) => (layer.categoryName === categoryName ? { ...layer, enabled: !layer.enabled } : layer)),
    )
  }, [])

  const removeLayerCategory = useCallback((categoryName: string) => {
    setTraitCategories((prev) => prev.filter((cat) => cat.name !== categoryName))
    setLayerOrder((prev) => prev.filter((layer) => layer.categoryName !== categoryName))
  }, [])

  const selectTraitBasedOnRarity = useCallback((assets: Asset[]): Asset | null => {
    if (assets.length === 0) return null

    const totalWeight = assets.reduce((sum, asset) => sum + asset.rarity, 0)
    let random = Math.random() * totalWeight

    for (const asset of assets) {
      random -= asset.rarity
      if (random <= 0) return asset
    }

    return assets[assets.length - 1]
  }, [])

  const deleteCategory = useCallback(
    (categoryName: string) => {
      // Remove from trait categories
      setTraitCategories((prev) => prev.filter((cat) => cat.name !== categoryName))
      // Remove from layer order
      setLayerOrder((prev) => prev.filter((layer) => layer.categoryName !== categoryName))

      // Clean up blob URLs to prevent memory leaks
      const categoryToDelete = traitCategories.find((cat) => cat.name === categoryName)
      if (categoryToDelete) {
        categoryToDelete.assets.forEach((asset) => {
          URL.revokeObjectURL(asset.url)
        })
      }
    },
    [traitCategories],
  )

  const generateNFTTraits = useCallback((): { [category: string]: Asset } => {
    const traits: { [category: string]: Asset } = {}

    traitCategories.forEach((category) => {
      const selectedAsset = selectTraitBasedOnRarity(category.assets)
      if (selectedAsset) {
        traits[category.name] = selectedAsset
      }
    })

    return traits
  }, [traitCategories, selectTraitBasedOnRarity])

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      // Don't set crossOrigin for blob URLs
      if (!src.startsWith("blob:")) {
        img.crossOrigin = "anonymous"
      }
      img.onload = () => {
        console.log(`Image loaded successfully: ${src}`)
        resolve(img)
      }
      img.onerror = (error) => {
        console.error(`Failed to load image: ${src}`, error)
        reject(error)
      }
      img.src = src
    })
  }

  const generateNFTImage = useCallback(
    async (traits: { [category: string]: Asset }): Promise<HTMLCanvasElement> => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      // Set canvas size
      canvas.width = 512
      canvas.height = 512

      // Fill with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      console.log("Generating NFT with traits:", Object.keys(traits))

      // Sort traits based on user-defined layer order
      const sortedLayers = layerOrder
        .filter((layer) => layer.enabled && traits[layer.categoryName])
        .sort((a, b) => a.order - b.order)

      console.log(
        "Layer order:",
        sortedLayers.map((l) => l.categoryName),
      )

      // Draw each layer in order
      for (const layer of sortedLayers) {
        const asset = traits[layer.categoryName]
        if (asset) {
          try {
            console.log(`Loading layer ${layer.order}: ${layer.categoryName} - ${asset.name}`)
            const img = await loadImage(asset.url)

            // Draw the image to fill the entire canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            console.log(`Successfully drew layer: ${layer.categoryName}`)
          } catch (error) {
            console.error(`Failed to load/draw image for ${layer.categoryName}:`, error)
          }
        }
      }

      return canvas
    },
    [layerOrder],
  )

  const testImageGeneration = useCallback(async () => {
    if (traitCategories.length === 0) {
      console.log("No trait categories available for testing")
      return
    }

    console.log("Testing image generation...")
    const traits = generateNFTTraits()
    console.log("Generated traits for test:", traits)

    try {
      const canvas = await generateNFTImage(traits)
      console.log("Test image generated successfully")

      // Create a test download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "test-nft.png"
          a.click()
          URL.revokeObjectURL(url)
          console.log("Test image downloaded")
        }
      }, "image/png")
    } catch (error) {
      console.error("Test image generation failed:", error)
    }
  }, [traitCategories, generateNFTTraits, generateNFTImage])

  const generateCollection = useCallback(async () => {
    if (traitCategories.length === 0) return

    setIsGenerating(true)
    setGenerationProgress(0)

    const nfts: GeneratedNFT[] = []
    const usedCombinations = new Set<string>()

    for (let i = 0; i < collectionSize; i++) {
      let traits: { [category: string]: Asset }
      let combinationKey: string
      let attempts = 0

      // Try to generate unique combination
      do {
        traits = generateNFTTraits()
        combinationKey = Object.values(traits)
          .map((t) => t.id)
          .sort()
          .join("-")
        attempts++
      } while (usedCombinations.has(combinationKey) && attempts < 100)

      if (attempts < 100) {
        usedCombinations.add(combinationKey)
      }

      const canvas = await generateNFTImage(traits)

      nfts.push({
        id: i + 1,
        traits,
        canvas,
      })

      setGenerationProgress(((i + 1) / collectionSize) * 100)
    }

    setGeneratedNFTs(nfts)
    setIsGenerating(false)

    // Set first NFT as preview
    if (nfts.length > 0) {
      setPreviewNFT(nfts[0])
    }
  }, [traitCategories, collectionSize, generateNFTTraits, generateNFTImage])

  const downloadCollection = useCallback(async () => {
    if (generatedNFTs.length === 0) return

    const zip = new JSZip()
    const imagesFolder = zip.folder("images")
    const metadataFolder = zip.folder("metadata")

    for (const nft of generatedNFTs) {
      if (nft.canvas) {
        // Add image
        const imageBlob = await new Promise<Blob>((resolve) => {
          nft.canvas!.toBlob((blob) => resolve(blob!), "image/png")
        })
        imagesFolder?.file(`${nft.id}.png`, imageBlob)

        // Add metadata
        const metadata = {
          name: `NFT #${nft.id}`,
          description: `Generated NFT with unique traits`,
          image: `${nft.id}.png`,
          attributes: Object.entries(nft.traits).map(([trait_type, asset]) => ({
            trait_type,
            value: asset.name,
          })),
        }
        metadataFolder?.file(`${nft.id}.json`, JSON.stringify(metadata, null, 2))
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nft-collection-${Date.now()}.zip`
    a.click()
    URL.revokeObjectURL(url)
  }, [generatedNFTs])

  const generatePreview = useCallback(async () => {
    if (traitCategories.length === 0) return

    const traits = generateNFTTraits()
    const canvas = await generateNFTImage(traits)

    setPreviewNFT({
      id: 0,
      traits,
      canvas,
    })
  }, [traitCategories, generateNFTTraits, generateNFTImage])

  const handleFolderUpload = useCallback((files: FileList) => {
    const newCategories: { [categoryName: string]: TraitCategory } = {}

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Parse the file path: assets/TRAIT/RARITY/filename.ext
        const pathParts = file.webkitRelativePath.split("/")

        if (pathParts.length >= 3) {
          const traitName = pathParts[pathParts.length - 3].toLowerCase()
          const rarityName = pathParts[pathParts.length - 2].toUpperCase()

          // Get rarity percentage from mapping, default to 25% if not found
          const rarityPercentage = DEFAULT_RARITY_MAPPING[rarityName] || 25

          const asset: Asset = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name.replace(/\.[^/.]+$/, ""),
            file,
            url: URL.createObjectURL(file),
            rarity: rarityPercentage,
          }

          // Initialize category if it doesn't exist
          if (!newCategories[traitName]) {
            newCategories[traitName] = {
              name: traitName,
              assets: [],
            }
          }

          newCategories[traitName].assets.push(asset)
        }
      }
    })

    // Add new categories to state
    Object.values(newCategories).forEach((category) => {
      setTraitCategories((prev) => {
        const existingCategory = prev.find((cat) => cat.name === category.name)
        if (existingCategory) {
          // Merge with existing category
          return prev.map((cat) =>
            cat.name === category.name ? { ...cat, assets: [...cat.assets, ...category.assets] } : cat,
          )
        } else {
          // Add new category and layer order
          setLayerOrder((prevLayers) => [
            ...prevLayers,
            { categoryName: category.name, order: prevLayers.length, enabled: true },
          ])
          return [...prev, category]
        }
      })
    })

    console.log(
      `Processed folder upload: ${Object.keys(newCategories).length} categories, ${Object.values(newCategories).reduce((sum, cat) => sum + cat.assets.length, 0)} total assets`,
    )
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">NFT Collection Generator</h1>
        <p className="text-muted-foreground">
          Upload layered assets, set trait rarities, and generate unique NFT collections
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload">Upload Assets</TabsTrigger>
          <TabsTrigger value="layers">Layer Order</TabsTrigger>
          <TabsTrigger value="rarity">Set Rarity</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Trait Assets
              </CardTitle>
              <CardDescription>
                Upload images for different trait categories (background, body, head, accessories, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Method 1: Individual Category Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Method 1</Badge>
                  <h3 className="text-lg font-semibold">Individual Category Upload</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add categories one by one and upload images for each trait type.
                </p>

                <div className="flex gap-2">
                  <Input
                    placeholder="Enter trait category name (e.g., head, body, background)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const input = e.target as HTMLInputElement
                        if (input.value.trim()) {
                          addTraitCategory(input.value.trim())
                          input.value = ""
                        }
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="trait category"]') as HTMLInputElement
                      if (input?.value.trim()) {
                        addTraitCategory(input.value.trim())
                        input.value = ""
                      }
                    }}
                  >
                    Add Category
                  </Button>
                </div>

                <div className="grid gap-4">
                  {traitCategories.map((category) => (
                    <Card key={category.name}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg capitalize">{category.name}</CardTitle>
                            <CardDescription>{category.assets.length} assets uploaded</CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteCategory(category.name)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Category
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleFileUpload(category.name, e.target.files)
                                }
                              }}
                            />
                          </div>

                          {category.assets.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {category.assets.map((asset) => (
                                <div key={asset.id} className="relative group">
                                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                    <img
                                      src={asset.url || "/placeholder.svg"}
                                      alt={asset.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => removeAsset(category.name, asset.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <p className="text-sm font-medium mt-2 truncate">{asset.name}</p>
                                  <Badge variant="secondary" className="text-xs">
                                    {asset.rarity}% rarity
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Method 2: Folder Structure Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Method 2</Badge>
                  <h3 className="text-lg font-semibold">Folder Structure Upload</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload an entire assets folder with predefined structure and automatic rarity assignment.
                </p>

                <Card className="border-dashed border-2">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <h4 className="text-lg font-semibold">Upload Assets Folder</h4>
                        <p className="text-sm text-muted-foreground">
                          Select your assets folder with the structure: assets/TRAIT/RARITY/images
                        </p>
                      </div>

                      <Input
                        type="file"
                        webkitdirectory="true"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleFolderUpload(e.target.files)
                          }
                        }}
                        className="max-w-sm mx-auto"
                      />

                      <div className="text-xs text-muted-foreground space-y-2">
                        <p>
                          <strong>Expected folder structure:</strong>
                        </p>
                        <div className="bg-muted p-3 rounded text-left font-mono text-xs">
                          assets/
                          <br />
                          ├── body/
                          <br />│ ├── common/
                          <br />│ │ ├── body1.png
                          <br />│ │ └── body2.png
                          <br />│ ├── rare/
                          <br />│ │ └── body3.png
                          <br />│ └── legendary/
                          <br />│ └── body4.png
                          <br />
                          └── head/
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;├── common/
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;│ └── head1.png
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;└── epic/
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── head2.png
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rarity Mapping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {Object.entries(DEFAULT_RARITY_MAPPING).map(([rarity, percentage]) => (
                        <div key={rarity} className="flex justify-between p-2 bg-muted rounded">
                          <span className="font-medium">{rarity}</span>
                          <span>{percentage}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Folder names not in this list will default to 25% rarity
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configure Layer Order
              </CardTitle>
              <CardDescription>
                Drag to reorder layers. Top layers will be drawn first (background), bottom layers last (foreground).
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
                        key={layer.categoryName}
                        className={`flex items-center gap-4 p-4 border rounded-lg ${
                          layer.enabled ? "bg-background" : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="min-w-[40px] text-center">
                            {index + 1}
                          </Badge>
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveLayer(index, Math.max(0, index - 1))}
                              disabled={index === 0}
                              className="h-6 w-6 p-0"
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveLayer(index, Math.min(layerOrder.length - 1, index + 1))}
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
                          <Button size="sm" variant="outline" onClick={() => toggleLayerEnabled(layer.categoryName)}>
                            {layer.enabled ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeLayerCategory(layer.categoryName)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {layerOrder.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
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

        <TabsContent value="rarity" className="space-y-6">
          <Card>
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
                  <h3 className="text-lg font-semibold capitalize">{category.name}</h3>
                  <div className="grid gap-4">
                    {category.assets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={asset.url || "/placeholder.svg"}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{asset.name}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Label className="text-sm">Rarity:</Label>
                            <div className="flex-1 max-w-xs">
                              <Slider
                                value={[asset.rarity]}
                                onValueChange={([value]) => updateAssetRarity(category.name, asset.id, value)}
                                max={100}
                                min={1}
                                step={1}
                                className="flex-1"
                              />
                            </div>
                            <Badge variant="outline" className="min-w-[60px] text-center">
                              {asset.rarity}%
                            </Badge>
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

        <TabsContent value="generate" className="space-y-6">
          <Card>
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
                    value={collectionSize}
                    onChange={(e) => setCollectionSize(Number.parseInt(e.target.value) || 100)}
                    min={1}
                    max={10000}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Number of unique NFTs to generate</p>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating NFTs...</span>
                      <span>{Math.round(generationProgress)}%</span>
                    </div>
                    <Progress value={generationProgress} />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={testImageGeneration} disabled={traitCategories.length === 0} variant="outline">
                    Test Single Image
                  </Button>
                  <Button
                    onClick={generateCollection}
                    disabled={isGenerating || traitCategories.length === 0}
                    size="lg"
                  >
                    {isGenerating ? "Generating..." : "Generate Collection"}
                  </Button>

                  {generatedNFTs.length > 0 && (
                    <Button
                      onClick={downloadCollection}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Download Collection
                    </Button>
                  )}
                </div>

                {generatedNFTs.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Collection Generated!</strong> {generatedNFTs.length} unique NFTs created. Download
                      includes images and metadata files.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview NFTs
              </CardTitle>
              <CardDescription>Preview generated NFTs and their trait combinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button onClick={generatePreview} disabled={traitCategories.length === 0}>
                  Generate Random Preview
                </Button>
              </div>

              {previewNFT && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Preview Image</h3>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden max-w-md">
                      {previewNFT.canvas && (
                        <img
                          src={previewNFT.canvas.toDataURL() || "/placeholder.svg"}
                          alt={`NFT #${previewNFT.id}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Traits</h3>
                    <div className="space-y-3">
                      {Object.entries(previewNFT.traits).map(([category, asset]) => (
                        <div key={category} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium capitalize">{category}</p>
                            <p className="text-sm text-muted-foreground">{asset.name}</p>
                          </div>
                          <Badge variant="secondary">{asset.rarity}% rarity</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {generatedNFTs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Generated Collection</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {generatedNFTs.slice(0, 12).map((nft) => (
                      <div
                        key={nft.id}
                        className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => setPreviewNFT(nft)}
                      >
                        {nft.canvas && (
                          <img
                            src={nft.canvas.toDataURL() || "/placeholder.svg"}
                            alt={`NFT #${nft.id}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {generatedNFTs.length > 12 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Showing first 12 of {generatedNFTs.length} generated NFTs. Click any NFT to preview.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
