"use client"

import { useState, useRef, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JSZip from "jszip"
import Navbar from "@/components/navbar"
import UploadContent from "@/views/tools/assets/upload"
import Layer from "@/views/tools/assets/layer"
import Rarity from "@/views/tools/assets/rarity"
import Generate from "@/views/tools/assets/generate"
import Preview from "@/views/tools/assets/preview"

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
  id: number | string 
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
  const [previewGeneratedNFTs, setPreviewGeneratedNFTs] = useState<GeneratedNFT[]>([]) // New state for preview-generated NFTs
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [collectionSize, setCollectionSize] = useState(100)
  const [previewNFT, setPreviewNFT] = useState<GeneratedNFT | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layerOrder, setLayerOrder] = useState<LayerOrder[]>([])

  const addTraitCategory = useCallback((categoryName: string) => {
    // Check if category already exists to prevent duplicates
    const categoryExists = traitCategories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())
    
    if (!categoryExists) {
      const newCategory: TraitCategory = {
        name: categoryName,
        assets: [],
      }
      setTraitCategories(prev => [...prev, newCategory])
      
      // Add to layer order if not already present
      setLayerOrder(prev => {
        const layerExists = prev.some(layer => layer.categoryName.toLowerCase() === categoryName.toLowerCase())
        if (!layerExists) {
          return [...prev, {
            categoryName,
            order: prev.length,
            enabled: true,
          }]
        }
        return prev
      })
    }
  }, [traitCategories])

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
    const BATCH_SIZE = 50 // Process 25 NFTs at a time for better performance

    for (let batchStart = 0; batchStart < collectionSize; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, collectionSize)
      const batchSize = batchEnd - batchStart

      // Generate batch in parallel
      const batchPromises = Array.from({ length: batchSize }, async (_, index) => {
        const nftIndex = batchStart + index
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

        return {
          id: nftIndex + 1,
          traits,
          canvas,
        }
      })

      // Wait for current batch to complete
      const batchResults = await Promise.all(batchPromises)
      nfts.push(...batchResults)

      // Update progress
      const progress = (batchEnd / collectionSize) * 100
      setGenerationProgress(progress)

      // Small delay to prevent UI freezing and allow progress update
      await new Promise(resolve => setTimeout(resolve, 10))
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

    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      const zip = new JSZip()
      const imagesFolder = zip.folder("images")
      const metadataFolder = zip.folder("metadata")

      const totalNFTs = generatedNFTs.length // Use actual generated NFTs count
      const BATCH_SIZE = 50 // Process 50 NFTs at a time
      let processedCount = 0

      // Process NFTs in batches for better performance
      for (let batchStart = 0; batchStart < totalNFTs; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, totalNFTs)
        const batch = generatedNFTs.slice(batchStart, batchEnd)

        // Process batch in parallel
        const batchPromises = batch.map(async (nft) => {
          if (nft.canvas) {
            // Convert canvas to blob in parallel
            const imageBlob = await new Promise<Blob>((resolve) => {
              nft.canvas!.toBlob((blob) => resolve(blob!), "image/png", 0.8) // Add compression
            })

            // Add files to zip
            imagesFolder?.file(`${nft.id}.png`, imageBlob)

            // Generate metadata
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
        })

        // Wait for current batch to complete
        await Promise.all(batchPromises)
        processedCount += batch.length

        // Update progress
        const progress = (processedCount / totalNFTs) * 90 // 90% for processing files
        setDownloadProgress(progress)

        // Small delay to prevent UI freezing
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      // Final step: generating ZIP (10% of progress)
      setDownloadProgress(95)
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 3 }, // Faster compression (was 6)
        streamFiles: true, // Enable streaming for better performance
      })
      
      setDownloadProgress(100)
      
      // Download the file
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `nft-collection-${Date.now()}.zip`
      a.click()
      URL.revokeObjectURL(url)

      // Reset after a short delay
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
      }, 1000)

    } catch (error) {
      console.error("Error downloading collection:", error)
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }, [generatedNFTs])

  const generatePreview = useCallback(async () => {
    if (traitCategories.length === 0) return

    const traits = generateNFTTraits()
    const canvas = await generateNFTImage(traits)

    // Create unique ID to avoid conflicts with generated NFTs
    const uniqueId = `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create new preview NFT
    const newPreviewNFT: GeneratedNFT = {
      id: uniqueId, // Use unique ID instead of sequential number
      traits,
      canvas,
    }

    // Add to preview-generated NFTs collection
    setPreviewGeneratedNFTs(prev => [...prev, newPreviewNFT])
    
    // Set as current preview NFT
    setPreviewNFT(newPreviewNFT)
  }, [traitCategories, generateNFTTraits, generateNFTImage])

  // Transform GeneratedNFT to the format expected by Generate component
  const transformNFTToDisplayFormat = useCallback((nft: GeneratedNFT) => ({
    id: nft.id.toString(),
    name: `NFT #${nft.id}`,
    imageUrl: nft.canvas ? nft.canvas.toDataURL() : "/placeholder.svg",
    metadata: {
      traits: nft.traits,
    },
  }), [])

  const handlePreviewNFTChange = useCallback((nft: {
    id: string;
    name: string;
    imageUrl: string;
    metadata: Record<string, any>;
  } | null) => {
    if (!nft) {
      setPreviewNFT(null)
      return
    }

    // Find the original NFT from generated collection
    const originalNFT = previewGeneratedNFTs.find(n => n.id.toString() === nft.id)
    if (originalNFT) {
      setPreviewNFT(originalNFT)
    } else if (nft.metadata.traits) {
      // Transform if not found in collection (for preview generation)
      const canvas = document.createElement("canvas")
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext("2d")
      
      if (ctx && nft.imageUrl !== "/placeholder.svg") {
        const img = new Image()
        img.src = nft.imageUrl
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }

      setPreviewNFT({
        id: parseInt(nft.id, 10),
        traits: nft.metadata.traits,
        canvas,
      })
    }
  }, [generatedNFTs])

  const handleFolderUpload = useCallback((files: FileList) => {
    const newCategories: { [categoryName: string]: TraitCategory } = {}
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const pathParts = file.webkitRelativePath.split("/")
        
        if (pathParts.length >= 3) {
          const traitName = pathParts[1].toLowerCase() // Normalize to lowercase
          const rarityFolder = pathParts[2].toLowerCase()
          const rarityPercentage = DEFAULT_RARITY_MAPPING[rarityFolder] || 25

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

    // Add new categories to state, avoiding duplicates
    Object.values(newCategories).forEach((category) => {
      setTraitCategories(prev => {
        const existingIndex = prev.findIndex(cat => cat.name.toLowerCase() === category.name.toLowerCase())
        
        if (existingIndex >= 0) {
          // Category exists, merge assets
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            assets: [...updated[existingIndex].assets, ...category.assets]
          }
          return updated
        } else {
          // New category, add it
          return [...prev, category]
        }
      })

      // Add to layer order if not already present
      setLayerOrder(prev => {
        const layerExists = prev.some(layer => layer.categoryName.toLowerCase() === category.name.toLowerCase())
        if (!layerExists) {
          return [...prev, {
            categoryName: category.name,
            order: prev.length,
            enabled: true,
          }]
        }
        return prev
      })
    })
  }, [DEFAULT_RARITY_MAPPING])

  return (
    <>
    <Navbar />
    <div className="container mx-auto p-6 max-w-7xl">

      <Tabs defaultValue="upload" className="space-y-6 p-4 bg-white-100/5 rounded-lg">
        <TabsList className="grid w-full grid-cols-5 bg-black-100">
          <TabsTrigger className="data-[state=active]:bg-white-16 data-[state=active]:text-pink-50" value="upload">Upload Assets</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white-16 data-[state=active]:text-pink-50" value="layers">Layer Order</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white-16 data-[state=active]:text-pink-50" value="rarity">Set Rarity</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white-16 data-[state=active]:text-pink-50" value="preview">Preview</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white-16 data-[state=active]:text-pink-50" value="generate">Generate</TabsTrigger>
        </TabsList>

        <UploadContent 
          addTraitCategory={addTraitCategory}
          traitCategories={traitCategories}
          deleteCategory={deleteCategory}
          handleFileUpload={handleFileUpload}
          handleFolderUpload={handleFolderUpload}
          removeAsset={removeAsset}
          defaultRarityMapping={DEFAULT_RARITY_MAPPING}
        />

        <Layer 
          layerOrder={layerOrder}
          setLayerOrder={setLayerOrder}
          moveLayer={moveLayer}
          toggleLayerEnabled={toggleLayerEnabled}
          removeLayerCategory={removeLayerCategory}
          traitCategories={traitCategories}
        />

        <Rarity
          traitCategories={traitCategories}
          updateAssetRarity={updateAssetRarity}
        />

        <Generate 
          traitCategories={traitCategories}
          collectionSize={collectionSize}
          setCollectionSize={setCollectionSize}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          isDownloading={isDownloading}
          downloadProgress={downloadProgress}
          testImageGeneration={testImageGeneration}
          generateCollection={generateCollection}
          downloadCollection={downloadCollection}
          generatedNFTs={generatedNFTs.map(transformNFTToDisplayFormat)}
          generatedCount={generatedNFTs.length}
        />

        <Preview
          previewGeneratedNFTs={previewGeneratedNFTs.map(transformNFTToDisplayFormat)}
          previewNFT={previewNFT ? transformNFTToDisplayFormat(previewNFT) : null}
          setPreviewNFT={handlePreviewNFTChange}
          generatePreview={generatePreview} 
          traitCategories={traitCategories.map(cat => ({
            name: cat.name,
            assets: cat.assets.map(asset => ({
              id: asset.id,
              name: asset.name,
              imageUrl: asset.url,
              metadata: {
                rarity: asset.rarity,
                file: asset.file,
              },
            })),
          }))}
        />
      </Tabs>

      <canvas ref={canvasRef} className="hidden" />
    </div>
    </>
  )
}
