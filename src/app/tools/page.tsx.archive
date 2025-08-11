import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Link from "next/link"

export default function Tools() {
  const tools = [
    {
      name: "METADATA GENERATOR",
      description: "Need metadata for your NFTs? Just upload your images—we'll handle the JSON magic!",
      href: "/tools/metadata",
    },
    {
      name: "ASSETS GENERATOR",
      description: "Need to generate a whole collection? Just upload your traits and we'll do the rest!",
      href: "/tools/assets",
    },
  ]

  return (
    <>
      <Navbar />
      <div className="w-full flex items-center justify-center mt-10">
        <div className="max-w-[1280px] w-full px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#FAFCFF0A] p-4 rounded-xl">
            {tools.map((tool, index) => (
              <Link href={tool.href} key={index}>
                <Card className="text-white bg-[#0C0F18B8] border border-[#2A2D3A] rounded-lg overflow-hidden hover:border-[#3A3D4A] transition-all duration-300 h-[160px] flex flex-col items-center justify-center text-center p-6">
                  <p className="text-xl font-bold mb-4">{tool.name}</p>
                  <p className="text-gray-400 text-sm max-w-[250px]">{tool.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

