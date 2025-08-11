"use client";

import React, { useState, ChangeEvent, MouseEvent } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import Navbar from "@/components/navbar";

type Attribute = {
  trait_type: string;
  value: string;
};

type Metadata = {
  name?: string;
  description?: string;
  attributes: Attribute[];
};

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-9-12v12m0 0l-3.75-3.75M12 16.5l3.75-3.75"
    />
  </svg>
);

const MetadataGenerator: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, Metadata>>({});

  const onDrop = (acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image"));
    const newFiles = [...files, ...imageFiles];
    setFiles(newFiles);
    if (selectedFileIndex === null && imageFiles.length > 0) {
      setSelectedFileIndex(0);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const updateForm = (key: keyof Metadata, value: string) => {
    const filename = files[selectedFileIndex!]?.name || "";
    setFormData((prev) => ({
      ...prev,
      [filename]: {
        ...(prev[filename] || { attributes: [] }),
        [key]: value,
      },
    }));
  };

  const updateAttribute = (index: number, key: keyof Attribute, value: string) => {
    const filename = files[selectedFileIndex!]?.name || "";
    const attributes = formData[filename]?.attributes || [];
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [key]: value };
    setFormData((prev) => ({
      ...prev,
      [filename]: {
        ...(prev[filename] || {}),
        attributes: newAttributes,
      },
    }));
  };

  const addTrait = () => {
    const filename = files[selectedFileIndex!]?.name || "";
    const attributes = formData[filename]?.attributes || [];
    const newAttributes = [...attributes, { trait_type: "", value: "" }];
    setFormData((prev) => ({
      ...prev,
      [filename]: {
        ...(prev[filename] || {}),
        attributes: newAttributes,
      },
    }));
  };

  const deleteTrait = (index: number) => {
    const filename = files[selectedFileIndex!]?.name || "";
    const attributes = formData[filename]?.attributes || [];
    const newAttributes = attributes.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [filename]: {
        ...(prev[filename] || {}),
        attributes: newAttributes,
      },
    }));
  };

  const generateMetadata = async () => {
    const zip = new JSZip();
    files.forEach((file, index) => {
      const filename = file.name;
      const name = filename.split(".")[0];
      const data = formData[filename] || { attributes: [] };
      const metadata = {
        name: data.name || `NFT #${index + 1}`,
        symbol: "CMB",
        description: data.description || "NFT Description",
        seller_fee_basis_points: 500,
        image: filename,
        external_url: "https://candyblinks.fun/",
        edition: index,
        attributes: data.attributes,
        properties: {
          files: [{ uri: filename, type: file.type }],
          category: "image",
        },
      };
      zip.file(`${name}.json`, JSON.stringify(metadata, null, 2));
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "metadata.zip");
  };

  const currentFile = selectedFileIndex !== null ? files[selectedFileIndex] : null;
  const currentFilename = currentFile?.name || "";
  const currentData = formData[currentFilename] || { attributes: [] };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-1 border border-white-4 bg-[#0C0F18CC] p-4 rounded-lg">
          <div>
            <h2 className="font-semibold mb-2">NFT Preview</h2>
            <div className="aspect-square bg-[#0C0F18] border-1 border border-white-4 flex items-center justify-center rounded-md">
              {currentFile ? (
                <Image
                  src={URL.createObjectURL(currentFile)}
                  alt="preview"
                  width={300}
                  height={300}
                  className="object-contain rounded-md"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <UploadIcon className="mx-auto w-12 h-12" />
                  <p>Upload Preview</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="mb-2">Assets Upload</h3>
              <div className="mb-2">
                <Button variant="outline" onClick={() => setFiles([])}>
                  Clear All
                </Button>
              </div>
              <div {...getRootProps()} className="border border-dashed rounded-md p-4 text-center cursor-pointer">
                <input {...getInputProps()} />
                <UploadIcon className="mx-auto w-8 h-8" />
                <p>Click here or Drag and Drop your assets</p>
              </div>
              <div className="space-y-2 mt-4">
                {files.map((file, index) => (
                  <Card
                    key={file.name}
                    onClick={() => setSelectedFileIndex(index)}
                    className={`flex items-center gap-2 p-2 cursor-pointer bg-[#0C0F18] text-white ${
                      selectedFileIndex === index ? "border-primary border-2" : ""
                    }`}
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <span className="flex-1 truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        setFiles((prev) => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata Panel */}
          <div>
            <h2 className="font-semibold mb-2">Metadata Preview</h2>
            <pre className="bg-[#0C0F18] rounded-md p-2 overflow-auto text-sm whitespace-pre-wrap">
              {JSON.stringify(
                {
                  name: currentData.name || `NFT #${(selectedFileIndex ?? 0) + 1}`,
                  description: currentData.description || "...",
                  image: `https://.../${(selectedFileIndex ?? 0) + 1}.png`,
                  attributes: currentData.attributes,
                },
                null,
                2
              )}
            </pre>
            <div className="mt-4 space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={currentData.name || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm("name", e.target.value)}
                  placeholder="Enter Name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={currentData.description || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm("description", e.target.value)}
                  placeholder="Enter Description"
                />
              </div>
              <div>
                <h3 className="mb-2">Traits and Attributes</h3>
                {currentData.attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <Input
                      placeholder="Trait Name"
                      value={attr.trait_type}
                      onChange={(e) => updateAttribute(index, "trait_type", e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, "value", e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteTrait(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addTrait} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" /> Add Trait
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setFormData({})}>
                  Reset Changes
                </Button>
                <Button variant="secondary">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right mt-4">
          <Button onClick={generateMetadata}>Generate Metadata</Button>
        </div>
      </div>
    </div>
  );
};

export default MetadataGenerator;
