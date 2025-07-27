import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Upload, FolderOpen, Plus, CloudUpload } from "lucide-react"
import { useState, useCallback } from "react"

type UploadContentProps = {
  addTraitCategory: (categoryName: string) => void;
  traitCategories: { name: string; assets: { id: string; url: string; name: string; rarity: number }[] }[];
  deleteCategory: (categoryName: string) => void;
  handleFileUpload: (categoryName: string, files: FileList) => void;
  handleFolderUpload: (files: FileList) => void;
  removeAsset: (categoryName: string, assetId: string) => void;
  defaultRarityMapping: Record<string, number>;
};

export default function UploadContent({ 
    addTraitCategory, 
    traitCategories,
    deleteCategory,
    handleFileUpload,
    handleFolderUpload,
    removeAsset,
    defaultRarityMapping
  }: UploadContentProps) {
  
  const [selectedMethod, setSelectedMethod] = useState<'individual' | 'folder' | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    console.log('Drop event triggered');
    
    // Handle DataTransfer items for folder drops
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const items = Array.from(e.dataTransfer.items);
      console.log('Items dropped:', items.length);
      
      // Process each item
      const folderPromises = items.map(item => {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            return processEntry(entry);
          }
        }
        return Promise.resolve([]);
      });
      
      Promise.all(folderPromises).then(fileArrays => {
        const allFiles = fileArrays.flat();
        console.log('Total files from folders:', allFiles.length);
        
        if (allFiles.length > 0) {
          // Convert to FileList-like object
          const fileList = Object.assign(allFiles, {
            length: allFiles.length,
            item: (index: number) => allFiles[index] || null,
            [Symbol.iterator]: function* (): Iterator<File> {
              for (let i = 0; i < allFiles.length; i++) {
                yield allFiles[i];
              }
            }
          }) as FileList;

          
          handleFolderUpload(fileList);
        } else {
          console.log('No files found in dropped folders');
        }
      }).catch(error => {
        console.error('Error processing dropped folders:', error);
      });
    } else {
      // Fallback to regular file drop
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        console.log('Regular files dropped:', files.length);
        handleFolderUpload(files);
      }
    }
  }, [handleFolderUpload]);

  const processEntry = (entry: any): Promise<File[]> => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          // Add the webkitRelativePath property
          Object.defineProperty(file, 'webkitRelativePath', {
            value: entry.fullPath.substring(1), // Remove leading slash
            writable: false,
            enumerable: true,
            configurable: true
          });
          resolve([file]);
        }, (error: any) => {
          console.error('Error reading file:', error);
          resolve([]);
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const readEntries = () => {
          dirReader.readEntries((entries: any[]) => {
            if (entries.length === 0) {
              resolve([]);
              return;
            }
            
            const promises = entries.map(processEntry);
            Promise.all(promises).then(results => {
              resolve(results.flat());
            });
          }, (error: any) => {
            console.error('Error reading directory:', error);
            resolve([]);
          });
        };
        readEntries();
      } else {
        resolve([]);
      }
    });
  };

  const renderMethodSelection = () => (
    <Card className="bg-black-100 text-white border-0">
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
        <div className="grid md:grid-cols-2">
          {/* Method 1: Individual Category Upload */}
          <Card 
            className="cursor-pointer bg-black-100 text-white border-0 h-full"
            onClick={() => setSelectedMethod('individual')}
          >
            <CardContent className="text-center h-full flex flex-col">
              <div className="space-y-2 border border-white-16 p-4 rounded-lg h-full">
                <div className="flex justify-start items-center gap-2">
                  <Badge variant="outline">Method 1</Badge>
                  <h3 className="text-lg font-semibold">Individual Category Upload</h3>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Add categories one by one and upload images for each trait type.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Method 2: Folder Structure Upload */}
          <Card 
            className="cursor-pointer bg-black-100 text-white border-0"
            onClick={() => setSelectedMethod('folder')}
          >
            <CardContent className="text-center h-full flex flex-col">
              <div className="space-y-2 border border-white-16 p-4 rounded-lg h-full">
                <div className="flex justify-start items-center gap-2">
                  <Badge variant="outline">Method 2</Badge>
                  <h3 className="text-lg font-semibold">Folder Structure Upload</h3>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Upload an entire assets folder with predefined structure and automatic rarity assignment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )

  const renderIndividualMethod = () => (
    <Card className="bg-black-100 text-white border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <div>
              <CardTitle>Individual Category Upload</CardTitle>
              <CardDescription>
                Add categories one by one and upload images for each trait type.
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedMethod(null)}>
            Change Method
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter trait category name (e.g., head, body, background)"
            onKeyDown={(e) => {
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

        <div className="grid gap-4 ">
          {traitCategories.map((category) => (
            <Card className="bg-black-100 text-white border border-white-16 p-4 rounded-lg " key={category.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg capitalize">{category.name}</CardTitle>
                    <CardDescription>{category.assets.length} assets uploaded</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const fileInput = document.getElementById(`file-input-${category.name}`) as HTMLInputElement;
                        fileInput?.click();
                      }}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Assets
                    </Button>
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Hidden file input */}
                  <Input
                    id={`file-input-${category.name}`}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(category.name, e.target.files)
                      }
                    }}
                    className="hidden"
                  />

                  {category.assets.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
                      {category.assets.map((asset) => (
                        <div key={asset.id} className="relative group border border-white-16 p-4 rounded-lg">
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
      </CardContent>
    </Card>
  )

  const renderFolderMethod = () => (
    <Card className="bg-black-100 text-white border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            <div>
              <CardTitle>Folder Structure Upload</CardTitle>
              <CardDescription>
                Upload an entire assets folder with predefined structure and automatic rarity assignment.
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedMethod(null)}>
            Change Method
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="border-dashed bg-black-100 text-white border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div 
                className={`flex flex-col items-center gap-4 border-2 border-dashed p-8 rounded-lg cursor-pointer transition-all duration-200 ${
                  isDragOver 
                    ? 'border-pink-32 bg-pink-32/10 scale-105' 
                    : 'border-white-16 hover:border-pink-32/50 hover:bg-pink-32/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  const fileInput = document.getElementById('folder-upload-input') as HTMLInputElement;
                  fileInput?.click();
                }}
              >
                <CloudUpload className={`mx-auto h-16 w-16 transition-colors duration-200 ${
                  isDragOver ? 'text-pink-32' : 'text-pink-32'
                }`} />
                <div>
                  <h4 className="text-xl font-semibold">
                    {isDragOver ? 'Drop your folder here' : 'Upload Assets Folder'}
                  </h4>
                  <p className="text-base text-white-100 mt-2">
                    Drag your folder here or <span 
                      className="text-pink-32 cursor-pointer underline hover:text-pink-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        const fileInput = document.getElementById('folder-upload-input') as HTMLInputElement;
                        fileInput?.click();
                      }}
                    >
                      browse
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select your assets folder with the structure: assets/TRAIT/RARITY/images
                  </p>
                </div>

                <Input
                  id="folder-upload-input"
                  type="file"
                  {...({ webkitdirectory: "true" } as any)}
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFolderUpload(e.target.files)
                    }
                  }}
                  className="hidden"  
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display uploaded assets by category */}
        {traitCategories.length > 0 && (
          <div className="grid gap-4">
            {traitCategories.map((category) => (
              <Card key={category.name} className="bg-black-100 text-white border border-white-16 p-4 rounded-lg">
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
                  {category.assets.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
                      {category.assets.map((asset) => (
                        <div key={asset.id} className="relative group border border-white-16 p-4 rounded-lg">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-black-100 text-white border-0">
          <CardHeader>
            <CardTitle className="text-sm">Rarity Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-white-4 p-2 rounded">
              {Object.entries(defaultRarityMapping).map(([rarity, percentage]) => (
                <div key={rarity} className="flex justify-between p-2 bg-black-100 rounded">
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
      </CardContent>
    </Card>
  )

  return (
    <TabsContent value="upload" className="space-y-6">
      {selectedMethod === null && renderMethodSelection()}
      {selectedMethod === 'individual' && renderIndividualMethod()}
      {selectedMethod === 'folder' && renderFolderMethod()}
    </TabsContent>
  );
}